/*
 * Lokasi: components/HomePageSkeleton.jsx
 * Versi: v2
 */

import Skeleton from './Skeleton';
import { IconParameters, IconTag } from './Icons.jsx';

export default function HomePageSkeleton({ isWelcome = false }) {
  if (isWelcome) {
    return (
      <div className="welcome-container" style={{ opacity: 1, animation: 'none' }}>
        <Skeleton width="60%" height="2.5rem" style={{ maxWidth: '400px', margin: '0 auto 1rem' }} />
        <Skeleton width="80%" height="1.2rem" style={{ maxWidth: '500px', margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="content-wrapper">
        <h1><IconTag /> <Skeleton width="60%" height="2rem" /></h1>
        <div className="description">
            <Skeleton height="1rem" />
            <Skeleton height="1rem" width="80%" style={{ marginTop: '8px' }} />
        </div>
        <div className="endpoint-info">
          <Skeleton width="80px" height="28px" />
          <Skeleton width="70%" height="24px" />
        </div>
        <h2 className="section-title">
          <IconParameters /> Parameters
        </h2>
        <div className="params-form">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="input-group" style={{ opacity: 1, animation: 'none' }}>
              <Skeleton width="120px" height="1rem" style={{ marginBottom: '0.5rem' }} />
              <Skeleton height="40px" />
            </div>
          ))}
          <Skeleton height="44px" style={{ marginTop: '1rem' }} />
        </div>
      </div>
    </div>
  );
}