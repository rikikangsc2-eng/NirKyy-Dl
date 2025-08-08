/*
* Lokasi: pages/category.js
* Versi: v5
*/

import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useAppContext } from '../context/AppContext';

const PageLoader = () => (
  <div className="page-loader-container">
    <div className="loader"></div>
  </div>
);

const DynamicCategoryPage = dynamic(() => import('../components/CategoryPage'), { loading: PageLoader });

export default function Category() {
  const [baseUrl, setBaseUrl] = useState('');
  const { docs, isDocsLoading } = useAppContext();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const seo = {
    pageTitle: 'API Categories - NirKyy API Docs',
    pageDescription: 'Browse all available API endpoints grouped by category: Downloader, Converter, Search, Game & Fun, and more.',
    canonicalUrl: `${baseUrl}/category`,
    ogImageUrl: `${baseUrl}/api.svg`,
  };

  return (
    <>
      <Head>
        <title>{seo.pageTitle}</title>
        <meta name="description" content={seo.pageDescription} />
        <meta name="keywords" content="API Categories, NirKyy API, Downloader, Converter, Search" />
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {isDocsLoading ? <PageLoader /> : <DynamicCategoryPage docs={docs} />}
    </>
  );
}