import './assets/css/App.css';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import EpisodeDetails from './pages/EpisodeDetails';
import NavBar from './components/NavBar';
import SearchDetails from './pages/SearchDetails';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div className="App">
          <NavBar />
          <div className='page-content'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:media_type/:id" element={<MovieDetails />} />
              <Route path="/tv/:serie_id/:season_number/:episode_number" element={<EpisodeDetails />} />
              <Route path="/search/:term" element={<SearchDetails />} />
            </Routes>
          </div>
      </div>
    </Router>
  );
}