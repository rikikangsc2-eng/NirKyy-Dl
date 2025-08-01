/*
* Lokasi: pages/blog.js
* Versi: v1
*/

import Head from 'next/head';
import Link from 'next/link';
import Breadcrumb from '../components/Breadcrumb';

export default function BlogPage() {
  const breadcrumbPath = [{ name: 'Home', href: '/' }, { name: 'Blog' }];

  return (
    <>
      <Head>
        <title>NirKyy API - Blog</title>
        <meta name="description" content="Informasi mengenai NirKyy API" />
        <link rel="icon" href="/api.svg" />
      </Head>
      <div className="blog-page-container">
        <Breadcrumb pathSegments={breadcrumbPath} />
        <header className="blog-header">
          <h1>NirKyy API</h1>
          <p>Selamat datang di pusat informasi NirKyy API.</p>
          <Link href="/" legacyBehavior>
            <a className="docs-link-button">Kembali ke Aplikasi</a>
          </Link>
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
    </>
  );
}