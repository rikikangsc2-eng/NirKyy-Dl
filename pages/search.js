/*
* Lokasi: pages/search.js
* Versi: v1
*/

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { getAllRoutes } from '../utils/api-parser';

const PageLoader = () => (
  <div className="page-loader-container">
    <div className="loader"></div>
  </div>
);

const DynamicSearchPage = dynamic(() => import('../components/SearchPage'), { loading: PageLoader });

export default function Search({ docs }) {
  const router = useRouter();
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const seoProps = {
    pageTitle: 'Search API - NirKyy API Docs',
    pageDescription: 'Quickly find any API endpoint by name, category, or description using the powerful search feature.',
    canonicalUrl: `${baseUrl}${router.asPath}`,
    ogImageUrl: `${baseUrl}/api.svg`,
  };

  return (
    <Layout {...seoProps} activeTab="search">
      <DynamicSearchPage docs={docs} />
    </Layout>
  );
}

export async function getStaticProps() {
  const docs = getAllRoutes();
  return {
    props: {
      docs,
    },
  };
}