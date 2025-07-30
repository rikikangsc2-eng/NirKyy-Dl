/*
* Lokasi: components/Sidebar.jsx
* Versi: v3
*/

import { FixedSizeList as List } from 'react-window';

export default function Sidebar({ docs, onSelect, selectedId, isOpen, onClose }) {
  const Row = ({ index, style }) => {
    const doc = docs[index];
    const isActive = doc.id === selectedId;
    return (
      <div style={style}>
        <button
          onClick={() => {
            if (onSelect) onSelect(doc);
            if (onClose) onClose();
          }}
          className={`sidebar-item ${isActive ? 'active' : ''}`}
        >
          {doc.name}
        </button>
      </div>
    );
  };

  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        API Endpoints
        <button onClick={onClose} className="sidebar-close-button">✕</button>
      </div>
      <div className="sidebar-list-container">
        <List
          height={600}
          itemCount={docs.length}
          itemSize={45}
          width={'100%'}
        >
          {Row}
        </List>
      </div>
    </nav>
  );
}