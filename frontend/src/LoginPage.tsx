import React, { useState, ChangeEvent, FC } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './App.css';

interface LoginPageProps {
  containerHeight: string;
}

const LoginPage: FC<LoginPageProps> = ({ containerHeight }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = (): void => {
    navigate('/main');
  };

  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setter(event.target.value);
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
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => handleChange(setUsername, e)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => handleChange(setPassword, e)}
                  />
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
              <p>Created by rstride, garen, and a veigar</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default LoginPage;
