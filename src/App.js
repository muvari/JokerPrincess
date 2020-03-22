// import React from 'react';
// import logo from './logo.svg';
import './App.css';

import { Client } from 'boardgame.io/react';
// import { Local } from 'boardgame.io/multiplayer';
import { LoveLetter } from './LoveLetter';
import LoveLetterBoard from './LoveLetterBoard';

const App = Client({ 
  game: LoveLetter, 
  board: LoveLetterBoard,
  numPlayers: 4,
 });

export default App;
