import React, { useState, useEffect } from 'react';
import '../assets/css/components/SearchBar.css';

export default function SearchBar({ value, onSearch }) {
  const [search, setSearch] = useState(value);
  useEffect(() => {
    setSearch(value);
  }, [value]);
  const handleChange = (event) => {
    const query = event.target.value;
    setSearch(query);
    onSearch(query);
  };
  return (
    <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="Type a movie or a TV show name"
        value={search}
        onChange={handleChange}
      />
    </form>
  );
}