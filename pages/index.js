/*
* Lokasi: pages/index.js
* Versi: v20
*/

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import LogoLoader from '../components/LogoLoader';
import HomePage from '../components/HomePage';
import CategoryPage from '../components/CategoryPage';
import SearchPage from '../components/SearchPage';
import BlogPage from '../components/BlogPage';

export default function AppShell() {
  const router = useRouter();
  const [docs, setDocs] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [paramValues, setParamValues] = useState({});
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isChangingEndpoint, setIsChangingEndpoint] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch('/api/docs');
        const data = await res.json();
        setDocs(data);
        setIsFadingOut(true);
        setTimeout(() => setIsInitialLoad(false), 500);
      } catch (err) {
        console.error("Failed to fetch docs:", err);
        setError("Could not load API documentation.");
        setIsInitialLoad(false);
      }
    };
    fetchDocs();
  }, []);

  useEffect(() => {
    if (router.isReady) {
      const pageQuery = router.query.page || 'home';
      if (['home', 'category', 'search', 'blog'].includes(pageQuery)) {
        setActiveTab(pageQuery);
      } else {
        setActiveTab('home');
      }
    }
  }, [router.isReady, router.query.page]);

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    router.push({ pathname: '/', query: { page: tab } }, undefined, { shallow: true });
  };

  const handleSelectEndpoint = (endpoint) => {
    if (!endpoint || endpoint.id === selectedEndpoint?.id) {
      handleSetActiveTab('home');
      return;
    };

    setIsChangingEndpoint(true);
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

    setTimeout(() => {
      setIsChangingEndpoint(false);
    }, 500);
  };

  const handleParamChange = (param, value) => {
    setParamValues(prev => ({ ...prev, [param]: value }));
  };

  const handleExecute = async () => {
    if (!selectedEndpoint) return;
    setIsLoading(true);
    setError(null);
    setApiResponse(null);

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

  const renderActivePage = () => {
    switch (activeTab) {
      case 'category':
        return <CategoryPage docs={docs} onSelectEndpoint={handleSelectEndpoint} />;
      case 'search':
        return <SearchPage docs={docs} onSelectEndpoint={handleSelectEndpoint} />;
      case 'blog':
        return <BlogPage />;
      case 'home':
      default:
        return <HomePage
          endpoint={selectedEndpoint}
          paramValues={paramValues}
          onParamChange={handleParamChange}
          onExecute={handleExecute}
          isLoading={isLoading}
          apiResponse={apiResponse}
          error={error}
          isChangingEndpoint={isChangingEndpoint}
        />;
    }
  };

  if (isInitialLoad) {
    return (
      <div className="initial-loader-container">
        <LogoLoader size="large" fadingOut={isFadingOut} />
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={handleSetActiveTab}>
      {renderActivePage()}
    </Layout>
  );
}