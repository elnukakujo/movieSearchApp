import React, { useState, useEffect, useRef } from 'react';
import '../assets/css/components/dragMenu.css';
import ToggleButton from './toggleButton';
import { Link } from 'react-router-dom';

export default function DragMenu({ url, title, id, queryParams, toggleButton }) {
  const [movies, setMovies] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedMode, setSelectedMode] = useState('day');
  const moviesRef = useRef(null);

  const fetchMovies = async () => {
    let fullUrl = new URL(url);
    fullUrl.search = new URLSearchParams(queryParams).toString();
    if (toggleButton) {
      fullUrl.searchParams.append('TimeInterval', selectedMode);
    }
    try {
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMovies(data);
      moviesRef.current.scrollLeft = 0; // Reset scroll position to 0 on fetch
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]); // Set movies to empty array in case of error
    }
  };

  useEffect(() => {
    fetchMovies();
    const interval = setInterval(fetchMovies, 5000);
    return () => clearInterval(interval);
  }, [selectedMode, toggleButton]);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartX(event.clientX - moviesRef.current.offsetLeft);
    setScrollLeft(moviesRef.current.scrollLeft);
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    const x = event.clientX - moviesRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust the multiplier for faster scrolling
    moviesRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
  };

  return (
    <div className="section" id={id}>
      <div className="content">
        <h2>{title}</h2>
        {toggleButton && (
          <ToggleButton
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
          {movies.map((element) => (
            <Link key={element.id} className="img-container" to={`/movie/${element.id}`}>
              <img
                src={element.poster_path}
                alt={element.title}
                draggable="false"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}