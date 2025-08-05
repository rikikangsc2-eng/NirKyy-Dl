/*
* Lokasi: pages/status.js
* Versi: v2
*/


import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const PageLoader = () => (
  <div className="page-loader-container">
    <div className="loader"></div>
  </div>
);

const DynamicStatusPage = dynamic(() => import('../components/StatusPage'), { loading: PageLoader });

export default function Status() {
  const [baseUrl, setBaseUrl] = useState('');
  const [statusData, setStatusData] = useState(null);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const fetchStatusData = async () => {
      setIsStatusLoading(true);
      setStatusError(null);
      try {
        const response = await fetch('/api/uptime-status');
        if (!response.ok) throw new Error('Failed to fetch status data');
        const result = await response.json();
        setStatusData(result.data);
      } catch (err) {
        setStatusError(err.message);
      } finally {
        setIsStatusLoading(false);
      }
    };
    fetchStatusData();
  }, []);

  const seo = {
    pageTitle: 'API Status - NirKyy API Docs',
    pageDescription: 'Check the real-time uptime status and historical performance of NirKyy API domains.',
    canonicalUrl: `${baseUrl}/status`,
    ogImageUrl: `${baseUrl}/api.svg`,
  };

  return (
    <>
      <Head>
        <title>{seo.pageTitle}</title>
        <meta name="description" content={seo.pageDescription} />
        <meta name="keywords" content="API Status, Uptime, NirKyy API, Server Status" />
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
      <DynamicStatusPage data={statusData} isLoading={isStatusLoading} error={statusError} />
    </>
  );
}