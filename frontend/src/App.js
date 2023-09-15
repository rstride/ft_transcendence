import React from 'react';
import './App.css';
import PongCanvas from './PongCanvas';
import Chat from './Chat';
import { Container, Row, Col } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h4>ft_transcendence</h4>
      </header>

      <main className="App-main">
        <Container fluid>
          <Row>
            <Col xs={12} md={4}>
              <div className="Chat-container">
                <Chat />
              </div>
            </Col>
            <Col xs={12} md={8}>
              <div className="PongCanvas-container">
                <PongCanvas />
              </div>
            </Col>
          </Row>
        </Container>
      </main>

      <footer className="App-footer">
        <p>Created by rstride, garen and a racist</p>
      </footer>
    </div>
  );
}

export default App;