import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaPlay, FaPause } from 'react-icons/fa';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function PongCanvas() {
  const [ball, setBall] = useState({ x: 400, y: 300, dx: 5, dy: 5 });
  const [paddles, setPaddles] = useState({ left: 250, right: 250 });
  const [score, setScore] = useState({ left: 0, right: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        // Move the ball
        setBall((prevBall) => ({
          ...prevBall,
          x: prevBall.x + prevBall.dx,
          y: prevBall.y + prevBall.dy,
        }));

        // Check for collisions with walls and paddles
        if (ball.y <= 0 || ball.y >= 570) {
          setBall((prevBall) => ({ ...prevBall, dy: -prevBall.dy }));
          socket.emit('ball', ball);
        }
        if (ball.x <= 0) {
          setScore((prevScore) => ({ ...prevScore, right: prevScore.right + 1 }));
          setBall({ x: 400, y: 300, dx: 5, dy: 5 });
          socket.emit('score', score);
        }
        if (ball.x >= 800) {
          setScore((prevScore) => ({ ...prevScore, left: prevScore.left + 1 }));
          setBall({ x: 400, y: 300, dx: -5, dy: -5 });
          socket.emit('score', score);
        }
        if (ball.x <= 20 && ball.y >= paddles.left && ball.y <= paddles.left + 100) {
          setBall((prevBall) => ({ ...prevBall, dx: -prevBall.dx }));
          socket.emit('ball', ball);
        }
        if (ball.x >= 780 && ball.y >= paddles.right && ball.y <= paddles.right + 100) {
          setBall((prevBall) => ({ ...prevBall, dx: -prevBall.dx }));
          socket.emit('ball', ball);
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [isPlaying, ball, paddles, score]);

  useEffect(() => {
    socket.on('paddles', (data) => {
      setPaddles(data);
    });
    socket.on('ball', (data) => {
      setBall(data);
    });
    socket.on('score', (data) => {
      setScore(data);
    });
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'w' && paddles.left > 0) {
      setPaddles((prevPaddles) => ({ ...prevPaddles, left: prevPaddles.left - 10 }));
      socket.emit('paddles', paddles);
    }
    if (event.key === 's' && paddles.left < 500) {
      setPaddles((prevPaddles) => ({ ...prevPaddles, left: prevPaddles.left + 10 }));
      socket.emit('paddles', paddles);
    }
    if (event.key === 'ArrowUp' && paddles.right > 0) {
      setPaddles((prevPaddles) => ({ ...prevPaddles, right: prevPaddles.right - 10 }));
      socket.emit('paddles', paddles);
    }
    if (event.key === 'ArrowDown' && paddles.right < 500) {
      setPaddles((prevPaddles) => ({ ...prevPaddles, right: prevPaddles.right + 10 }));
      socket.emit('paddles', paddles);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  return (
    <div className="PongCanvas" tabIndex="0" onKeyDown={handleKeyDown}>
      <svg width="800" height="600">
        <rect x="0" y="0" width="800" height="600" fill="black" />
        <rect x="10" y={paddles.left} width="10" height="100" fill="white" />
        <rect x="780" y={paddles.right} width="10" height="100" fill="white" />
        <circle cx={ball.x} cy={ball.y} r="10" fill="white" />
      </svg>
      <Container>
        <Row>
          <Col xs={6}>
            <h2>Player 1: {score.left}</h2>
          </Col>
          <Col xs={6}>
            <h2>Player 2: {score.right}</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button variant="primary" onClick={handlePlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PongCanvas;