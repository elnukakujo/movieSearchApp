import './assets/css/App.css';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:id" component={MovieDetails} />
          </Routes>
      </div>
    </Router>
  );
}