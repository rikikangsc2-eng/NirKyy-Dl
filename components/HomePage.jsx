/*
* Lokasi: components/HomePage.jsx
* Versi: v7
*/


import MainContent from './MainContent';
import { useAppContext } from '../context/AppContext';

export default function HomePage() {
  const {
    currentEndpoint,
    paramValues,
    handleParamChange,
    handleExecute,
    isLoading,
    apiResponse,
    error,
    openResponsePanel,
  } = useAppContext();

  const isResponseReady = !!(apiResponse || error);

  if (!currentEndpoint) {
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
        endpoint={currentEndpoint}
        paramValues={paramValues}
        onParamChange={handleParamChange}
        onExecute={handleExecute}
        isLoading={isLoading}
      />
      {isResponseReady && (
        <button className="show-response-button" onClick={openResponsePanel}>
          View Response
        </button>
      )}
    </div>
  );
}