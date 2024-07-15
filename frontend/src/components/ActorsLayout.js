import '../assets/css/components/ActorsLayout.css';
import React, { useState, useRef } from 'react';

export default function ActorsLayout({actors}) {
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const actorsRef = useRef(null);

    const handleMouseDown = (event) => {
        setIsDragging(true);
        if (actorsRef.current) {
          setStartX(event.clientX - actorsRef.current.offsetLeft);
          setScrollLeft(actorsRef.current.scrollLeft);
        }
    };

    const handleMouseMove = (event) => {
        if (!isDragging) return;
        if (actorsRef.current) {
          const x = event.clientX - actorsRef.current.offsetLeft;
          const walk = (x - startX) * 2; // Adjust the multiplier for faster scrolling
          actorsRef.current.scrollLeft = scrollLeft - walk;
        }
    };
    const handleMouseUp = () => {
        setIsDragging(false);
    };
  
    const handleMouseLeave = () => {
        setIsDragging(false);
    };
  
    if (!actors || actors.length === 0) {
        return null;
    }

    return (
        <div className="section" id="actors-layout">
            <div className="content">
                <h3>Actors</h3>
                <div
                    ref={actorsRef}
                    className={`actors ${isDragging ? 'dragging' : ''}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    {actors.map(actor => (
                        actor.profile_path!==null&&
                        <div key={actor.id} className="actor">
                            <div className="profile-container">
                                <img
                                    src={actor.profile_path}
                                    draggable="false"
                                />
                            </div>
                            <h4>{actor.name}</h4>
                            <p>{actor.character}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}