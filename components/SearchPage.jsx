/*
* Lokasi: components/SearchPage.jsx
* Versi: v5
*/

import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';

export default function SearchPage({ docs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSelectEndpoint = (doc) => {
    router.push(`/endpoint/${doc.id}`);
  };

  const filteredDocs = useMemo(() => {
    if (!searchTerm) {
      return [];
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    const results = [];
    Object.values(docs).forEach(category => {
      category.forEach(doc => {
        if (
          doc.name.toLowerCase().includes(lowerCaseSearch) ||
          doc.category.toLowerCase().includes(lowerCaseSearch) ||
          doc.description.toLowerCase().includes(lowerCaseSearch)
        ) {
          results.push(doc);
        }
      });
    });
    return results;
  }, [searchTerm, docs]);

  if (!docs) {
    return <div className="loader"></div>;
  }

  return (
    <div className="search-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for features or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="search-results">
        {searchTerm && filteredDocs.length === 0 && (
          <p className="no-results">{`No features found for "${searchTerm}"`}</p>
        )}
        {filteredDocs.map((doc, index) => (
          <button
            key={doc.id}
            className="search-result-item"
            onClick={() => handleSelectEndpoint(doc)}
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <span className="result-category">{doc.category}</span>
            <span className="result-name">{doc.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}