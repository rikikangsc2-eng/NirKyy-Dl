/*
* Lokasi: routes/tiktok.js
* Versi: v1
*/

module.exports = {
  name: 'Tiktok Downloader',
  method: 'GET',
  path: '/api/tiktok',
  description: 'Mengunduh video TikTok tanpa watermark berdasarkan URL yang diberikan.',
  params: ['url'],
  exampleCurl: 'curl "https://nirkyy-downloader.vercel.com/api/tiktok?url=https://www.tiktok.com/.../video/..."',
  response: {
    status: 'success',
    author: 'NirKyy',
    data: {
      title: 'Contoh Judul Video TikTok',
      duration: '00:15',
      video_hd: 'https://download-link.com/video_hd.mp4',
      video_sd: 'https://download-link.com/video_sd.mp4',
      audio: 'https://download-link.com/audio.mp3'
    }
  }
};