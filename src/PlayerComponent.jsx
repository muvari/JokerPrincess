import React from 'react';
import CardComponent from './CardComponent';

class PlayerComponent extends React.Component {

	render() {
    const player = this.props.player;

    const discarded = [];
    for (const played of player.discarded) {
      discarded.push(
        <CardComponent 
          card={played}
          hide={false}
          />);
    }
		return (
      <div className="player">
          <div className="playerInfo">
            <div>Name: {player.id}</div>
            <div>Wins: {player.wins}/{this.props.requiredWins}</div>
          </div>
          <div>Hand</div>
          <div className="hand">
          {player.card ? (
            <CardComponent 
              card={player.card}
              moves={this.props.moves}
              hide={this.props.currentPlayer !== player.id.toString()}
              />) : "" }
            {player.newCard ? (
            <CardComponent 
              card={player.newCard}
              moves={this.props.moves}
              hide={this.props.currentPlayer !== player.id.toString()}
            />) : "" }
          </div>
          <div>Played Cards</div>
          <div className="hand">{discarded}</div>
        </div>
		)
	}
}

export default PlayerComponent;