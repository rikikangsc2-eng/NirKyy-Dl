/*
 * Lokasi: pages/_app.js
 * Versi: v7
 */

import '../styles/globals.css';
import { AppProvider } from '../context/AppContext';
import Layout from '../components/Layout';
import { Inter, Fira_Code } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
});

function MyApp({ Component, pageProps }) {
  return (
    <div className={`${inter.variable} ${firaCode.variable}`}>
      <AppProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppProvider>
    </div>
  );
}

export default MyApp;