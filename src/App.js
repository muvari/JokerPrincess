import React from 'react';
import './App.css';

import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
// import { SocketIO } from 'boardgame.io/multiplayer';
import { LoveLetter } from './LoveLetter';
import LoveLetterBoard from './LoveLetterBoard';

const LoveLetterClient = Client({ 
  game: LoveLetter, 
  board: LoveLetterBoard,
  numPlayers: 2,
  debug: true,
  // multiplayer: SocketIO({ server: 'http://localhost:8000/' }),
  multiplayer: Local()
 });

 const App = () => (
  <div>
    <LoveLetterClient playerID="0" />
    <LoveLetterClient playerID="1" />
  </div>
);

export default App;
