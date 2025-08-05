/*
* Lokasi: pages/status.js
* Versi: v1
*/

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';

const PageLoader = () => (
  <div className="page-loader-container">
    <div className="loader"></div>
  </div>
);

const DynamicStatusPage = dynamic(() => import('../components/StatusPage'), { loading: PageLoader });

export default function Status() {
  const router = useRouter();
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

  const seoProps = {
    pageTitle: 'API Status - NirKyy API Docs',
    pageDescription: 'Check the real-time uptime status and historical performance of NirKyy API domains.',
    canonicalUrl: `${baseUrl}${router.asPath}`,
    ogImageUrl: `${baseUrl}/api.svg`,
  };

  return (
    <Layout {...seoProps} activeTab="status">
      <DynamicStatusPage data={statusData} isLoading={isStatusLoading} error={statusError} />
    </Layout>
  );
}