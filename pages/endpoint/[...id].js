/*
* Lokasi: pages/endpoint/[...id].js
* Versi: v2
*/

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import { getAllRoutes, getRouteById } from '../../utils/api-parser';

const PageLoader = () => (
  <div className="page-loader-container">
    <div className="loader"></div>
  </div>
);

const DynamicHomePage = dynamic(() => import('../../components/HomePage'), { loading: PageLoader });

export default function EndpointPage({ endpoint }) {
  const router = useRouter();
  const [paramValues, setParamValues] = useState({});
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isResponsePanelOpen, setIsResponsePanelOpen] = useState(false);
  const [isPanelClosing, setIsPanelClosing] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (endpoint?.params) {
      const initialParams = {};
      endpoint.params.forEach(p => {
        if (p.type !== 'file') {
          initialParams[p.name] = p.example || '';
        }
      });
      setParamValues(initialParams);
    }
  }, [endpoint]);

  if (router.isFallback) {
    return <PageLoader />;
  }

  const handleParamChange = (param, value) => {
    setParamValues(prev => ({ ...prev, [param]: value }));
  };

  const handleExecute = async () => {
    if (!endpoint) return;
    setIsLoading(true);
    setError(null);
    setApiResponse(null);
    setIsResponsePanelOpen(true);

    try {
      let url = `/api${endpoint.path}`;
      const rawMethod = endpoint.method || 'GET';
      const actualMethod = rawMethod.split(',')[0].trim().toUpperCase();
      const options = { method: actualMethod };
      const hasFile = endpoint.params.some(p => p.type === 'file' && paramValues[p.name]);

      if (hasFile) {
        const formData = new FormData();
        Object.entries(paramValues).forEach(([key, value]) => {
          formData.append(key, value);
        });
        options.body = formData;
      } else if (options.method !== 'GET') {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(paramValues);
      } else {
        const cleanParams = Object.fromEntries(Object.entries(paramValues).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
        const queryParams = new URLSearchParams(cleanParams);
        if (queryParams.toString()) url += `?${queryParams}`;
      }

      const res = await fetch(url, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Something went wrong');
      setApiResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeResponsePanel = () => {
    setIsPanelClosing(true);
    setTimeout(() => {
      setIsResponsePanelOpen(false);
      setIsPanelClosing(false);
    }, 300);
  };

  const openResponsePanel = () => {
    setIsResponsePanelOpen(true);
  };

  const seoProps = {
    pageTitle: `${endpoint.name} - NirKyy API Docs`,
    pageDescription: endpoint.description || `Test the ${endpoint.name} endpoint on the NirKyy API platform.`,
    canonicalUrl: `${baseUrl}${router.asPath}`,
    ogImageUrl: `${baseUrl}/api.svg`,
  };

  return (
    <Layout
      {...seoProps}
      activeTab="home"
      isResponsePanelOpen={isResponsePanelOpen}
      isPanelClosing={isPanelClosing}
      closeResponsePanel={closeResponsePanel}
      endpoint={endpoint}
      paramValues={paramValues}
      apiResponse={apiResponse}
      isLoading={isLoading}
      error={error}
    >
      <DynamicHomePage
        endpoint={endpoint}
        paramValues={paramValues}
        onParamChange={handleParamChange}
        onExecute={handleExecute}
        isLoading={isLoading}
        apiResponse={apiResponse}
        error={error}
        onShowResponse={openResponsePanel}
      />
    </Layout>
  );
}

export async function getStaticPaths() {
  const docs = getAllRoutes();
  const paths = [];
  Object.values(docs).forEach(category => {
    category.forEach(doc => {
      paths.push({ params: { id: doc.id.split('/') } });
    });
  });
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const id = params.id.join('/');
  const endpoint = getRouteById(id);

  if (!endpoint) {
    return { notFound: true };
  }

  return {
    props: {
      endpoint,
    },
    revalidate: 60,
  };
}