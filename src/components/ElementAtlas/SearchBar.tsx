import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

export function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-3 border border-zinc-800 rounded-xl leading-5 bg-zinc-900/50 backdrop-blur-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 shadow-lg shadow-black/20 hover:bg-zinc-900/80"
        placeholder="Search by name, symbol, or atomic number..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      {query && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-200"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
