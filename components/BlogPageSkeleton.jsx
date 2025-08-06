/*
 * Lokasi: components/BlogPageSkeleton.jsx
 * Versi: v1
 */

import Skeleton from './Skeleton';

export default function BlogPageSkeleton() {
  return (
    <div className="blog-page-container">
      <header className="blog-header" style={{ opacity: 1, animation: 'none' }}>
        <Skeleton width="40%" height="3.5rem" style={{ margin: '0 auto 0.5rem', maxWidth: '300px' }} />
        <Skeleton width="60%" height="1.25rem" style={{ margin: '0 auto', maxWidth: '450px' }} />
      </header>
      <main className="blog-content">
        {[...Array(3)].map((_, index) => (
          <section key={index} className="blog-section" style={{ opacity: 1, animation: 'none' }}>
            <Skeleton width="50%" height="1.75rem" style={{ marginBottom: '1rem', maxWidth: '250px' }} />
            <Skeleton height="1rem" />
            <Skeleton height="1rem" width="90%" style={{ marginTop: '0.75rem' }} />
            <Skeleton height="1rem" width="80%" style={{ marginTop: '0.75rem' }} />
          </section>
        ))}
      </main>
    </div>
  );
}