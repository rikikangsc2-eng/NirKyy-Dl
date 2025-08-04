/*
* Lokasi: components/BlogPage.jsx
* Versi: v4
*/

export default function BlogPage() {
  const sections = [
    {
      title: 'Tentang API',
      content: 'API ini menyediakan berbagai layanan downloader, converter, dan pencarian yang dapat diintegrasikan ke dalam proyek Anda.'
    },
    {
      title: 'Layanan Gratis 24 Jam',
      content: 'Seluruh endpoint yang tersedia dapat digunakan secara gratis, 24 jam sehari, untuk keperluan development dan personal.'
    },
    {
      title: 'Informasi Domain',
      content: 'API ini dapat diakses melalui beberapa domain. Silakan gunakan salah satu dari alamat berikut:',
      list: ['nirkyy-kun.vercel.app', 'nirkyy-api.duckdns.org']
    },
    {
      title: 'Kontak & Kolaborasi',
      content: 'Jika Anda menemukan bug, memiliki saran, atau tertarik untuk berkolaborasi, jangan ragu untuk menghubungi saya melalui GitHub.',
      link: { href: 'https://github.com/rikikangsc2-eng', text: 'Kunjungi GitHub' }
    }
  ];

  return (
    <div className="blog-page-container">
      <header className="blog-header">
        <h1>NirKyy API</h1>
        <p>Selamat datang di pusat informasi NirKyy API.</p>
      </header>
      <main className="blog-content">
        {sections.map((section, index) => (
          <section key={index} className="blog-section" style={{ animationDelay: `${150 * index}ms` }}>
            <h2>{section.title}</h2>
            <p>{section.content}</p>
            {section.list && (
              <ul>
                {section.list.map(item => <li key={item}>{item}</li>)}
              </ul>
            )}
            {section.link && (
              <a href={section.link.href} target="_blank" rel="noopener noreferrer" className="github-link">
                {section.link.text}
              </a>
            )}
          </section>
        ))}
      </main>
      <footer className="blog-footer">
        <p>© {new Date().getFullYear()} NirKyy. All rights reserved.</p>
      </footer>
    </div>
  );
}