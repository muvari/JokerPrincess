import React from 'react';
import CardComponent from './CardComponent';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

class PlayerComponent extends React.Component {

  shouldHighlight(card) {
    const player = this.props.player;
    if (player.eliminated) 
      return false;
    const isCurrentPlayer = this.props.currentPlayer === player.id.toString();
    const bothCards = player.card && player.newCard;
    const otherCard = player.card.id === card.id ? player.newCard : player.card;

    // First selection
    if (!this.props.selectedCard) {
      if (!(isCurrentPlayer && bothCards)) 
        return false;

      if (otherCard.getCardValue() === 7 && (card.getCardValue() === 5 || card.getCardValue() === 6))
        return false;
      return true;
    }
    const selectedCardValue = this.props.selectedCard.getCardValue();
    if (selectedCardValue === 1 || selectedCardValue === 2 || selectedCardValue === 3 || selectedCardValue === 5 || selectedCardValue === 6) {
      if (isCurrentPlayer && (selectedCardValue === 5 && this.props.selectedCard.id === card.id)) return true;
      if (isCurrentPlayer || player.protected) return false;
      return true;
    }      
  }

  shouldHide(card) {
    const player = this.props.player;
    const isCurrentPlayer = this.props.currentPlayer === player.id.toString();
    return !isCurrentPlayer;
  }

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
          <div className={player.eliminated ? "elim" : ""}>Name: {player.id} {player.protected ? <i title="Protected" style={{color: "#5B9F49"}} className="fas fa-shield-alt" /> : ""}</div>
            <div>Wins: {player.wins}/{this.props.requiredWins}</div>
          </div>
          <div>Hand</div>
          <div className="hand">
          {player.card ? (
            <CardComponent 
              card={player.card}
              moves={this.props.moves}
              hide={this.shouldHide(player.card)}
              highlight={this.shouldHighlight(player.card)}
              playCard={this.props.playCard}
              player={player}
              />) : "" }
            {player.newCard ? (
            <CardComponent 
              card={player.newCard}
              moves={this.props.moves}
              hide={this.shouldHide(player.card)}
              highlight={this.shouldHighlight(player.newCard)}
              playCard={this.props.playCard}
              player={player}
            />) : "" }
          </div>
          <div>Played Cards</div>
          <div className="hand">{discarded}</div>
        </div>
		)
	}
}

export default PlayerComponent;