import React, { useState, useEffect } from 'react';
import './App.css';
import PongCanvas from './PongCanvas';
import Chat from './Chat';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';

function App() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<Main containerHeight={containerHeight} />} />
      </Routes>
    </Router>
  );
}

function Main({ containerHeight }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic here
    navigate('/login');
  };

  return (
    <div>
      <header className="App-header">
        <Container>
          <Row>
            <Col> 
              <h4>ft_transcendence</h4>
            </Col>
            <Col>
              <button onClick={handleLogout}>Logout</button>
            </Col>
          </Row>
        </Container>
      </header>

      <main className="App-main">
        <Container fluid>
          <Row>
            {/* Chat Module */}
            <Col xs={12} sm={6} md={4}>
              <div className="Chat-container" style={{ height: containerHeight }}>
                <Chat />
              </div>
            </Col>
            {/* Game Module */}
            <Col xs={12} sm={6} md={8}>
              <div className="PongCanvas-container" style={{ height: containerHeight }}>
                <PongCanvas />
              </div>
            </Col>
          </Row>
        </Container>
      </main>

      <footer className="App-footer">
        <Container>
          <Row>
            <Col>
              <p>Created by rstride, garen and veigar</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

export default App;
