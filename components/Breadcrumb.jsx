/*
* Lokasi: components/Breadcrumb.jsx
* Versi: v1
*/

import Link from 'next/link';
import { IconHome } from './Icons';

export default function Breadcrumb({ pathSegments }) {
  if (!pathSegments || pathSegments.length === 0) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-container">
      <ol className="breadcrumb-list">
        {pathSegments.map((segment, index) => (
          <li key={index} className="breadcrumb-item">
            {index > 0 && <span className="breadcrumb-separator">›</span>}
            {index === 0 && segment.name === 'Home' && (
              <IconHome />
            )}
            {segment.href ? (
              <Link href={segment.href} legacyBehavior>
                <a className="breadcrumb-link">{segment.name}</a>
              </Link>
            ) : (
              <span className="breadcrumb-current" aria-current="page">
                {segment.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}