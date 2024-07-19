import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ToggleButton from './ToggleButton'; // Import ToggleButton component
import '../assets/css/components/dragPosters.css'; // Ensure correct path to CSS file

export default function DragPosters({ url, title, queryParams, toggleButton = [], posters }) {
  const [movies, setMovies] = useState(posters || []);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedMode, setSelectedMode] = useState(toggleButton[0] || ''); // Default to empty string if toggleButton[0] is not available
  const [isClick, setIsClick] = useState(false);
  const [isLeftDisabled, setIsLeftDisabled] = useState(true);
  const [isRightDisabled, setIsRightDisabled] = useState(false);
  const moviesRef = useRef(null);

  const checkScrollButtons = () => {
    if (moviesRef.current) {
      setIsLeftDisabled(moviesRef.current.scrollLeft <= 200);
      setIsRightDisabled(moviesRef.current.scrollLeft + moviesRef.current.clientWidth >= moviesRef.current.scrollWidth - 200);
    }
  };

  const fetchMovies = async (mode) => {
    let fullUrl = new URL(url);
    fullUrl.search = new URLSearchParams(queryParams).toString();
    if (toggleButton.length > 0 && mode) {
      fullUrl.searchParams.append('SelectedMode', mode.toLowerCase());
    }
    try {
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMovies(data);
      if (moviesRef.current) {
        moviesRef.current.scrollLeft = 0;
        setTimeout(checkScrollButtons, 300);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    }
  };

  useEffect(() => {
    if (!posters) {
      fetchMovies(selectedMode);
    } else {
      setMovies(posters);
    }
    setTimeout(checkScrollButtons, 300);
  }, [url, queryParams, selectedMode]); // Fetch movies when URL or queryParams change

  const handleMouseDown = (event) => {
    if (event.target.tagName === "A") return;
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
          setTimeout(checkScrollButtons, 300);
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
  };

  const scrollBy = (direction) => {
    if (moviesRef.current) {
      const scrollAmount = direction * moviesRef.current.clientWidth;

      let newScrollLeft = moviesRef.current.scrollLeft + scrollAmount;

      newScrollLeft = Math.max(0, Math.min(newScrollLeft, moviesRef.current.scrollWidth - moviesRef.current.clientWidth));

      moviesRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      setTimeout(checkScrollButtons, 300);
    }
  };

  if (movies.length === 0) {
    return null; // Return null if movies array is empty
  }

  const uniquePosters = Array.from(new Set(movies.map(m => m.id)))
    .map(id => {
      return movies.find(m => m.id === id);
    });

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
        <div className='scroll-row'>
          <button
            className={`scroll-button left ${isLeftDisabled ? 'disabled' : ''}`}
            onClick={() => scrollBy(-1)}
            disabled={isLeftDisabled}
          >
            <div className='line'/>
            <div className='line'/>
          </button>
          <div
            ref={moviesRef}
            className={`movies ${isDragging ? 'dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {uniquePosters.map((element) => (
              element.poster_path && element.poster_path !== "https://image.tmdb.org/t/p/w500" && (
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
          <button
            className={`scroll-button right ${isRightDisabled ? 'disabled' : ''}`}
            onClick={() => scrollBy(1)}
            disabled={isRightDisabled}
          >
            <div className='line'/>
            <div className='line'/>
          </button>
        </div>
      </div>
    </div>
  );
}