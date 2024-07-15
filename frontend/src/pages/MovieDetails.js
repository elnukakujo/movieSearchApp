import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../assets/css/pages/movieDetails.css';
import DragPosters from '../components/DragPosters';
import DragSeason from '../components/DragSeason';
import ActorsLayout from '../components/ActorsLayout';

export default function Details() {
  const { media_type, id } = useParams(); // Get movie_id from route parameter
  const { search } = useLocation(); // Get query string
  const queryParams = new URLSearchParams(search);
  const language = queryParams.get('language') || 'en'; // Default to 'en' if language not specified
  const [element, setElement] = useState({});
  const dateStr = element.release_date || element.first_air_date;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let fullUrl = new URL(
          `http://127.0.0.1:5252/api/TmdbData/findById?MediaType=${media_type}&id=${id}&Language=${language}`
        );
        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setElement(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies(); // Initial fetch
    const interval = setInterval(fetchMovies, 500); // Fetch every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [media_type, id, language]);

  function getDuration(runtime) {
      if(runtime>60){
          let min = (runtime%60).toString();
          if(min.length===1) min = "0"+min;
          return (Math.floor(runtime/60)).toString()+"h"+min;
      }else{
          return runtime.toString()+"min"
      }
  }

  const backdropUrl = element.backdrop_path;
  const isValidBackdrop = backdropUrl && backdropUrl !== "https://image.tmdb.org/t/p/w500" && backdropUrl !== "https://image.tmdb.org/t/p/w780";

  const introStyle = isValidBackdrop
    ? { backgroundImage: `url(${backdropUrl})` }
    : {};

  return (
    <div className="section" id="details">
      <div className="content" >
        <div className={`intro ${isValidBackdrop ? 'with-background' : ''}`} style={isValidBackdrop ? { '--bg-image': `url(${backdropUrl})` } : {}}>
          <div className="overlay"/>
          <a href={element.homepage} target='_blank' className='poster-container' rel="noopener noreferrer">
            <img
              src={element.poster_path}
              alt={element.title || element.name}
              className="poster"
            />
          </a>
          <div className='description'>
            <h1>{element.title || element.name}</h1>
            {element.adult && <h4>Adult Content</h4>}
            {element.runtime && element.runtime !== 0 ? (
              <p>Duration: {getDuration(element.runtime)}</p>
            ) : null}
            <h4>Release Date: {element.release_date || element.first_air_date}</h4>
            <h3>{element.tagline}</h3>
            <p>{element.overview}</p>
            {element.vote_average!=0 ? (
              <p>Rating: {Math.round(element.vote_average*100)/100}</p>
            ): null}
            <h4>Genres:</h4>
            <div className='style-button-container'>
              {element.genres?.map((genre, index) => (
                <button key={index} className='style-button'>{genre.name}</button>
              ))}
            </div>
            <h4>Original Language:</h4>
            <p>{element.original_language ? element.original_language.toUpperCase() : 'N/A'}</p>
            {element.created_by && element.created_by.length > 0 &&
            (
              <div>
                <h4>Created by:</h4>
                <div className='style-button-container'>
                  {element.created_by.map((person, index) => (
                    <button key={index} className='style-button'>{person.name}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {media_type === 'tv' && element.seasons && element.seasons.length > 0 && (
          <DragSeason
            url={"http://127.0.0.1:5252/api/TmdbData/seasonsDetails"}
            queryParams={`id=${id}&Language=${language}`}
            toggleButton={element.seasons.map(season => season.season_number.toString())} // Assuming `element.seasons` is an array of objects with `season_number`
          />
        )}
        <ActorsLayout
          actors={element.cast}
        />
        <DragPosters
            url={'http://127.0.0.1:5252/api/TmdbData/recommendation'}
            title="Recommendations"
            queryParams={`MediaType=${media_type}&id=${id}&Language=${language}`}
        />
      </div>
    </div>
  );
}
