/*
* Lokasi: pages/api/ai/chatbot.js
* Versi: v4
*/

import axios from 'axios';
import crypto from 'crypto';
import { Pool } from 'pg';
import { jsonResponse, withCorsAndJson } from '../../../utils/api-helpers';

export const metadata = {
  name: 'AI Chatbot (Blackbox)',
  category: 'AI',
  method: 'GET, POST',
  path: '/ai/chatbot',
  description: 'Berinteraksi dengan model AI Blackbox. Mendukung pencarian web dan menyimpan riwayat percakapan.',
  params: [
    { name: 'user', type: 'text', optional: false, example: 'user_12345' },
    { name: 'prompt', type: 'text', optional: false, example: 'Siapa penemu bohlam lampu?' },
    { name: 'system', type: 'text', optional: true, example: 'You are a helpful assistant.' },
    { name: 'web', type: 'text', optional: true, example: 'true' },
    { name: 'cleardb', type: 'text', optional: true, example: 'false' },
  ]
};

const DB_HISTORY_LIMIT = 15;
const PAYLOAD_MESSAGE_LIMIT = 15;
const VALIDATED_TOKEN = "a38f5889-8fef-46d4-8ede-bf4668b6a9bb";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const CREATE_TABLE_QUERY = `
CREATE TABLE IF NOT EXISTS blackbox_chat_history (
    user_id TEXT PRIMARY KEY,
    messages JSONB,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;

const generateId = (size = 7) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytes = crypto.randomBytes(size);
  return Array.from({ length: size }, (_, i) => alphabet[randomBytes[i] % alphabet.length]).join('');
};

const parseApiResponse = (data) => {
  const delimiter = '$~~~$';
  if (typeof data === 'string' && data.includes(delimiter)) {
    const parts = data.split(delimiter);
    try {
      const sources = JSON.parse(parts[1]);
      const answer = parts[2] ? parts[2].trim() : '';
      return { answer, sources };
    } catch {
      return { answer: data, sources: [] };
    }
  }
  return { answer: data, sources: [] };
};

const getHistory = async (client, userId) => {
  const result = await client.query('SELECT messages FROM blackbox_chat_history WHERE user_id = $1', [userId]);
  return result.rows.length > 0 ? result.rows[0].messages : [];
};

const updateHistory = async (client, userId, messages) => {
  const finalHistory = messages.slice(-DB_HISTORY_LIMIT);
  const query = `
    INSERT INTO blackbox_chat_history (user_id, messages, last_updated) VALUES ($1, $2, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) DO UPDATE SET
      messages = $2,
      last_updated = CURRENT_TIMESTAMP;
  `;
  await client.query(query, [userId, JSON.stringify(finalHistory)]);
};

const handler = async (req, res) => {
  const params = { ...req.query, ...req.body };
  const { user, system, prompt, cleardb, web } = params;

  const client = await pool.connect();
  try {
    await client.query(CREATE_TABLE_QUERY);

    if (cleardb === 'true') {
      await client.query('DROP TABLE IF EXISTS blackbox_chat_history');
      await client.query(CREATE_TABLE_QUERY);
      return jsonResponse(res, 200, { success: true, message: 'Database berhasil dibersihkan.' });
    }

    if (!prompt || !user) {
      return jsonResponse(res, 400, { success: false, message: "Parameter 'prompt' dan 'user' wajib diisi." });
    }

    const history = await getHistory(client, user);
    const newUserMessage = { role: 'user', content: prompt, id: generateId() };
    const conversationHistory = [...history, newUserMessage];
    const messagesForPayload = conversationHistory.slice(-PAYLOAD_MESSAGE_LIMIT);

    let webSearchModeOption = { autoMode: true, webMode: false, offlineMode: false };
    if (web) {
      const webMode = String(web).toLowerCase();
      if (webMode === 'true') webSearchModeOption = { autoMode: false, webMode: true, offlineMode: false };
      else if (webMode === 'false') webSearchModeOption = { autoMode: false, webMode: false, offlineMode: true };
    }

    const payload = {
      messages: messagesForPayload,
      id: newUserMessage.id,
      userSystemPrompt: system || 'You are a helpful assistant.',
      validated: VALIDATED_TOKEN,
      previewToken: null, userId: null, codeModelMode: true, trendingAgentMode: {}, isMicMode: false, maxTokens: 1024,
      playgroundTopP: null, playgroundTemperature: null, isChromeExt: false, githubToken: "", clickedAnswer2: false,
      clickedAnswer3: false, clickedForceWebSearch: false, visitFromDelta: false, isMemoryEnabled: false, mobileClient: false,
      userSelectedModel: null, userSelectedAgent: "VscodeAgent", imageGenerationMode: false, imageGenMode: "autoMode",
      webSearchModePrompt: false, deepSearchMode: false, domains: null, vscodeClient: false, codeInterpreterMode: false,
      customProfile: { name: "", occupation: "", traits: [], additionalInfo: "", enableNewChats: false },
      webSearchModeOption, session: null, isPremium: false, subscriptionCache: null, beastMode: false,
      reasoningMode: false, designerMode: false, workspaceId: "", asyncMode: false, integrations: {},
      isTaskPersistent: false, selectedElement: null
    };

    const chatApiUrl = 'https://www.blackbox.ai/api/chat';
    const headers = {
      'Accept': '*/*', 'Content-Type': 'application/json', 'Origin': 'https://www.blackbox.ai',
      'Referer': 'https://www.blackbox.ai/',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; RMX2185) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
    };

    const chatResponse = await axios.post(chatApiUrl, payload, { headers });
    const assistantRawResponse = chatResponse.data;
    const parsedResult = parseApiResponse(assistantRawResponse);

    const newAssistantMessage = {
      role: 'assistant', content: assistantRawResponse, id: generateId(), createdAt: new Date().toISOString(),
    };
    await updateHistory(client, user, [...conversationHistory, newAssistantMessage]);

    return jsonResponse(res, 200, { success: true, message: 'Respon berhasil diterima.', data: parsedResult });

  } catch (error) {
    const errorDetails = error.response
      ? { status: error.response.status, data: error.response.data }
      : { message: error.message };
    return jsonResponse(res, 500, { success: false, message: "Terjadi kesalahan selama operasi.", data: errorDetails });
  } finally {
    client.release();
  }
};

export default withCorsAndJson(handler);