/*
* Lokasi: components/MainContent.jsx
* Versi: v8
*/

import { IconParameters, IconTag } from './Icons.jsx';
import LogoLoader from './LogoLoader.jsx';

export default function MainContent({ endpoint, paramValues, onParamChange, onExecute, isLoading, isChangingEndpoint }) {
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

  return (
    <main className="main-content">
      {isChangingEndpoint && (
        <div className="content-loader-wrapper">
          <LogoLoader size="small" />
        </div>
      )}
      <div className={`content-wrapper ${isChangingEndpoint ? 'hidden' : ''}`}>
        {endpoint ? (
          <>
            <h1><IconTag /> {endpoint.name}</h1>
            <p className="description">{endpoint.description}</p>
            <div className="endpoint-info">
              <span className={`method-badge ${getMethodClass(endpoint.method)}`}>
                {endpoint.method || 'N/A'}
              </span>
              <span className="path-text">{endpoint.path}</span>
            </div>
            <h2 className="section-title">
              <IconParameters /> Parameters
            </h2>
            {endpoint.params && endpoint.params.length > 0 ? (
              <div className="params-form">
                {endpoint.params.map(param => (
                  <div key={param.name} className="input-group">
                    <label htmlFor={param.name}>
                      {param.name}
                      {param.optional && <span className="optional-badge">Optional</span>}
                    </label>
                    {param.type === 'file' ? (
                      <input id={param.name} type="file" className="file-input" onChange={(e) => onParamChange(param.name, e.target.files[0])} />
                    ) : (
                      <input id={param.name} type="text" placeholder={`Enter ${param.name}...`} value={paramValues[param.name] || ''} onChange={(e) => onParamChange(param.name, e.target.value)} />
                    )}
                  </div>
                ))}
                <button onClick={onExecute} disabled={isLoading} className="execute-button">
                  {isLoading ? 'Executing...' : 'Execute'}
                </button>
              </div>
            ) : (
              <p>No parameters required.</p>
            )}
          </>
        ) : (
          <h1>Select an endpoint to view its documentation.</h1>
        )}
      </div>
    </main>
  );
}