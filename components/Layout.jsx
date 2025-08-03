/*
* Lokasi: components/Layout.jsx
* Versi: v6
*/

import Head from 'next/head';
import dynamic from 'next/dynamic';
import BottomNavbar from './BottomNavbar';

const DynamicResponsePanel = dynamic(() => import('./ResponsePanel'));

export default function Layout(props) {
  const { 
    children, 
    activeTab, 
    setActiveTab,
    isResponsePanelOpen,
    closeResponsePanel,
    ...responsePanelProps 
  } = props;

  return (
    <>
      <Head>
        <title>NirKyy API Docs</title>
        <meta name="description" content="API Documentation for NirKyy Services" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/api.svg" />
      </Head>

      <div className="app-shell">
        <main className="page-content">
          {children}
        </main>
        <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        {isResponsePanelOpen && (
          <DynamicResponsePanel onClose={closeResponsePanel} {...responsePanelProps} />
        )}
      </div>
    </>
  );
}