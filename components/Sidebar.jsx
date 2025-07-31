/*
* Lokasi: components/Sidebar.jsx
* Versi: v8
*/

import { useState, useEffect } from 'react';
import { IconDownloader, IconConverter, IconSearch, IconGame } from './Icons.jsx';

const categoryIcons = {
  'Downloader': <IconDownloader />,
  'Converter': <IconConverter />,
  'Search': <IconSearch />,
  'Game & Fun': <IconGame />,
};

export default function Sidebar({ docs, onSelect, selectedId, isOpen, onClose }) {
  const [openCategories, setOpenCategories] = useState({});

  useEffect(() => {
    if (docs) {
      const initialOpenState = {};
      Object.keys(docs).forEach(category => {
        initialOpenState[category] = true;
      });
      setOpenCategories(initialOpenState);
    }
  }, [docs]);

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const getMethodClass = (method) => {
    const mainMethod = (method || 'other').split(',')[0].trim().toLowerCase();
    return `method-${mainMethod}`;
  };

  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        API Endpoints
      </div>
      <div className="sidebar-list-container">
        {Object.keys(docs).map(category => (
          <div key={category} className="category-group">
            <button onClick={() => toggleCategory(category)} className="category-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {categoryIcons[category] || null}
                {category}
              </div>
              <span className={`category-arrow ${openCategories[category] ? 'open' : ''}`}>›</span>
            </button>
            {openCategories[category] && (
              <div className="category-items">
                {docs[category].map(doc => {
                  const isActive = doc.id === selectedId;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => {
                        if (onSelect) onSelect(doc);
                        if (onClose) onClose();
                      }}
                      className={`sidebar-item ${isActive ? 'active' : ''} ${isActive ? getMethodClass(doc.method) : ''}`}
                    >
                      {doc.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}