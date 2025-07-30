/*
* Lokasi: components/MainContent.jsx
* Versi: v1
*/

export default function MainContent({ endpoint, paramValues, onParamChange, onExecute, isLoading }) {
  const getMethodClass = (method) => {
    switch ((method || '').toUpperCase()) {
      case 'GET': return 'method-get';
      case 'POST': return 'method-post';
      case 'PUT': return 'method-put';
      case 'DELETE': return 'method-delete';
      default: return 'method-other';
    }
  };

  return (
    <main className="main-content">
      {endpoint ? (
        <>
          <h1>{endpoint.name}</h1>
          <p className="description">{endpoint.description}</p>
          <div className="endpoint-info">
            <span className={`method-badge ${getMethodClass(endpoint.method)}`}>
              {endpoint.method || 'N/A'}
            </span>
            <span className="path-text">{endpoint.path}</span>
          </div>
          <h2 className="section-title">Parameters</h2>
          {endpoint.params && endpoint.params.length > 0 ? (
            <div className="params-form">
              {endpoint.params.map(param => (
                <div key={param} className="input-group">
                  <label htmlFor={param}>{param}</label>
                  <input
                    id={param}
                    type="text"
                    placeholder={`Enter ${param}...`}
                    value={paramValues[param] || ''}
                    onChange={(e) => onParamChange(param, e.target.value)}
                  />
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
    </main>
  );
}