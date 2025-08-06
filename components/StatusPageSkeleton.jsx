/*
 * Lokasi: components/StatusPageSkeleton.jsx
 * Versi: v1
 */

import Skeleton from './Skeleton';

export default function StatusPageSkeleton() {
  return (
    <div className="status-page-container">
      <header className="status-header">
        <Skeleton width="200px" height="2.5rem" style={{ margin: '0 auto 1rem' }} />
        <Skeleton width="150px" height="1.5rem" style={{ margin: '0 auto' }} />
      </header>
      <main className="monitor-list">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="monitor-item" style={{ opacity: 1, animation: 'none' }}>
            <div className="monitor-header">
              <Skeleton width="12px" height="12px" style={{ borderRadius: '50%' }} />
              <Skeleton width="60%" height="1rem" />
            </div>
            <Skeleton height="30px" style={{ marginBottom: '1rem' }} />
            <div className="uptime-stats" style={{ justifyContent: 'space-around' }}>
              <Skeleton width="25%" height="2.5rem" />
              <Skeleton width="25%" height="2.5rem" />
              <Skeleton width="25%" height="2.5rem" />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}