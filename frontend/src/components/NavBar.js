import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../assets/css/components/NavBar.css';
import SearchBar from './SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';

export default function NavBar(){
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (term) => {
        const encodedTerm = encodeURIComponent(term);
        console.log('Encoded Term:', encodedTerm);
        setSearchTerm(term);
        if (term.length > 0) {
            navigate(`/search/${encodedTerm}`);
        } else {
            navigate(`/`);
        }
    };
    useEffect(() => {
        const pathParts = location.pathname.split('/');
        if (pathParts[1] === 'search' && pathParts.length > 2) {
            setSearchTerm(decodeURIComponent(pathParts[2]));
        } else {
            setSearchTerm(''); // Clear search term if not on search page
        }
    }, [location.pathname]);

    return(
        <div className="navbar">
            <div className='content'>
                <Link to='/'>
                    <FontAwesomeIcon icon={faFilm} id='icon'/>
                </Link>
                <Link to='/'>
                    <h1>NoeFlix</h1>
                </Link>
                <SearchBar 
                    value={searchTerm}
                    onSearch={handleSearch}
                />
            </div>
        </div>
    );
}