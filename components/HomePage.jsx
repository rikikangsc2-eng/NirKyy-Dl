/*
* Lokasi: components/HomePage.jsx
* Versi: v1
*/

import MainContent from './MainContent';
import ResponsePanel from './ResponsePanel';

export default function HomePage(props) {
  const { endpoint, paramValues, onParamChange, onExecute, isLoading, apiResponse, error, isChangingEndpoint } = props;

  if (!endpoint) {
    return (
      <div className="welcome-container">
        <h1>Welcome to NirKyy API</h1>
        <p>Select an endpoint from the 'Category' or 'Search' tab to get started.</p>
      </div>
    );
  }

  return (
    <div className="content-split">
      <MainContent
        endpoint={endpoint}
        paramValues={paramValues}
        onParamChange={onParamChange}
        onExecute={onExecute}
        isLoading={isLoading}
        isChangingEndpoint={isChangingEndpoint}
      />
      <ResponsePanel
        endpoint={endpoint}
        paramValues={paramValues}
        apiResponse={apiResponse}
        isLoading={isLoading}
        error={error}
        isChangingEndpoint={isChangingEndpoint}
      />
    </div>
  );
}