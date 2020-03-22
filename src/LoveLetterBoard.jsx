import React from 'react';
import PlayerComponent from './PlayerComponent';

class LoveLetterBoard extends React.Component {
  render() {

    const otherPlayers = [];
    for (const player of this.props.G.players) {
      if (player.id.toString() === this.props.ctx.currentPlayer)
        continue;

      otherPlayers.push(<PlayerComponent
        player={player}
        requiredWins={this.props.G.requiredWins}
        currentPlayer={this.props.ctx.currentPlayer}
      />);
    }

    return (
      <div className="board">
        <div>
          <h1 className="info-text">Love Letter</h1>
        </div>
        <div className="gameInfo">
            <div>Round: {this.props.G.round}</div>
            <div>Turn: {this.props.ctx.currentPlayer}</div>
        </div>
        <div className="deck">

        </div>
        <PlayerComponent
          player={this.props.G.players[this.props.ctx.currentPlayer]}
          moves={this.props.moves}
          requiredWins={this.props.G.requiredWins}
          currentPlayer={this.props.ctx.currentPlayer}
        />
        <div className="others">{otherPlayers}</div>
      </div>
    );
  }
}

export default LoveLetterBoard;