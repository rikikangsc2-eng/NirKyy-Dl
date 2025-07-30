/*
* Lokasi: routes/tiktok.js
* Versi: v2
*/

module.exports = {
  name: 'Tiktok Downloader',
  method: 'GET',
  path: '/api/tiktok',
  description: 'Mengunduh video TikTok tanpa watermark berdasarkan URL yang diberikan.',
  params: [
    { name: 'url', optional: false, example: 'https://www.tiktok.com/@tiktok/video/7084539154359897390' }
  ],
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