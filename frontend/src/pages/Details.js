import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../assets/css/pages/details.css'

export default function Details() {
    const { media_type, id } = useParams(); // Get movie_id from route parameter
    const { search } = useLocation(); // Get query string
    const queryParams = new URLSearchParams(search);
    const language = queryParams.get('language') || 'en'; // Default to 'en' if language not specifie
    const [element, setElement] = useState({});

    const fetchMovies= async () => {
        let fullUrl = new URL(`http://127.0.0.1:5252/api/TmdbData/search?MediaType=${media_type}&id=${id}&Language=${language}`);
        try {
            const response = await fetch(fullUrl);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setElement(data);
          } catch (error) {
            console.error('Error fetching movies:', error);
            setElement([]); // Set movies to empty array in case of error
          }
    };

    useEffect(() => {
        fetchMovies();
        const interval = setInterval(fetchMovies, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className='section' id='details'>
          <div className='content'>
            <div className='img-container'>
              <img
                src={element.backdrop_path}
                alt={"Background image of "+element.original_title||element.original_name}
              />
            </div>
            <h2>{element.title||element.name}</h2>
            {element.adult ? <h4>Adult Content</h4> : null}
            <h4>Release Date: {element.release_date||element.first_air_date}</h4>
            <h3>{element.tagline}</h3>
            <p>{element.overview}</p>
            <h4>Genres:</h4>
            <ul>
              {element.genres?.map((genre, index) => (
                <li key={index}>{genre.name}</li>
              ))}
            </ul>
            <h4>Original Language:</h4>
            <p>{element.original_language ? element.original_language.toUpperCase() : 'N/A'}</p>
            <h4>Produced in:</h4>
            <ul>
              {element.production_countries?.map((country, index) => (
                <li key={index}>{country.name}</li>
              ))}
            </ul>
            <a href={element.homepage} target='_blank'>See the home website</a>
          </div>
        </div>
    );
}