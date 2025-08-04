/*
* Lokasi: components/Layout.jsx
* Versi: v9
*/

import Head from 'next/head';
import dynamic from 'next/dynamic';
import BottomNavbar from './BottomNavbar';

const DynamicResponsePanel = dynamic(() => import('./ResponsePanel'));

export default function Layout(props) {
  const { 
    children, 
    activeTab, 
    setActiveTab,
    isResponsePanelOpen,
    isPanelClosing,
    closeResponsePanel,
    pageTitle,
    pageDescription,
    canonicalUrl,
    ogImageUrl,
    ...responsePanelProps 
  } = props;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="NirKyy API, REST API, Downloader, Converter, Search, API Documentation, Next.js, Interactive API" />
        <meta name="author" content="NirKyy" />
        <meta name="robots" content="index, follow" />

        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/api.svg" />
        <link rel="apple-touch-icon" href="/api.svg" />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:site_name" content="NirKyy API Docs" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImageUrl} />

        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div className="app-shell">
        <main className="page-content">
          <div key={activeTab} className="page-content-wrapper">
            {children}
          </div>
        </main>
        <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        {isResponsePanelOpen && (
          <DynamicResponsePanel 
            onClose={closeResponsePanel} 
            isClosing={isPanelClosing}
            {...responsePanelProps} 
          />
        )}
      </div>
    </>
  );
}