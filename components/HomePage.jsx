/*
* Lokasi: components/HomePage.jsx
* Versi: v6
*/

import MainContent from './MainContent';

export default function HomePage(props) {
  const {
    endpoint,
    paramValues,
    onParamChange,
    onExecute,
    isLoading,
    apiResponse,
    error,
    onShowResponse,
  } = props;

  const isResponseReady = !!(apiResponse || error);

  if (!endpoint) {
    return (
      <div className="welcome-container">
        <h1>Welcome to NirKyy API</h1>
        <p>{`Select an endpoint from the 'Category' or 'Search' tab to get started.`}</p>
      </div>
    );
  }

  return (
    <div className="home-page-container">
      <MainContent
        endpoint={endpoint}
        paramValues={paramValues}
        onParamChange={onParamChange}
        onExecute={onExecute}
        isLoading={isLoading}
      />
      {isResponseReady && (
        <button className="show-response-button" onClick={onShowResponse}>
          View Response
        </button>
      )}
    </div>
  );
}