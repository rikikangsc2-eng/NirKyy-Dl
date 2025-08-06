/*
* Lokasi: pages/index.js
* Versi: v33
*/

import Head from 'next/head';
import { useState, useEffect } from 'react';
import HomePage from '../components/HomePage';

export default function IndexPage() {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const seo = {
    pageTitle: 'NirKyy API - Interactive Documentation',
    pageDescription: 'Explore and test NirKyy API endpoints for downloader, converter, and search services directly from your browser.',
    canonicalUrl: `${baseUrl}/`,
    ogImageUrl: `${baseUrl}/api.svg`,
  };

  return (
    <>
      <Head>
        <title>{seo.pageTitle}</title>
        <meta name="description" content={seo.pageDescription} />
        <meta name="keywords" content="NirKyy API, REST API, Downloader, Converter, Search, API Documentation, Next.js, Interactive API" />
        <meta name="author" content="NirKyy" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={seo.canonicalUrl} />
        <link rel="icon" href="/api.svg" />
        <link rel="apple-touch-icon" href="/api.svg" />
        <meta property="og:title" content={seo.pageTitle} />
        <meta property="og:description" content={seo.pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seo.canonicalUrl} />
        <meta property="og:image" content={seo.ogImageUrl} />
        <meta property="og:site_name" content="NirKyy API Docs" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.pageTitle} />
        <meta name="twitter:description" content={seo.pageDescription} />
        <meta name="twitter:image" content={seo.ogImageUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <HomePage />
    </>
  );
}