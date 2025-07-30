/*
* Lokasi: pages/index.js
* Versi: v11
*/

import { useState, useEffect } from 'react';
import { getAllRoutes } from '../utils/api-parser';
import Layout from '../components/Layout';
import MainContent from '../components/MainContent';
import ResponsePanel from '../components/ResponsePanel';

export default function Home({ docs }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [paramValues, setParamValues] = useState({});
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      let url = `/api/${selectedEndpoint.id}`;
      const options = { method: selectedEndpoint.method || 'GET' };
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
        const queryParams = new URLSearchParams(paramValues).toString();
        if (queryParams) url += `?${queryParams}`;
      }

      const res = await fetch(url, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setApiResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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

export async function getStaticProps() {
  const docs = getAllRoutes();
  return { props: { docs } };
}