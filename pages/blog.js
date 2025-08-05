/*
* Lokasi: pages/blog.js
* Versi: v1
*/

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';

const PageLoader = () => (
  <div className="page-loader-container">
    <div className="loader"></div>
  </div>
);

const DynamicBlogPage = dynamic(() => import('../components/BlogPage'), { loading: PageLoader });

export default function Blog() {
  const router = useRouter();
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const seoProps = {
    pageTitle: 'Blog & Information - NirKyy API Docs',
    pageDescription: 'Find information about the NirKyy API, contact details, updates, and collaboration opportunities.',
    canonicalUrl: `${baseUrl}${router.asPath}`,
    ogImageUrl: `${baseUrl}/api.svg`,
  };

  return (
    <Layout {...seoProps} activeTab="blog">
      <DynamicBlogPage />
    </Layout>
  );
}