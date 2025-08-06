/*
 * Lokasi: components/Layout.jsx
 * Versi: v13
 */

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import BottomNavbar from './BottomNavbar';
import { useAppContext } from '../context/AppContext';
import HomePageSkeleton from './HomePageSkeleton';
import CategoryPageSkeleton from './CategoryPageSkeleton';
import SearchPageSkeleton from './SearchPageSkeleton';
import StatusPageSkeleton from './StatusPageSkeleton';
import BlogPageSkeleton from './BlogPageSkeleton';

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
    closeResponsePanel,
    isPageLoading,
    navigatingTo
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

  const getSkeletonForRoute = () => {
    const path = navigatingTo || router.pathname;
    if (path === '/') return <HomePageSkeleton isWelcome={true} />;
    if (path.startsWith('/endpoint')) return <HomePageSkeleton />;
    if (path.startsWith('/category')) return <CategoryPageSkeleton />;
    if (path.startsWith('/search')) return <SearchPageSkeleton />;
    if (path.startsWith('/status')) return <StatusPageSkeleton />;
    if (path.startsWith('/blog')) return <BlogPageSkeleton />;
    return <HomePageSkeleton isWelcome={true} />;
  };

  return (
    <div className="app-shell">
      <main className="page-content">
        {isPageLoading ? getSkeletonForRoute() : (
          <div key={router.pathname} className="page-content-wrapper">
            {children}
          </div>
        )}
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