import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MovieSearchAppLogo from '../assets/img/movieSearchAppLogo.jpg';
import '../assets/css/components/NavBar.css';
import SearchBar from './SearchBar';

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
                    <div className='logo-container'>
                        <img
                            src={MovieSearchAppLogo}
                        />
                    </div>
                </Link>
                <Link to='/'>
                    <h1>NoeFlix</h1>
                </Link>
                <SearchBar onSearch={handleSearch} />
            </div>
        </div>
    );
}