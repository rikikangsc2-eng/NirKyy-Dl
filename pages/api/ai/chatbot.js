/*
* Lokasi: pages/api/ai/chatbot.js
* Versi: v3
*/

import axios from 'axios';
import { Pool } from 'pg';
import { withCorsAndJson, jsonResponse } from '../../../utils/api-helpers';

export const metadata = {
  name: 'AI Chatbot (Qwen)',
  category: 'AI',
  method: 'POST',
  path: '/ai/chatbot',
  description: 'Berinteraksi dengan model AI (Qwen dari Alibaba Cloud). Endpoint ini menyimpan riwayat percakapan hingga 10 interaksi terakhir per pengguna. Respon mendukung streaming.',
  params: [
    { name: 'user', type: 'text', optional: false, example: 'user_12345' },
    { name: 'prompt', type: 'text', optional: false, example: 'Siapa kamu?' },
    { name: 'system', type: 'text', optional: true, example: 'You are a helpful assistant.' },
    { name: 'stream', type: 'text', optional: true, example: 'false' }
  ]
};

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const CREATE_TABLE_QUERY = `
CREATE TABLE IF NOT EXISTS ai_chat_history (
    user_id TEXT PRIMARY KEY,
    history JSONB,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return jsonResponse(res, 405, { success: false, message: 'Method Not Allowed' });
  }

  const { user, prompt, system, stream } = req.body;

  if (!user || !prompt) {
    return jsonResponse(res, 400, { success: false, message: 'Parameter "user" dan "prompt" diperlukan.' });
  }

  const client = await pool.connect();
  let history = [];

  try {
    await client.query(CREATE_TABLE_QUERY);

    const historyResult = await client.query('SELECT history FROM ai_chat_history WHERE user_id = $1', [user]);
    if (historyResult.rows.length > 0) {
      history = historyResult.rows[0].history || [];
    }

    history.push({ role: 'user', content: prompt });

    const payload = {
      message: `${prompt}`,
      system_prompt: system || 'You are a helpful assistant.',
      use_search: false,
      temperature: 0.8,
      history: history,
    };

    const externalApiUrl = 'https://tecuts-chat.hf.space/chat/stream';
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; RMX2185) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.7204.179 Mobile Safari/537.36',
      'Referer': 'https://chrunos.com/ai-chatbot/',
    };

    const useStream = !(stream === 'false');

    const response = await axios.post(externalApiUrl, payload, { headers, responseType: 'stream' });

    if (useStream) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
    }

    let fullResponse = '';
    let thinkingBlock = false;

    response.data.on('data', (chunk) => {
      const chunkStr = chunk.toString();
      const lines = chunkStr.split('\n').filter(line => line.trim().startsWith('data:'));

      for (const line of lines) {
        try {
            const jsonPart = line.substring(5).trim();
            const parsedData = JSON.parse(jsonPart);

            if (parsedData.type === 'content') {
                if (parsedData.data.includes('<think>')) thinkingBlock = true;
                if (!thinkingBlock) fullResponse += parsedData.data;
                if (parsedData.data.includes('</think>')) thinkingBlock = false;
            }
        } catch (e) {
            // Ignore parsing errors for incomplete chunks
        }
      }

      if (useStream) {
        res.write(chunk);
      }
    });

    response.data.on('end', async () => {
      try {
        history.push({ role: 'assistant', content: fullResponse });
        const finalHistory = history.slice(-20);

        const upsertQuery = `
          INSERT INTO ai_chat_history (user_id, history, last_updated) VALUES ($1, $2, CURRENT_TIMESTAMP)
          ON CONFLICT (user_id) DO UPDATE SET
            history = $2,
            last_updated = CURRENT_TIMESTAMP;
        `;
        await client.query(upsertQuery, [user, JSON.stringify(finalHistory)]);

        if (!useStream) {
            return jsonResponse(res, 200, { success: true, message: 'Respon berhasil diterima.', data: { response: fullResponse } });
        } else {
            res.end();
        }
      } catch (dbError) {
         if (!useStream) {
            return jsonResponse(res, 500, { success: false, message: 'Gagal menyimpan riwayat chat.', data: { details: dbError.message } });
         } else {
            console.error('DB Error on stream end:', dbError);
            res.end();
         }
      } finally {
        client.release();
      }
    });

    response.data.on('error', (err) => {
        if (!res.headersSent) {
            return jsonResponse(res, 500, { success: false, message: 'Terjadi kesalahan pada stream eksternal.', data: { details: err.message } });
        } else {
            console.error('Stream Error:', err);
            res.end();
        }
        client.release();
    });

  } catch (error) {
    client.release();
    const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
    if (!res.headersSent) {
      return jsonResponse(res, 500, { success: false, message: 'Terjadi kesalahan internal.', data: { details: errorMessage } });
    }
  }
};

export default withCorsAndJson(handler);