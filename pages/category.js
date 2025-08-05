/*
* Lokasi: pages/category.js
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

const DynamicCategoryPage = dynamic(() => import('../components/CategoryPage'), { loading: PageLoader });

export default function Category({ docs }) {
  const router = useRouter();
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const seoProps = {
    pageTitle: 'API Categories - NirKyy API Docs',
    pageDescription: 'Browse all available API endpoints grouped by category: Downloader, Converter, Search, Game & Fun, and more.',
    canonicalUrl: `${baseUrl}${router.asPath}`,
    ogImageUrl: `${baseUrl}/api.svg`,
  };

  return (
    <Layout {...seoProps} activeTab="category">
      <DynamicCategoryPage docs={docs} />
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