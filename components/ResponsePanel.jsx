/*
* Lokasi: components/ResponsePanel.jsx
* Versi: v4
*/

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { IconResponse, IconCurl } from './Icons.jsx';

const DynamicCodeBlock = dynamic(
  () => import('./CodeBlock'),
  { ssr: false, loading: () => <div className="loader"></div> }
);

export default function ResponsePanel({ endpoint, paramValues, apiResponse, isLoading, error }) {
  const [activeTab, setActiveTab] = useState('response');
  const [curlCommand, setCurlCommand] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') setBaseUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (endpoint && baseUrl) {
      const generateCurlCommand = () => {
        const method = (endpoint.method || 'GET').toUpperCase();
        const hasFile = endpoint.params.some(p => p.type === 'file');
        let command = `curl --location --request ${method} '${baseUrl}${endpoint.path}`;

        if (hasFile && method !== 'GET') {
          command = `curl --location --request ${method} '${baseUrl}${endpoint.path}'`;
          Object.keys(paramValues).forEach(key => {
            const paramInfo = endpoint.params.find(p => p.name === key);
            if (paramInfo.type === 'file') {
              command += ` \\\n--form '${key}=@"/path/to/your/file.jpg"'`;
            } else if (paramValues[key]) {
              command += ` \\\n--form '${key}="${paramValues[key]}"'`;
            }
          });
        } else if (method === 'GET') {
          const queryParams = new URLSearchParams(paramValues).toString();
          if (queryParams) command += `?${queryParams}`;
          command += "'";
        } else {
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
          <IconResponse /> Response
        </button>
        <button className={`tab-button ${activeTab === 'curl' ? 'active' : ''}`} onClick={() => setActiveTab('curl')}>
          <IconCurl /> cURL
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