/*
 * Lokasi: components/CategoryPageSkeleton.jsx
 * Versi: v1
 */

import Skeleton from './Skeleton';

export default function CategoryPageSkeleton() {
  return (
    <div className="category-page">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="category-group" style={{ opacity: 1, animation: 'none', borderBottom: '1px solid var(--border-color)' }}>
          <div className="category-header">
            <div className="category-title">
              <Skeleton width="24px" height="24px" style={{ borderRadius: '4px' }}/>
              <Skeleton width="150px" height="20px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}