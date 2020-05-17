import React from 'react';
import './App.css';

import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { Lobby } from 'boardgame.io/react';
import { LoveLetter } from './LoveLetter/LoveLetter';
import LoveLetterBoard from './LoveLetter/LoveLetterBoard';
import { WitsWagers } from './WitsNWagers/WitsWagers';
import WitsWagersBoard from './WitsNWagers/WitsWagersBoard';
import { HelpButton } from './HelpButton';
import { CustomBot } from './LoveLetter/Bot';

const LoveLetterLocalClient = Client({ 
  game: LoveLetter, 
  board: LoveLetterBoard, 
  numPlayers: 4,
  debug: false,
  multiplayer: Local({ bots: {
    '1': CustomBot, 
    '2': CustomBot, 
    '3': CustomBot
  } }),
 });

 const WitsWagersLocalClient = Client({ 
  game: WitsWagers, 
  board: WitsWagersBoard, 
  numPlayers: 2,
  debug: true,
  multiplayer: Local(),
 });
 
const App = () => (
  <div>
     <div className="title">
          <h1 className="info-text">Joker Princess</h1><HelpButton />
    </div>
    { window.location.search === "?loveletter" ? 
      <LoveLetterLocalClient playerID="0" /> :
      <React.Fragment>
        <div style={{margin: "16px"}}><strong>Multiplayer Lobby</strong></div>
        <Lobby
        gameServer={`https://${window.location.hostname}:443`}
        lobbyServer={`https://${window.location.hostname}:443`}
        gameComponents={[
          { 
          game: LoveLetter, 
          board: LoveLetterBoard,
          },
          { 
          game: WitsWagers, 
          board: WitsWagersBoard,
          }]}
        />        
        <div className="single-player"><a href="?loveletter" className="btn btn-secondary">Play Love Letter Singleplayer</a></div>
    </React.Fragment>
    }
  </div>
);

export default App;
