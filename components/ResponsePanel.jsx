/*
* Lokasi: components/ResponsePanel.jsx
* Versi: v1
*/

import { useState, useEffect } from 'react';
import CodeBlock from './CodeBlock';

export default function ResponsePanel({ endpoint, paramValues, apiResponse, isLoading, error }) {
  const [activeTab, setActiveTab] = useState('response');
  const [curlCommand, setCurlCommand] = useState('');

  useEffect(() => {
    if (endpoint) {
      const generateCurlCommand = () => {
        const baseUrl = 'https://nirkyy-downloader.vercel.com';
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
  }, [endpoint, paramValues]);

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
            {apiResponse && <CodeBlock code={JSON.stringify(apiResponse, null, 2)} language="json" />}
            {!isLoading && !error && !apiResponse && <p className="text-muted">Execute a request to see the response here.</p>}
          </>
        )}
        {activeTab === 'curl' && (
          <CodeBlock code={curlCommand} language="bash" />
        )}
      </div>
    </aside>
  );
}