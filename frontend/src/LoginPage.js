import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // New import
import './App.css';

function LoginPage({ containerHeight }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Replaced useHistory

  const handleLogin = () => {
    navigate('/main'); // Replaced history.push
  };

  return (
    <div>
      <header className="App-header">
        <Container>
          <Row>
            <Col>
              <h4>ft_transcendence</h4>
            </Col>
          </Row>
        </Container>
      </header>

      <main className="App-main">
        <Container style={{ height: containerHeight }}>
          <Row className="justify-content-md-center">
            <Col xs={12} md={6}>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <Button variant="primary" type="submit" onClick={handleLogin}>
                  Login
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </main>

      <footer className="App-footer">
        <Container>
          <Row>
            <Col>
              <p>Created by rstride, garen and a veigar</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

export default LoginPage;