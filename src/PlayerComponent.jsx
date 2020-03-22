import React from 'react';
import CardComponent from './CardComponent';

class PlayerComponent extends React.Component {

  shouldHighlight(card) {
    const player = this.props.player;
    if (player.eliminated) 
      return false;
    const isCurrentPlayer = this.props.currentPlayer === player.id.toString();
    const bothCards = player.card && player.newCard;
    const otherCard = player.card.id === card.id ? player.newCard : player.card;

    if (!(isCurrentPlayer && bothCards)) 
      return false;

    if (otherCard.getCardValue() === 7 && (card.getCardValue() === 5 || card.getCardValue() === 6))
      return false;
    return true;      
  }

	render() {
    const player = this.props.player;
    const isCurrentPlayer = this.props.currentPlayer === player.id.toString();

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
            <div className={player.eliminated ? "elim" : ""}>Name: {player.id}</div>
            <div>Wins: {player.wins}/{this.props.requiredWins}</div>
          </div>
          <div>Hand</div>
          <div className="hand">
          {player.card ? (
            <CardComponent 
              card={player.card}
              moves={this.props.moves}
              hide={!isCurrentPlayer}
              highlight={this.shouldHighlight(player.card)}
              />) : "" }
            {player.newCard ? (
            <CardComponent 
              card={player.newCard}
              moves={this.props.moves}
              hide={!isCurrentPlayer}
              highlight={this.shouldHighlight(player.newCard)}
            />) : "" }
          </div>
          <div>Played Cards</div>
          <div className="hand">{discarded}</div>
        </div>
		)
	}
}

export default PlayerComponent;