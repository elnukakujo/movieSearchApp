import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import '../assets/css/pages/SearchDetails.css';

export default function SearchResults(){
  const { term } = useParams();
  const [results,setResults] = useState([])

  const fetchElements = async () => {
    let url = `http://127.0.0.1:5252/api/TmdbData/search?Query=${term}&Language=en`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    setResults(data);
  };

  useEffect(() => {
    fetchElements();
    const interval = setInterval(fetchElements, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [term]);

  return (
    <div className='section' id='search-results'>
      <div className='content'>
        <h1>Search Results for: {term}</h1>
        <div className='results'>
          {results.map((result)=>(
            result.poster_path!=="https://image.tmdb.org/t/p/w500" && (
              <Link
                key={result.id}
                className="poster-container"
                to={`/${result.media_type}/${result.id}?language=en`}
                draggable="false"
              >
                <img
                  src={result.poster_path}
                  alt={result.title}
                  draggable="false"
                />
                <h4>{result.name||result.title}</h4>
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
};