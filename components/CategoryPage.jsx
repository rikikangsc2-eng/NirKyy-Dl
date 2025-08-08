/*
* Lokasi: components/CategoryPage.jsx
* Versi: v9
*/

import { useState } from 'react';
import { IconDownloader, IconConverter, IconSearch, IconGame, IconOther, IconAI } from './Icons.jsx';
import { useAppContext } from '../context/AppContext.js';

const categoryIcons = {
  'AI': <IconAI />,
  'Downloader': <IconDownloader />,
  'Converter': <IconConverter />,
  'Search': <IconSearch />,
  'Game & Fun': <IconGame />,
  'Other': <IconOther />,
};

const getCategoryClass = (category) => {
  return `category-${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`;
};

export default function CategoryPage({ docs }) {
  const [openCategories, setOpenCategories] = useState({});
  const { handleSelectEndpoint } = useAppContext();

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  if (!docs) {
    return <div className="loader"></div>;
  }

  const sortedCategories = Object.keys(docs).sort((a, b) => {
      const order = ['AI', 'Downloader', 'Converter', 'Search', 'Game & Fun', 'Other'];
      return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <div className="category-page">
      {sortedCategories.map((category, catIndex) => (
        <div key={category} className={`category-group ${getCategoryClass(category)}`} style={{ animationDelay: `${catIndex * 100}ms` }}>
          <button onClick={() => toggleCategory(category)} className="category-header">
            <div className="category-title">
              {categoryIcons[category] || null}
              {category}
            </div>
            <span className={`category-arrow ${openCategories[category] ? 'open' : ''}`}>›</span>
          </button>
          {openCategories[category] && (
            <div className="category-items">
              {docs[category].map((doc, docIndex) => (
                <button
                  key={doc.id}
                  onClick={() => handleSelectEndpoint(doc.id)}
                  className="category-item-button"
                  style={{ animationDelay: `${docIndex * 50}ms` }}
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