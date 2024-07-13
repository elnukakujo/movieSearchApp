import React, { useState } from 'react';
import '../assets/css/components/SearchBar.css';

export default function SearchBar({onSearch}) {
    const [search, setSearch] = useState('');
    const handleChange = (event) => {
        const query = event.target.value;
        setSearch(query);
        if (query.length > 0) {
          onSearch(query);
        }
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