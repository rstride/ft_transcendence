import React, { useState, useEffect, FunctionComponent } from 'react';
import './App.css';
import PongCanvas from './PongCanvas'; // Make sure this is also converted to TSX
import Chat from './Chat'; // Make sure this is also converted to TSX
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage'; // Make sure this is also converted to TSX
import context from 'react-bootstrap/esm/AccordionContext';

interface MainProps {
  containerHeight: string;
}

const App: FunctionComponent = () => {
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerHeight = windowHeight < 768 ? 'auto' : `calc(${windowHeight}px - 56px)`;

  return (
    <Router>
      <Routes>
        <Route index element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage containerHeight={containerHeight}/>} />
        <Route path="/main" element={<Main containerHeight={containerHeight} />} />
      </Routes>
    </Router>
  );
};

const Main: FunctionComponent<MainProps> = ({ containerHeight }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic here
    navigate('/login');
  };

  return (
    <div>
      {/* ...existing JSX code */}
    </div>
  );
};

export default App;

