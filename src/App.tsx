import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes,NavLink } from 'react-router-dom';
import OneRentTool from './OneRentTool';
import HomePage from './HomePage';
import { useState, useEffect} from 'react';



const App: React.FC = () => {


  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };
  
  return (
    <div className="App">
      <header className="App-header">
        {/* Include your Navigation component here, if any */}
      </header>
      <button onClick={toggleTheme} className="toggle-theme">
        Toggle Theme
      </button>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage theme = {theme} />} />
          <Route path="/one-rent-tool" element={<OneRentTool />} />
          {/* Comment out the TwoRentTool Route until you create the component
          <Route path="/two-rent-tool" element={<Your TwoRentTool component />} /> */}
        </Routes>
      </Router>
    </div>
  );
  };

export default App;