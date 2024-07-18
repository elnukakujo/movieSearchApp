import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import ToggleButton from "./ToggleButton";
import "../assets/css/components/dragSeason.css";

export default function DragSeason({ url, queryParams, toggleButton, season, currentEpisode }) {
  const { id } = useParams();
  const [episodes, setEpisodes] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const initialSeason = season || "1";
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [isClick, setIsClick] = useState(false);
  const episodesRef = useRef(null);

  // Fetch episodes when selectedSeason or URL/QueryParams change
  useEffect(() => {
    if (selectedSeason && url) {
      fetchEpisodes();
    }
  }, [selectedSeason, url, queryParams]);

  useEffect(() => {
    if (episodesRef.current && currentEpisode) {
      const currentElement = episodesRef.current.querySelector(`.episode-container.current`);
      if (currentElement) {
        // Center the current episode
        const containerWidth = episodesRef.current.clientWidth;
        const currentElementWidth = currentElement.clientWidth;
        const offset = currentElement.offsetLeft - (containerWidth / 2) + (currentElementWidth / 2);

        episodesRef.current.scrollTo({
          left: offset,
          behavior: 'smooth',
        });
      }
    }
  }, [episodes, currentEpisode]);

  // Function to fetch episodes based on selected season
  const fetchEpisodes = async () => {
    let fullUrl = new URL(url);
    fullUrl.search = new URLSearchParams(queryParams).toString();
    fullUrl.searchParams.append("SeasonID", selectedSeason);

    try {
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setEpisodes(data);
      if (episodesRef.current) {
        episodesRef.current.scrollLeft = 0; // Reset scroll position to 0 on fetch if episodesRef is available
      }
    } catch (error) {
      console.error("Error fetching episodes:", error);
      setEpisodes([]); // Set episodes to empty array in case of error
    }
  };

  // Handle mouse events for dragging functionality
  const handleMouseDown = (event) => {
    if(event.target.tagName==="A") return;
    setIsClick(true); // Assume it is a click until it moves
    setIsDragging(true);
    if (episodesRef.current) {
        setStartX(event.clientX - episodesRef.current.offsetLeft);
        setScrollLeft(episodesRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (event) => {
      if (!isDragging) return;
      setIsClick(false); // Not a click if it moves
      if (episodesRef.current) {
          const x = event.clientX - episodesRef.current.offsetLeft;
          const walk = (x - startX)*1.5; // Adjust the multiplier for faster scrolling
          episodesRef.current.scrollLeft = scrollLeft - walk;
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

  // Handle season change from ToggleButton component
  const handleSeasonChange = (season) => {
    setSelectedSeason(season);
  };


  // Render component
  return (
    <div className="section" id="dragSeason">
      <div className="content">
        {toggleButton && toggleButton.length > 1 && (
          <ToggleButton
            modes={toggleButton}
            selectedMode={selectedSeason}
            onModeChange={handleSeasonChange}
          />
        )}
        <div
          ref={episodesRef}
          className={`episodes ${isDragging ? "dragging" : ""}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {episodes.map((episode) => (
            <Link
              key={episode.id}
              className={`episode-container ${parseInt(currentEpisode)===episode.episode_number ? "current" : ""}`}
              to={`/tv/${id}/${episode.season_number}/${episode.episode_number}?language=en`}
              draggable="false"
            >
              <div className="episode-content">
                <div className="img-container">
                  <img 
                    src={episode.still_path!== "https://image.tmdb.org/t/p/w500" ? episode.still_path : ""} 
                    alt=""
                    draggable="false" 
                    style={episode.still_path === "https://image.tmdb.org/t/p/w500" ? { backgroundColor: "#ff4b4b", width: "100%", height: "100%", display: "block", borderRadius: "10px", border:"none" } : {}}
                  />
                </div>
                <p>{`Episode ${episode.episode_number}: ${episode.name}`}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}