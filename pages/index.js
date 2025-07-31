/*
* Lokasi: pages/index.js
* Versi: v16
*/

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import MainContent from '../components/MainContent';
import ResponsePanel from '../components/ResponsePanel';
import LogoLoader from '../components/LogoLoader';

export default function Home() {
  const [docs, setDocs] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [paramValues, setParamValues] = useState({});
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isChangingEndpoint, setIsChangingEndpoint] = useState(false);

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
    if (docs && !selectedEndpoint) {
      const firstCategory = Object.keys(docs)[0];
      if (docs[firstCategory] && docs[firstCategory].length > 0) {
        handleSelectEndpoint(docs[firstCategory][0], true);
      }
    }
  }, [docs, selectedEndpoint]);

  const handleSelectEndpoint = (endpoint, isInitial = false) => {
    if (!endpoint) return;

    const updateState = () => {
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
    };

    if (isInitial) {
      updateState();
    } else {
      setIsChangingEndpoint(true);
      updateState();
      setTimeout(() => {
        setIsChangingEndpoint(false);
      }, 1500);
    }
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

  if (isInitialLoad) {
    return (
      <div className="initial-loader-container">
        <LogoLoader size="large" fadingOut={isFadingOut} />
      </div>
    );
  }

  return (
    <Layout docs={docs} onSelectEndpoint={handleSelectEndpoint} selectedId={selectedEndpoint?.id}>
      <MainContent
        endpoint={selectedEndpoint}
        paramValues={paramValues}
        onParamChange={handleParamChange}
        onExecute={handleExecute}
        isLoading={isLoading}
        isChangingEndpoint={isChangingEndpoint}
      />
      <ResponsePanel
        endpoint={selectedEndpoint}
        paramValues={paramValues}
        apiResponse={apiResponse}
        isLoading={isLoading}
        error={error}
        isChangingEndpoint={isChangingEndpoint}
      />
    </Layout>
  );
}