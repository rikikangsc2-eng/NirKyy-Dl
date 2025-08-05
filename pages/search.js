/*
* Lokasi: pages/search.js
* Versi: v2
*/


import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getAllRoutes } from '../utils/api-parser';

const PageLoader = () => (
  <div className="page-loader-container">
    <div className="loader"></div>
  </div>
);

const DynamicSearchPage = dynamic(() => import('../components/SearchPage'), { loading: PageLoader });

export default function Search({ docs }) {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const seo = {
    pageTitle: 'Search API - NirKyy API Docs',
    pageDescription: 'Quickly find any API endpoint by name, category, or description using the powerful search feature.',
    canonicalUrl: `${baseUrl}/search`,
    ogImageUrl: `${baseUrl}/api.svg`,
  };

  return (
    <>
      <Head>
        <title>{seo.pageTitle}</title>
        <meta name="description" content={seo.pageDescription} />
        <meta name="keywords" content="Search API, Find API, NirKyy API, API Documentation" />
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <DynamicSearchPage docs={docs} />
    </>
  );
}

export async function getStaticProps() {
  const docs = getAllRoutes();
  return {
    props: {
      docs,
    },
  };
}