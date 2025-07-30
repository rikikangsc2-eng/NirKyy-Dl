/*
* Lokasi: routes/youtube.js
* Versi: v1
*/

module.exports = {
  name: 'Youtube Downloader',
  method: 'GET',
  path: '/api/youtube',
  description: 'Mengunduh video atau audio dari YouTube dalam berbagai format.',
  params: ['url'],
  exampleCurl: 'curl "https://nirkyy-downloader.vercel.com/api/youtube?url=https://www.youtube.com/watch?v=..."',
  response: {
    status: 'success',
    author: 'NirKyy',
    data: {
      title: 'Contoh Judul Video YouTube',
      thumbnail: 'https://i.ytimg.com/vi/.../hqdefault.jpg',
      formats: [
        {
          quality: '1080p',
          url: 'https://download-link.com/video_1080.mp4'
        },
        {
          quality: '720p',
          url: 'https://download-link.com/video_720.mp4'
        },
        {
          quality: 'mp3',
          url: 'https://download-link.com/audio.mp3'
        }
      ]
    }
  }
};