/*
* Lokasi: pages/index.js
* Versi: v29
*/

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { getAllRoutes } from '../utils/api-parser';

const PageLoader = () => (
  <div className="page-loader-container">
    <div className="loader"></div>
  </div>
);

const DynamicHomePage = dynamic(() => import('../components/HomePage'), { loading: PageLoader });
const DynamicCategoryPage = dynamic(() => import('../components/CategoryPage'), { loading: PageLoader });
const DynamicSearchPage = dynamic(() => import('../components/SearchPage'), { loading: PageLoader });
const DynamicStatusPage = dynamic(() => import('../components/StatusPage'), { loading: PageLoader });
const DynamicBlogPage = dynamic(() => import('../components/BlogPage'), { loading: PageLoader });

export default function AppShell({ docs }) {
  const router = useRouter();
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [paramValues, setParamValues] = useState({});
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isResponsePanelOpen, setIsResponsePanelOpen] = useState(false);
  const [isPanelClosing, setIsPanelClosing] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  const [statusData, setStatusData] = useState(null);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (router.isReady) {
      const pageQuery = router.query.page || 'home';
      if (['home', 'category', 'search', 'status', 'blog'].includes(pageQuery)) {
        setActiveTab(pageQuery);
      } else {
        setActiveTab('home');
      }
    }
  }, [router.isReady, router.query.page]);

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

    if (activeTab === 'status' && !statusData && !isStatusLoading) {
      fetchStatusData();
    }
  }, [activeTab, statusData, isStatusLoading]);

  const seoProps = useMemo(() => {
    const defaultTitle = 'NirKyy API - Interactive Documentation';
    const defaultDesc = 'Explore and test NirKyy API endpoints for downloader, converter, and search services directly from your browser. Mobile-first, dynamic, and interactive.';
    const canonicalUrl = `${baseUrl}${router.asPath}`;
    const ogImageUrl = `${baseUrl}/api.svg`;

    let pageTitle = defaultTitle;
    let pageDescription = defaultDesc;

    if (selectedEndpoint && activeTab === 'home') {
      pageTitle = `${selectedEndpoint.name} - NirKyy API Docs`;
      pageDescription = selectedEndpoint.description || `Test the ${selectedEndpoint.name} endpoint on the NirKyy API platform.`;
    } else {
      switch (activeTab) {
        case 'home':
          pageTitle = 'Welcome - NirKyy API Docs';
          pageDescription = 'Select an endpoint from the Category or Search tab to get started with the interactive NirKyy API documentation.';
          break;
        case 'category':
          pageTitle = 'API Categories - NirKyy API Docs';
          pageDescription = 'Browse all available API endpoints grouped by category: Downloader, Converter, Search, Game & Fun, and more.';
          break;
        case 'search':
          pageTitle = 'Search API - NirKyy API Docs';
          pageDescription = 'Quickly find any API endpoint by name, category, or description using the powerful search feature.';
          break;
        case 'status':
          pageTitle = 'API Status - NirKyy API Docs';
          pageDescription = 'Check the real-time uptime status and historical performance of NirKyy API domains.';
          break;
        case 'blog':
          pageTitle = 'Blog & Information - NirKyy API Docs';
          pageDescription = 'Find information about the NirKyy API, contact details, updates, and collaboration opportunities.';
          break;
      }
    }

    return { pageTitle, pageDescription, canonicalUrl, ogImageUrl };
  }, [activeTab, selectedEndpoint, baseUrl, router.asPath]);

  const handleSetActiveTab = (tab) => {
    if (activeTab === tab) return;
    setActiveTab(tab);
    router.push({ pathname: '/', query: { page: tab } }, undefined, { shallow: true });
  };

  const handleSelectEndpoint = (endpoint) => {
    if (!endpoint || endpoint.id === selectedEndpoint?.id) {
      handleSetActiveTab('home');
      return;
    };

    setSelectedEndpoint(endpoint);

    const initialParams = {};
    if (endpoint.params) {
      endpoint.params.forEach(p => {
        if (p.type !== 'file') initialParams[p.name] = p.example || '';
      });
    }
    setParamValues(initialParams);
    setApiResponse(null);
    setError(null);
    handleSetActiveTab('home');
  };

  const handleParamChange = (param, value) => {
    setParamValues(prev => ({ ...prev, [param]: value }));
  };

  const handleExecute = async () => {
    if (!selectedEndpoint) return;
    setIsLoading(true);
    setError(null);
    setApiResponse(null);
    setIsResponsePanelOpen(true);

    try {
      let url = `/api${selectedEndpoint.path}`;
      const rawMethod = selectedEndpoint.method || 'GET';
      const actualMethod = rawMethod.split(',')[0].trim().toUpperCase();
      const options = { method: actualMethod };
      const hasFile = selectedEndpoint.params.some(p => p.type === 'file' && paramValues[p.name]);

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

  const renderActivePage = () => {
    switch (activeTab) {
      case 'category':
        return <DynamicCategoryPage docs={docs} onSelectEndpoint={handleSelectEndpoint} />;
      case 'search':
        return <DynamicSearchPage docs={docs} onSelectEndpoint={handleSelectEndpoint} />;
      case 'status':
        return <DynamicStatusPage data={statusData} isLoading={isStatusLoading} error={statusError} />;
      case 'blog':
        return <DynamicBlogPage />;
      case 'home':
      default:
        return <DynamicHomePage
          endpoint={selectedEndpoint}
          paramValues={paramValues}
          onParamChange={handleParamChange}
          onExecute={handleExecute}
          isLoading={isLoading}
          apiResponse={apiResponse}
          error={error}
          onShowResponse={openResponsePanel}
        />;
    }
  };

  return (
    <Layout 
      {...seoProps}
      activeTab={activeTab} 
      setActiveTab={handleSetActiveTab}
      isResponsePanelOpen={isResponsePanelOpen}
      isPanelClosing={isPanelClosing}
      closeResponsePanel={closeResponsePanel}
      endpoint={selectedEndpoint}
      paramValues={paramValues}
      apiResponse={apiResponse}
      isLoading={isLoading}
      error={error}
    >
      {renderActivePage()}
    </Layout>
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