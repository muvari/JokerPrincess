import React from 'react';
import CardComponent from './CardComponent';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

class PlayerComponent extends React.Component {

  shouldHighlight(card) {
    const player = this.props.player;
    if (player.eliminated || this.props.phase === "reset") 
      return false;
    const isCurrentPlayer = this.props.currentPlayer === player.id.toString();
    const bothCards = player.card && player.newCard;
    const otherCard = player.card.id === card.id ? player.newCard : player.card;

    // First selection
    if (!this.props.selectedCard) {
      if (!(isCurrentPlayer && bothCards)) 
        return false;

      if (otherCard.value === 7 && (card.value === 5 || card.value === 6))
        return false;
      return true;
    }
    const selectedCardValue = this.props.selectedCard.value;
    if (selectedCardValue === 1 || selectedCardValue === 2 || selectedCardValue === 3 || selectedCardValue === 5 || selectedCardValue === 6) {
      if (isCurrentPlayer && (selectedCardValue === 5 && this.props.selectedCard.id !== card.id)) return true;
      if (isCurrentPlayer || player.protected) return false;
      return true;
    }      
  }

  shouldHide(card) {
    if (this.props.phase === "reset") 
      return false;

    const player = this.props.player;
    const isCurrentPlayer = this.props.currentPlayer === player.id.toString();
    if (this.props.visibleCard && this.props.currentPlayer === this.props.visibleCard.id.toString() && this.props.visibleCard.cardId === card.id)
      return false;
    return !isCurrentPlayer;
  }

	render() {
    const player = this.props.player;
    const isCurrentTurn = this.props.currentTurn === player.id.toString();
    const discarded = [];
    for (const played of player.discarded) {
      discarded.push(
        <CardComponent 
          card={played}
          hide={false}
          />);
    }
    const stars = [];
    for (let i = 0; i < this.props.requiredWins; i++) {
      let star;
      if (i < player.wins)
        star = <i title="Wins" className="fas fa-star" />
      else
        star = <i title="Wins" className="far fa-star" />
      stars.push(star);
    }
		return (
      <div className="player" style={{backgroundColor: isCurrentTurn ? "#fff" : "#f8f8f8" }}>
          <div className="playerInfo">
          <div className={player.eliminated ? "elim" : ""}>Name: {this.props.playerName} {player.protected ? <i title="Protected" style={{color: "#5B9F49"}} className="fas fa-shield-alt" /> : ""}</div>
            <div>Wins: {stars}</div>
          </div>
          <div>Hand</div>
          <div className="hand">
          {player.card && !player.eliminated ? (
            <CardComponent 
              card={player.card}
              moves={this.props.moves}
              hide={this.shouldHide(player.card)}
              highlight={this.shouldHighlight(player.card)}
              playCard={this.props.playCard}
              player={player}
              />) : "" }
            {player.newCard && !player.eliminated ? (
            <CardComponent 
              card={player.newCard}
              moves={this.props.moves}
              hide={this.shouldHide(player.newCard)}
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