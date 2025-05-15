"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";

interface VideosSearchProps {
  onSearch: (term: string) => void;
}

export default function VideosSearch({ onSearch }: VideosSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(searchTerm);
    },
    [searchTerm, onSearch]
  );

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Search videos..."
        />
      </div>
    </form>
  );
}
