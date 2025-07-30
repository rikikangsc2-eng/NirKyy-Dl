/*
* Lokasi: components/ResponsePanel.jsx
* Versi: v3
*/

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DynamicCodeBlock = dynamic(
  () => import('./CodeBlock'),
  { 
    ssr: false,
    loading: () => <div className="loader"></div>
  }
);

export default function ResponsePanel({ endpoint, paramValues, apiResponse, isLoading, error }) {
  const [activeTab, setActiveTab] = useState('response');
  const [curlCommand, setCurlCommand] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (endpoint && baseUrl) {
      const generateCurlCommand = () => {
        let command = `curl --location --request ${endpoint.method || 'GET'} '${baseUrl}${endpoint.path}`;

        const method = (endpoint.method || 'GET').toUpperCase();

        if (method === 'GET') {
          const queryParams = new URLSearchParams(paramValues).toString();
          if (queryParams) {
            command += `?${queryParams}`;
          }
          command += "'";
        } else if (['POST', 'PUT'].includes(method)) {
          command += "' \\\n--header 'Content-Type: application/json' \\\n--data-raw '";
          command += JSON.stringify(paramValues, null, 2);
          command += "'";
        }
        setCurlCommand(command);
      };
      generateCurlCommand();
    }
  }, [endpoint, paramValues, baseUrl]);

  return (
    <aside className="code-column">
      <div className="tabs">
        <button className={`tab-button ${activeTab === 'response' ? 'active' : ''}`} onClick={() => setActiveTab('response')}>
          Response
        </button>
        <button className={`tab-button ${activeTab === 'curl' ? 'active' : ''}`} onClick={() => setActiveTab('curl')}>
          cURL
        </button>
      </div>
      <div className="response-container">
        {activeTab === 'response' && (
          <>
            {isLoading && <div className="loader"></div>}
            {error && <div className="error-message">{error}</div>}
            {apiResponse && <DynamicCodeBlock code={JSON.stringify(apiResponse, null, 2)} language="json" />}
            {!isLoading && !error && !apiResponse && <p className="text-muted">Execute a request to see the response here.</p>}
          </>
        )}
        {activeTab === 'curl' && (
          <DynamicCodeBlock code={curlCommand} language="bash" />
        )}
      </div>
    </aside>
  );
}