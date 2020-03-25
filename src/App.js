import React from 'react';
import './App.css';

// import { Client } from 'boardgame.io/react';
// import { Local } from 'boardgame.io/multiplayer';
import { Lobby } from 'boardgame.io/react';
import { LoveLetter } from './LoveLetter';
import LoveLetterBoard from './LoveLetterBoard';

// const LoveLetterClient = Client({ 
//   game: LoveLetter, 
//   board: LoveLetterBoard, 
//   numPlayers: 2,
//   debug: true,
//   multiplayer: Local(),
//  });

 const App = () => (
  <div>
     <div>
          <h1 className="info-text">Love Letter</h1>
    </div>
    <Lobby
      gameServer={`http://${window.location.hostname}:8000`}
      lobbyServer={`http://${window.location.hostname}:8000`}
      gameComponents={[{ 
      game: LoveLetter, 
      board: LoveLetterBoard,
    }]}
  />;
  </div>
);

export default App;
