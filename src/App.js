import React from 'react';
import './App.css';

import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { LoveLetter } from './LoveLetter';
import LoveLetterBoard from './LoveLetterBoard';

const LoveLetterClient = Client({ 
  game: LoveLetter, 
  board: LoveLetterBoard,
  numPlayers: 3,
  debug: true,
  multiplayer: Local()
 });

 const App = () => (
  <div>
    <LoveLetterClient playerID="0" />
    <LoveLetterClient playerID="1" />
    <LoveLetterClient playerID="2" />
  </div>
);

export default App;
