/*
* Lokasi: components/BlogPage.jsx
* Versi: v3
*/

export default function BlogPage() {
  return (
    <div className="blog-page-container">
      <header className="blog-header">
        <h1>NirKyy API</h1>
        <p>Selamat datang di pusat informasi NirKyy API.</p>
      </header>
      <main className="blog-content">
        <section className="blog-section">
          <h2>Tentang API</h2>
          <p>
            API ini menyediakan berbagai layanan downloader, converter, dan pencarian yang dapat diintegrasikan ke dalam proyek Anda.
          </p>
        </section>
        <section className="blog-section">
          <h2>Layanan Gratis 24 Jam</h2>
          <p>
            Seluruh endpoint yang tersedia dapat digunakan secara gratis, 24 jam sehari, untuk keperluan development dan personal.
          </p>
        </section>
        <section className="blog-section">
          <h2>Informasi Domain</h2>
          <p>
            API ini dapat diakses melalui beberapa domain. Silakan gunakan salah satu dari alamat berikut:
          </p>
          <ul>
            <li>nirkyy-kun.vercel.app</li>
            <li>nirkyy-api.duckdns.org</li>
          </ul>
        </section>
        <section className="blog-section">
          <h2>Kontak & Kolaborasi</h2>
          <p>
            Jika Anda menemukan bug, memiliki saran, atau tertarik untuk berkolaborasi, jangan ragu untuk menghubungi saya melalui GitHub.
          </p>
          <a href="https://github.com/rikikangsc2-eng" target="_blank" rel="noopener noreferrer" className="github-link">
            Kunjungi GitHub
          </a>
        </section>
      </main>
      <footer className="blog-footer">
        <p>© {new Date().getFullYear()} NirKyy. All rights reserved.</p>
      </footer>
    </div>
  );
}