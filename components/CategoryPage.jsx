/*
* Lokasi: components/CategoryPage.jsx
* Versi: v1
*/

import { useState, useEffect } from 'react';
import { IconDownloader, IconConverter, IconSearch, IconGame } from './Icons.jsx';

const categoryIcons = {
  'Downloader': <IconDownloader />,
  'Converter': <IconConverter />,
  'Search': <IconSearch />,
  'Game & Fun': <IconGame />,
};

export default function CategoryPage({ docs, onSelectEndpoint }) {
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

  if (!docs) {
    return <div className="loader"></div>;
  }

  return (
    <div className="category-page">
      {Object.keys(docs).map(category => (
        <div key={category} className="category-group">
          <button onClick={() => toggleCategory(category)} className="category-header">
            <div className="category-title">
              {categoryIcons[category] || null}
              {category}
            </div>
            <span className={`category-arrow ${openCategories[category] ? 'open' : ''}`}>›</span>
          </button>
          {openCategories[category] && (
            <div className="category-items">
              {docs[category].map(doc => (
                <button
                  key={doc.id}
                  onClick={() => onSelectEndpoint(doc)}
                  className="category-item-button"
                >
                  {doc.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}