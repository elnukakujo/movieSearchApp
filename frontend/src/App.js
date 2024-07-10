import './assets/css/App.css';
import Home from './pages/Home';
import Details from './pages/Details';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:media_type/:id" element={<Details />} />
          </Routes>
      </div>
    </Router>
  );
}