/*
* Lokasi: pages/api/downloader/tiktok.js
* Versi: v2
*/

export const metadata = {
  method: 'GET',
  description: 'Mengunduh informasi video TikTok berdasarkan URL.',
  parameters: [
    { name: 'url', type: 'string', desc: 'URL lengkap video TikTok.' }
  ],
  response: {
    status: "success",
    code: 200,
    author: "Your API Name",
    data: {
      title: "Contoh Video TikTok Keren",
      author: "@usernamekreator",
      duration: "00:15",
      video_url_no_watermark: "https://example.com/video.mp4"
    }
  }
};

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Parameter "url" is required.'
    });
  }

  res.status(200).json(metadata.response);
}