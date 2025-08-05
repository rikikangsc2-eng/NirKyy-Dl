/*
* Lokasi: components/Layout.jsx
* Versi: v11
*/


import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import BottomNavbar from './BottomNavbar';
import { useAppContext } from '../context/AppContext';

const DynamicResponsePanel = dynamic(() => import('./ResponsePanel'));

export default function Layout({ children }) {
  const router = useRouter();
  const {
    currentEndpoint,
    paramValues,
    apiResponse,
    isLoading,
    error,
    isResponsePanelOpen,
    isPanelClosing,
    closeResponsePanel
  } = useAppContext();

  const getActiveTab = () => {
    const { pathname } = router;
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/endpoint')) return 'home';
    if (pathname.startsWith('/category')) return 'category';
    if (pathname.startsWith('/search')) return 'search';
    if (pathname.startsWith('/status')) return 'status';
    if (pathname.startsWith('/blog')) return 'blog';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <div className="app-shell">
      <main className="page-content">
        <div key={router.pathname} className="page-content-wrapper">
          {children}
        </div>
      </main>
      <BottomNavbar activeTab={activeTab} />
      {isResponsePanelOpen && (
        <DynamicResponsePanel
          onClose={closeResponsePanel}
          isClosing={isPanelClosing}
          endpoint={currentEndpoint}
          paramValues={paramValues}
          apiResponse={apiResponse}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}