import React from 'react';
import './App.css';
import PongCanvas from './PongCanvas';
import Chat from './Chat';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Multiplayer Pong</h1>
      </header>

      <main className="App-main">
        <div className="game-area">
          <PongCanvas />
        </div>

        <div className="chat-area">
          <Chat />
        </div>
      </main>

      <footer className="App-footer">
        <p>Created by rstride</p>
      </footer>
    </div>
  );
}

export default App;
