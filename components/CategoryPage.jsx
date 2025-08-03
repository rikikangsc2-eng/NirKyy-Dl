/*
* Lokasi: components/CategoryPage.jsx
* Versi: v3
*/

import { useState } from 'react';
import { IconDownloader, IconConverter, IconSearch, IconGame, IconOther } from './Icons.jsx';

const categoryIcons = {
  'Downloader': <IconDownloader />,
  'Converter': <IconConverter />,
  'Search': <IconSearch />,
  'Game & Fun': <IconGame />,
  'Other': <IconOther />,
};

export default function CategoryPage({ docs, onSelectEndpoint }) {
  const [openCategories, setOpenCategories] = useState({});

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