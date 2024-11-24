import React from 'react';
import { MdOutlineSearch, MdClose, MdDeleteSweep } from 'react-icons/md';
import { searchHistory } from '../../utils/localStorage';

const SearchHistory = ({ 
  searches, 
  onSelect, 
  onClear,
  onRemoveItem,
  setRecentSearches 
}) => {
  if (!searches || searches.length === 0) return null;

  const handleRemoveItem = (term, e) => {
    e.stopPropagation();
    const updatedSearches = searches.filter(item => item !== term);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    setRecentSearches(updatedSearches);
    if (onRemoveItem) onRemoveItem(term);
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    searchHistory.clear();
    setRecentSearches([]);
    if (onClear) onClear();
  };

  return (
    <div className="absolute top-full left-0 w-full bg-neutral-800 mt-1 rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-700">
        <span className="text-white text-sm">최근 검색어</span>
        <button
          onClick={handleClearAll}
          className="text-gray-400 hover:text-red-500 flex items-center text-sm"
        >
          <MdDeleteSweep size={18} className="mr-1" />
          전체 삭제
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {searches.map((term, index) => (
          <div
            key={index}
            className="group flex items-center justify-between px-4 py-2 hover:bg-neutral-700 cursor-pointer"
            onClick={() => onSelect(term)}
          >
            <div className="flex items-center text-white">
              <MdOutlineSearch className="mr-2" size={16} />
              <span>{term}</span>
            </div>
            <button
              onClick={(e) => handleRemoveItem(term, e)}
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MdClose size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;