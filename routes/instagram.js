/*
* Lokasi: routes/instagram.js
* Versi: v1
*/

module.exports = {
  name: 'Instagram Downloader',
  method: 'POST',
  path: '/api/instagram',
  description: 'Mengunduh postingan Instagram (gambar, video, atau reels) dari URL.',
  params: ['url'],
  exampleCurl: 'curl -X POST -H "Content-Type: application/json" -d \'{"url":"https://www.instagram.com/p/..."}\' https://nirkyy-downloader.vercel.com/api/instagram',
  response: {
    status: 'success',
    author: 'NirKyy',
    data: {
      type: 'video',
      media_urls: [
        'https://download-link.com/ig_media.mp4'
      ],
      caption: 'Ini adalah contoh caption dari Instagram.'
    }
  }
};