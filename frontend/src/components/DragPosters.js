import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ToggleButton from './ToggleButton'; // Import ToggleButton component
import '../assets/css/components/dragPosters.css'; // Ensure correct path to CSS file

export default function DragPosters({ url, title, queryParams, toggleButton = [] }) {
  const [movies, setMovies] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedMode, setSelectedMode] = useState(toggleButton[0] || ''); // Default to empty string if toggleButton[0] is not available
  const moviesRef = useRef(null);

  const fetchMovies = async (mode) => {
    let fullUrl = new URL(url);
    fullUrl.search = new URLSearchParams(queryParams).toString();
    if (toggleButton.length > 0 && mode) {
      fullUrl.searchParams.append('SelectedMode', mode);
    }
    try {
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
    fetchMovies(selectedMode);
  }, [url, queryParams]); // Fetch movies when URL or queryParams change

  const handleMouseDown = (event) => {
    if (event.target.tagName.toLowerCase() === 'a') {
      event.preventDefault(); // Prevent default behavior if clicking on a link
    }
    setIsDragging(true);
    if (moviesRef.current) {
      setStartX(event.clientX - moviesRef.current.offsetLeft);
      setScrollLeft(moviesRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    if (moviesRef.current) {
      const x = event.clientX - moviesRef.current.offsetLeft;
      const walk = (x - startX) * 2; // Adjust the multiplier for faster scrolling
      moviesRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    fetchMovies(mode); // Fetch movies immediately when mode changes
  };

  if (movies.length === 0) {
    return null; // Return null if movies array is empty
  }

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
          {movies.map((element) => (
            element.poster_path!=="https://image.tmdb.org/t/p/w500" && (
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