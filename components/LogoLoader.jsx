/*
* Lokasi: components/LogoLoader.jsx
* Versi: v2
*/

export default function LogoLoader({ size = 'large', fadingOut = false }) {
  const sizeClass = size === 'large' ? 'loader-large' : 'loader-small';

  return (
    <div className={`logo-loader ${sizeClass} ${fadingOut ? 'fade-out-loader' : ''}`}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path className="logo-n-base" d="M25,75V25h10l30,35V25h10v50h-10l-30,-35v35z" />
          <path className="logo-n-glow" d="M25,75V25h10l30,35V25h10v50h-10l-30,-35v35z" />
        </g>
      </svg>
    </div>
  );
}