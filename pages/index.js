/*
* Lokasi: pages/index.js
* Versi: v14
*/

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import MainContent from '../components/MainContent';
import ResponsePanel from '../components/ResponsePanel';

export default function Home() {
  const [docs, setDocs] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [paramValues, setParamValues] = useState({});
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch('/api/docs');
        const data = await res.json();
        setDocs(data);
      } catch (err) {
        console.error("Failed to fetch docs:", err);
        setError("Could not load API documentation.");
      }
    };
    fetchDocs();
  }, []);

  useEffect(() => {
    if (docs && Object.keys(docs).length > 0) {
      const firstCategory = Object.keys(docs)[0];
      if (docs[firstCategory] && docs[firstCategory].length > 0) {
        handleSelectEndpoint(docs[firstCategory][0]);
      }
    }
  }, [docs]);

  const handleSelectEndpoint = (endpoint) => {
    if (endpoint) {
      setSelectedEndpoint(endpoint);
      const initialParams = {};
      if (endpoint.params) {
        endpoint.params.forEach(p => {
          if (p.type !== 'file') {
            initialParams[p.name] = p.example || '';
          }
        });
      }
      setParamValues(initialParams);
      setApiResponse(null);
      setError(null);
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
        Object.keys(paramValues).forEach(key => {
          formData.append(key, paramValues[key]);
        });
        options.body = formData;
      } else if (options.method !== 'GET') {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(paramValues);
      } else {
        const queryParams = new URLSearchParams(paramValues);
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

  if (!docs) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
        <div className="loader"></div>
        <p>Loading Documentation...</p>
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
      />
      <ResponsePanel
        endpoint={selectedEndpoint}
        paramValues={paramValues}
        apiResponse={apiResponse}
        isLoading={isLoading}
        error={error}
      />
    </Layout>
  );
}