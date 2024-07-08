import React, { useEffect } from 'react';
import '../assets/css/components/trending.css';
import { Link } from 'react-router-dom';

export default function DragMenu({url, title, id, queryParams}) {
    const [movies, setMovies] = React.useState([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [scrollLeft, setScrollLeft] = React.useState(0);
    const moviesRef = React.useRef(null);

    const fetchMovies = async () => {
        let fullUrl = new URL(url);
        if(queryParams){
            fullUrl += `?${queryParams}`;
        }
        try {
            const response = await fetch(fullUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMovies(data);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setMovies([]); // Set movies to empty array in case of error
        }
    };

    useEffect(() => {
        fetchMovies();
        
        const interval = setInterval(() => {
            fetchMovies(); // Fetch data every 5 seconds
        }, 5000);

        return () => clearInterval(interval);
    }, []);

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

    return (
        <div className="section" id={id}>
            <div className="content">
                <h2>{title}</h2>
                <div
                    ref={moviesRef}
                    className={`movies ${isDragging ? 'dragging' : ''}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    {movies.map(element => (
                        <div key={element.id} className='img-container'>
                            <img
                                src={element.poster_path} 
                                alt={element.title}
                                draggable="false"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}