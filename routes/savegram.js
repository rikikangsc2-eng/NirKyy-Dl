/*
* Lokasi: routes/savegram.js
* Versi: v1
*/

module.exports = {
  name: 'SaveGram Downloader',
  category: 'Downloader',
  method: 'GET',
  path: '/api/savegram',
  description: 'Mengunduh konten Instagram (video, foto) melalui scrapper SaveGram.',
  params: [
    { name: 'url', type: 'text', optional: false, example: 'https://www.instagram.com/p/Cq5c-c5p9a6/' }
  ],
  response: {
    status: 'sukses',
    data: [
      {
        thumbnail: 'https://cdn.savegram.org/images/....jpg',
        kualitas: 'HD (720p)',
        url_download: 'https://video.savegram.org/....mp4'
      }
    ]
  }
};