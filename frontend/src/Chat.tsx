import React, { useState, useEffect, ChangeEvent, FormEvent, FC } from 'react';
import io, { Socket } from 'socket.io-client';
import { Form, Button, ListGroup } from 'react-bootstrap';

interface Message {
  username: string;
  message: string;
}

const Chat: FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', (data: Message) => {
        setMessages((prevMessages: Message[]) => [...prevMessages, data]);
      });
    }
  }, [socket]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (socket) {
      socket.emit('message', { username: 'User', message });
      setMessage('');
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  return (
    <div className="Chat">
      <h2>Chat</h2>

      <ListGroup>
        {messages.map(({ username, message }, index) => (
          <ListGroup.Item key={index}>
            <strong>{username}: </strong>
            {message}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="message">
          <Form.Control
            type="text"
            placeholder="Enter message"
            value={message}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Send
        </Button>
      </Form>
    </div>
  );
};

export default Chat;
