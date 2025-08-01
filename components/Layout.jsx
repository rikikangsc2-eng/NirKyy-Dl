/*
* Lokasi: components/Layout.jsx
* Versi: v4
*/

import Head from 'next/head';
import BottomNavbar from './BottomNavbar';

export default function Layout({ children, activeTab, setActiveTab }) {
  return (
    <>
      <Head>
        <title>NirKyy API Docs</title>
        <meta name="description" content="API Documentation for NirKyy Services" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/api.svg" />
      </Head>

      <div className="app-shell">
        <main className="page-content">
          {children}
        </main>
        <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </>
  );
}