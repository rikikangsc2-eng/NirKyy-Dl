/*
 * Lokasi: components/SearchPageSkeleton.jsx
 * Versi: v1
 */

import Skeleton from './Skeleton';

export default function SearchPageSkeleton() {
  return (
    <div className="search-page">
      <div className="search-bar" style={{ opacity: 1, animation: 'none' }}>
        <Skeleton height="44px" />
      </div>
    </div>
  );
}