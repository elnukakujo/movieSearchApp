import './assets/css/App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail" element={<Detail />} />
          </Routes>
      </div>
    </Router>
  );
}