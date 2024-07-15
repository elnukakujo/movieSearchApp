import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/components/NavBar.css';
import SearchBar from './SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';

export default function NavBar(){
    const navigate = useNavigate();

    const handleSearch = (term) => {
        if (term.length > 0) {
            navigate(`/search/${term}`);
        }
    };

    return(
        <div className="navbar">
            <div className='content'>
                <Link to='/'>
                    <FontAwesomeIcon icon={faFilm} id='icon'/>
                </Link>
                <Link to='/'>
                    <h1>NoeFlix</h1>
                </Link>
                <SearchBar onSearch={handleSearch} />
            </div>
        </div>
    );
}