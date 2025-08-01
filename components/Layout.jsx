/*
* Lokasi: components/Layout.jsx
* Versi: v3
*/

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';

export default function Layout({ children, docs, onSelectEndpoint, selectedId, breadcrumbPath }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 1024);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      <Head>
        <title>NirKyy API Docs</title>
        <meta name="description" content="API Documentation for NirKyy Downloader Services" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/api.svg" />
      </Head>

      <button onClick={toggleSidebar} className="sidebar-toggle-button">
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>

      <div className="container">
        <Sidebar
          docs={docs}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          onSelect={onSelectEndpoint}
          selectedId={selectedId}
        />
        <div className="content-area">
          <Breadcrumb pathSegments={breadcrumbPath} />
          {children}
        </div>
      </div>
    </>
  );
}