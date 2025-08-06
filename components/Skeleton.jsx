/*
 * Lokasi: components/Skeleton.jsx
 * Versi: v1
 */

export default function Skeleton({ width, height, className, style }) {
  const customStyle = {
    width: width || '100%',
    height: height || '1rem',
    ...style,
  };

  return (
    <div
      className={`skeleton ${className || ''}`}
      style={customStyle}
    />
  );
}