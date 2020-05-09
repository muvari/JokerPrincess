import React from 'react';
import './App.css';

// import { Client } from 'boardgame.io/react';
import { Lobby } from 'boardgame.io/react';
import { LoveLetter } from './LoveLetter/LoveLetter';
import LoveLetterBoard from './LoveLetter/LoveLetterBoard';
import { HelpButton } from './HelpButton';

// const LoveLetterClient = Client({ 
//   game: LoveLetter, 
//   board: LoveLetterBoard, 
//   numPlayers: 2,
//   debug: true,
//   multiplayer: false,
//  });

// const App = () => (
//   <div>
//      <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
//           <h1 className="info-text">Joker Princess</h1><HelpButton />
//     </div>
//     <LoveLetterClient playerID="0" />
//   </div>
// );

 const App = () => (
  <div>
     <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <h1 className="info-text">Joker Princess</h1><HelpButton />
    </div>
    <Lobby
      gameServer={`https://${window.location.hostname}:443`}
      lobbyServer={`https://${window.location.hostname}:443`}
      gameComponents={[{ 
      game: LoveLetter, 
      board: LoveLetterBoard,
    }]}
  />
  </div>
);

export default App;
