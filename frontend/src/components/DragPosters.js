import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ToggleButton from './ToggleButton'; // Import ToggleButton component
import '../assets/css/components/dragPosters.css'; // Ensure correct path to CSS file

export default function DragPosters({ url, title, queryParams, toggleButton = [], posters }) {
  const [movies, setMovies] = useState([]||posters);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedMode, setSelectedMode] = useState(toggleButton[0] || ''); // Default to empty string if toggleButton[0] is not available
  const [isClick, setIsClick] = useState(false);
  const moviesRef = useRef(null);

  const fetchMovies = async (mode) => {
    let fullUrl = new URL(url);
    fullUrl.search = new URLSearchParams(queryParams).toString();
    if (toggleButton.length > 0 && mode) {
      fullUrl.searchParams.append('SelectedMode', mode.toLowerCase());
    }
    try {
      console.log(fullUrl); // Log the URL to check correctness
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMovies(data);
      if (moviesRef.current) {
        moviesRef.current.scrollLeft = 0; // Reset scroll position to 0 on fetch if moviesRef is available
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]); // Set movies to empty array in case of error
    }
  };

  useEffect(() => {
    if(!posters){
      fetchMovies(selectedMode);
    } else {
      setMovies(posters);
    }
  }, [url, queryParams]); // Fetch movies when URL or queryParams change

  const handleMouseDown = (event) => {
    if(event.target.tagName==="A") return;
    setIsClick(true); // Assume it is a click until it moves
    setIsDragging(true);
    if (moviesRef.current) {
        setStartX(event.clientX - moviesRef.current.offsetLeft);
        setScrollLeft(moviesRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (event) => {
      if (!isDragging) return;
      setIsClick(false); // Not a click if it moves
      if (moviesRef.current) {
          const x = event.clientX - moviesRef.current.offsetLeft;
          const walk = (x - startX) * 2; // Adjust the multiplier for faster scrolling
          moviesRef.current.scrollLeft = scrollLeft - walk;
      }
  };

  const handleMouseUp = (event) => {
      setIsDragging(false);
      if (!isClick) {
          event.preventDefault();
      }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    fetchMovies(mode); // Fetch movies immediately when mode changes
  };

  const scrollBy = (direction) => {
    if (moviesRef.current) {
      const itemWidth = moviesRef.current.querySelector('.poster-container').offsetWidth;
      moviesRef.current.scrollLeft += direction * itemWidth;
    }
  };

  if (movies.length === 0) {
    return null; // Return null if movies array is empty
  }

  const uniquePosters = Array.from(new Set(movies.map(m => m.id)))
    .map(id => {
      return movies.find(m => m.id === id);
    }
  );

  return (
    <div className="section" id="dragPosters">
      <div className="content">
        <h2>{title}</h2>
        {toggleButton.length > 0 && (
          <ToggleButton
            modes={toggleButton}
            selectedMode={selectedMode}
            onModeChange={handleModeChange}
          />
        )}
        <div
          ref={moviesRef}
          className={`movies ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {uniquePosters.map((element) => (
            element.poster_path && element.poster_path!=="https://image.tmdb.org/t/p/w500" && (
              <Link
                key={element.id}
                className="poster-container"
                to={`/${element.media_type}/${element.id}?language=en`}
                draggable="false"
              >
                <img
                  src={element.poster_path}
                  alt={element.title}
                  draggable="false"
                />
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
}