/*
* Lokasi: components/ResponsePanel.jsx
* Versi: v7
*/

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { IconResponse, IconCurl } from './Icons.jsx';
import LogoLoader from './LogoLoader.jsx';

const DynamicCodeBlock = dynamic(
  () => import('./CodeBlock'),
  { ssr: false, loading: () => <div className="loader"></div> }
);

export default function ResponsePanel({ endpoint, paramValues, apiResponse, isLoading, error, isChangingEndpoint }) {
  const [activeTab, setActiveTab] = useState('response');
  const [curlCommand, setCurlCommand] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') setBaseUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (endpoint && baseUrl) {
      const generateCurlCommand = () => {
        const method = (endpoint.method || 'GET').split(',')[0].trim().toUpperCase();
        const apiUrl = `${baseUrl}/api${endpoint.path}`;
        const hasFile = endpoint.params.some(p => p.type === 'file');

        if (method === 'GET' && !hasFile) {
          const cleanParams = Object.fromEntries(Object.entries(paramValues).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
          const queryParams = new URLSearchParams(cleanParams).toString();
          let command = `curl '${apiUrl}${queryParams ? `?${queryParams}` : ''}' \\\n`;
          command += `  -H 'User-Agent: Mozilla/5.0' \\\n`;
          command += `  -H 'Referer: ${baseUrl}/' \\\n`;
          command += `  --compressed`;
          setCurlCommand(command);
          return;
        }

        let command = `curl --location --request ${method} '${apiUrl}'`;

        if (hasFile) {
           Object.entries(paramValues).forEach(([key, value]) => {
            const paramInfo = endpoint.params.find(p => p.name === key);
            if (paramInfo && value) {
               if (paramInfo.type === 'file') {
                 command += ` \\\n  --form '${key}=@"/path/to/your/file.jpg"'`;
               } else {
                 command += ` \\\n  --form '${key}="${value}"'`;
               }
            }
          });
        } else {
          command += ` \\\n  --header 'Content-Type: application/json'`;
          command += ` \\\n  --data-raw '${JSON.stringify(paramValues, null, 2)}'`;
        }
        setCurlCommand(command);
      };
      generateCurlCommand();
    }
  }, [endpoint, paramValues, baseUrl]);

  return (
    <aside className="code-column">
      {isChangingEndpoint && (
        <div className="content-loader-wrapper">
          <LogoLoader size="small" />
        </div>
      )}
      <div className={`content-wrapper ${isChangingEndpoint ? 'hidden' : ''}`}>
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
      </div>
    </aside>
  );
}