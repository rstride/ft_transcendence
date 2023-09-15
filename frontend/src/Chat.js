import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Form, Button, ListGroup } from 'react-bootstrap';

function Chat() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }
  }, [socket]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (socket) {
      socket.emit('message', { username: 'User', message });
      setMessage('');
    }
  };

  return (
    <div className="Chat">
      <h2>Chat</h2>

      <ListGroup>
        {messages.map((message, index) => (
          <ListGroup.Item key={index}>
            <strong>{message.username}: </strong>
            {message.message}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="message">
          <Form.Control
            type="text"
            placeholder="Enter message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Send
        </Button>
      </Form>
    </div>
  );
}

export default Chat;