/*
* Lokasi: components/HomePage.jsx
* Versi: v10
*/

import { useMemo } from 'react';
import MainContent from './MainContent';
import { useAppContext } from '../context/AppContext';
import { IconChevronDown } from './Icons';

const getCategoryClass = (category) => {
  if (!category) return 'category-other';
  return `category-${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`;
};

const getMethodClass = (method) => {
  const mainMethod = (method || 'GET').split(',')[0].trim().toUpperCase();
  switch (mainMethod) {
    case 'GET': return 'method-get';
    case 'POST': return 'method-post';
    case 'PUT': return 'method-put';
    case 'DELETE': return 'method-delete';
    default: return 'method-other';
  }
};

export default function HomePage() {
  const {
    docs,
    activeEndpointId,
    setActiveEndpointId,
    paramValues,
    handleParamChange,
    handleExecute,
    isLoading,
    apiResponse,
    error,
    openResponsePanel,
    getEndpointById
  } = useAppContext();

  const flattenedDocs = useMemo(() => {
    if (!docs) return [];
    const order = ['AI', 'Downloader', 'Converter', 'Search', 'Game & Fun', 'Other'];
    return order.flatMap(category => docs[category] || []);
  }, [docs]);

  if (!docs) {
    return (
      <div className="page-loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const isResponseReady = !!(apiResponse || error);
  const activeEndpoint = getEndpointById(activeEndpointId);

  return (
    <div className="endpoint-list-container">
       <header className="home-header">
        <h1>NirKyy <span>API</span></h1>
        <p>Dokumentasi API Interaktif & Modern. Jelajahi, uji, dan integrasikan dengan mudah.</p>
      </header>

      {flattenedDocs.map((endpoint) => {
        const isActive = activeEndpointId === endpoint.id;
        const categoryClass = getCategoryClass(endpoint.category);

        return (
          <div key={endpoint.id} id={`endpoint-${endpoint.id.replace(/\//g, '-')}`} className={`endpoint-list-item ${categoryClass} ${isActive ? 'active' : ''}`}>
            <div
              className={`endpoint-item-header ${isActive ? 'active' : ''}`}
              onClick={() => setActiveEndpointId(isActive ? null : endpoint.id)}
            >
              <span className={`method-badge ${getMethodClass(endpoint.method)}`}>
                {endpoint.method.split(',')[0].trim()}
              </span>
              <div className="endpoint-item-header-info">
                <div className="name">{endpoint.name}</div>
                <div className="path">{endpoint.path}</div>
              </div>
              <IconChevronDown className="chevron" />
            </div>
            <div className={`endpoint-item-body ${isActive ? 'open' : ''}`}>
              {isActive && (
                <MainContent
                  endpoint={activeEndpoint}
                  paramValues={paramValues}
                  onParamChange={handleParamChange}
                  onExecute={handleExecute}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        );
      })}
      {isResponseReady && (
        <button className="show-response-button" onClick={openResponsePanel}>
          View Response
        </button>
      )}
    </div>
  );
}