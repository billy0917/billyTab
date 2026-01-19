import React, { useState } from 'react';
import { SearchEngine } from '../types';

const engines: SearchEngine[] = [
  { name: 'Google', url: 'https://www.google.com/search', queryParam: 'q' },
  { name: 'Bing', url: 'https://www.bing.com/search', queryParam: 'q' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com/', queryParam: 'q' },
];

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [engine] = useState<SearchEngine>(engines[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `${engine.url}?${engine.queryParam}=${encodeURIComponent(query)}`;
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl px-4">
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${engine.name}...`}
          className="w-full py-4 px-6 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/70 border border-white/30 focus:outline-none focus:bg-white/30 focus:border-white/50 transition-all duration-300 shadow-lg text-lg"
          autoFocus
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 group-hover:text-white transition-colors cursor-pointer" onClick={handleSearch}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;