import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/components/Collection.css';

export default function Collection({ id, collectionId, language }){
    const [collection, setCollection] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isClick, setIsClick] = useState(false);
    const collectionRef=useRef(null);
    const fetchCollection = async () => {
        let fullUrl = new URL("http://127.0.0.1:5252/api/TmdbData/collection");
        fullUrl+=`?id=${collectionId}&Language=${language}`;
        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCollection(data);
    }
    useEffect(() => {
        fetchCollection();
    }, [id, collectionId, language]);

    const handleMouseDown = (event) => {
        setIsClick(true); // Assume it is a click until it moves
        setIsDragging(true);
        if (collectionRef.current) {
            setStartX(event.clientX - collectionRef.current.offsetLeft);
            setScrollLeft(collectionRef.current.scrollLeft);
        }
    };
    
    const handleMouseMove = (event) => {
        if (!isDragging) return;
        setIsClick(false); // Not a click if it moves
        if (collectionRef.current) {
            const x = event.clientX - collectionRef.current.offsetLeft;
            const walk = (x - startX) * 2; // Adjust the multiplier for faster scrolling
            collectionRef.current.scrollLeft = scrollLeft - walk;
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

    if (collection.length === 0 || !collection.parts) {
        return null;
    }

    return(
        <div className="section" id="collection">
            <div className="content">
                <div className="intro">
                    <h2>{collection.name}</h2>
                    <p>{collection.overview}</p>
                </div>
                <div
                    ref={collectionRef}
                    className={`collection ${isDragging ? 'dragging' : ''}`} 
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    {collection.parts.map((element, index) => (
                        <Link
                            to={`/${element.media_type}/${element.id}`}
                            key={index} 
                            className={`movie ${element.backdrop_path ? 'with-background' : ''}`}
                            style={element.backdrop_path ? { '--bg-image': `url(${element.backdrop_path})` } : {}}
                            draggable="false"
                        >
                            <div className='overlay'/>
                            <div className='poster-container'>
                                <img src={element.poster_path} alt={element.title} draggable="false"/>
                            </div>
                            <div className='description'>
                                <h4>{element.title||element.name}</h4>
                                <p>{element.overview}</p>
                                <p>Release Date: {element.release_date}</p>
                                {element.vote_average!=0 ? (
                                    <p>Rating: {Math.round(element.vote_average*100)/100}</p>
                                ): null}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}