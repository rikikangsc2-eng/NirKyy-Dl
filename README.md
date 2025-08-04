

# NirKyy API - Dokumentasi Interaktif

Repositori ini berisi kode sumber untuk antarmuka dokumentasi interaktif NirKyy API. Aplikasi ini dibangun dengan Next.js dan dirancang dengan pendekatan *mobile-first* untuk menyediakan pengalaman yang mulus dalam menjelajahi dan menguji endpoint API.

### Live Demo

API dan dokumentasi ini dapat diakses melalui:
- **[nirkyy-kun.vercel.app](https://nirkyy-kun.vercel.app)**
- **[nirkyy-api.duckdns.org](https://nirkyy-api.duckdns.org)**

---

## Fitur Utama

- **Desain Mobile-First**: Antarmuka yang dioptimalkan untuk perangkat seluler dengan navigasi bawah yang mudah dijangkau.
- **Dokumentasi Dinamis**: Daftar endpoint dan dokumentasinya dihasilkan secara otomatis dengan membaca metadata dari file API di direktori `pages/api`.
- **Eksekusi Interaktif**: Uji endpoint API langsung dari browser dengan mengisi parameter yang diperlukan dan melihat respons secara real-time.
- **Panel Respons**: Panel respons yang dapat digeser ke atas menampilkan hasil JSON, pesan error, dan contoh perintah cURL yang sudah jadi.
- **Pencarian & Kategori**: Temukan endpoint dengan mudah melalui fitur pencarian atau jelajahi berdasarkan kategori yang telah ditentukan.
- **Halaman Blog**: Berisi informasi umum, pembaruan, dan detail kontak.
- **SEO-Friendly**: Judul dan deskripsi halaman dinamis untuk optimasi mesin pencari.

## Teknologi yang Digunakan

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: CSS Global dengan Variabel CSS (tanpa library UI)
- **Syntax Highlighting**: `react-syntax-highlighter`
- **Form Handling**: `formidable` (backend)

## Arsitektur

Kekuatan utama dari proyek ini adalah sistem parsing dokumentasi otomatisnya.

1.  Setiap file endpoint yang valid di dalam `pages/api` (kecuali yang diawali dengan `_` atau berisi `[]`) harus mengekspor sebuah objek konstan bernama `metadata`.
2.  Objek `metadata` ini berisi semua informasi tentang endpoint tersebut: nama, deskripsi, kategori, metode HTTP, dan parameter yang dibutuhkan.
3.  Sebuah endpoint khusus `/api/docs` menggunakan `utils/api-parser.js` untuk membaca semua file endpoint, mengekstrak `metadata`-nya, dan menyajikannya sebagai satu file JSON.
4.  Antarmuka frontend kemudian mengambil data dari `/api/docs` untuk membangun halaman Kategori, Pencarian, dan detail endpoint secara dinamis.

Dengan pendekatan ini, menambahkan endpoint baru ke dokumentasi semudah membuat file API baru dengan `metadata` yang benar.

## Panduan Lokal

### Prasyarat

- Node.js (v16 atau lebih tinggi)
- npm atau yarn

### Instalasi

1.  **Clone repositori:**
    ```bash
    git clone <URL_REPOSITORI_ANDA>
    cd <nama-folder>
    ```

2.  **Install dependensi:**
    ```bash
    npm install
    # atau
    yarn install
    ```

3.  **Jalankan server development:**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Menambahkan Endpoint Baru

Untuk menambahkan endpoint baru dan menampilkannya secara otomatis di dokumentasi, ikuti langkah-langkah berikut:

1.  Buat file JavaScript baru di dalam direktori `pages/api/` (misalnya: `pages/api/search/new-feature.js`).

2.  Di dalam file tersebut, ekspor objek `metadata` dengan struktur berikut:

    ```javascript
    export const metadata = {
      name: 'Nama Fitur Baru', // Nama yang akan ditampilkan di UI
      category: 'Search', // Kategori: Downloader, Converter, Search, Game & Fun, Other
      method: 'GET', // Metode HTTP (GET, POST, PUT, DELETE)
      path: '/search/new-feature', // Path API, harus sesuai dengan lokasi file
      description: 'Deskripsi singkat tentang apa yang dilakukan oleh endpoint ini.',
      params: [
        { name: 'query', type: 'text', optional: false, example: 'contoh query' },
        { name: 'apiKey', type: 'text', optional: true, example: '12345' },
        { name: 'image', type: 'file', optional: true }
      ]
    };
    ```

3.  Implementasikan logika handler API Anda di file yang sama.

Sistem akan secara otomatis mendeteksi file baru ini dan menambahkannya ke daftar endpoint di antarmuka pengguna saat server development di-refresh.

## Keywords
API, REST API, NirKyy, Downloader, Converter, Search, Game, Fun, Interactive Documentation, Next.js, Vercel, API Documentation, API Platform, Developer Tools.

---

### Author

- **NirKyy** - [GitHub](https://github.com/rikikangsc2-eng)