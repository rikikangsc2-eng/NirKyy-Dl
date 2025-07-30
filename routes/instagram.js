/*
* Lokasi: routes/instagram.js
* Versi: v2
*/

module.exports = {
  name: 'Instagram Downloader',
  method: 'POST',
  path: '/api/instagram',
  description: 'Mengunduh postingan Instagram (gambar, video, atau reels) dari URL.',
  params: [
    { name: 'url', optional: false, example: 'https://www.instagram.com/p/Cq5c-c5p9a6/' }
  ],
  response: {
    status: 'success',
    author: 'NirKyy',
    data: {
      type: 'video',
      media_urls: [ 'https://download-link.com/ig_media.mp4' ],
      caption: 'Ini adalah contoh caption dari Instagram.'
    }
  }
};