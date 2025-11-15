import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex items-center bg-white shadow-md rounded-xl overflow-hidden border border-gray-200"
    >
      <div className="px-4 text-gray-500">
        <FiSearch className="text-xl" />
      </div>

      <input
        type="text"
        placeholder="Search for a destination, city, property..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 py-3 px-2 outline-none text-gray-700"
      />

      <button
        type="submit"
        className="bg-blue-950 text-white px-6 py-3 font-medium hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
