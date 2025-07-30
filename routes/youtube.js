/*
* Lokasi: routes/youtube.js
* Versi: v2
*/

module.exports = {
  name: 'Youtube Downloader',
  method: 'GET',
  path: '/api/youtube',
  description: 'Mengunduh video atau audio dari YouTube dalam berbagai format.',
  params: [
    { name: 'url', optional: false, example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { name: 'quality', optional: true, example: '720p' }
  ],
  response: {
    status: 'success',
    author: 'NirKyy',
    data: {
      title: 'Contoh Judul Video YouTube',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      formats: [
        { quality: '1080p', url: 'https://download-link.com/video_1080.mp4' },
        { quality: '720p', url: 'https://download-link.com/video_720.mp4' },
        { quality: 'mp3', url: 'https://download-link.com/audio.mp3' }
      ]
    }
  }
};