import React from 'react';
import PlayerComponent from './PlayerComponent';

class LoveLetterBoard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedCard: undefined,
      showGuessModal: false,
    }

    this.playCard = this.playCard.bind(this);
  }

  playCard(card, actionPlayer) {
    // First click
    if (!this.state.selectedCard) {
      if (card.value === 4 || card.value === 8 || card.value === 7) {
        this.props.moves.playCard({id: card.id});
        return;
      }
      this.setState({selectedCard: card});
      return;
    }
    
    // Second click
    const selectedCardValue = this.state.selectedCard.value;
    if (selectedCardValue !== 1) {
      this.props.moves.playCard({id: this.state.selectedCard.id, actionPlayerId: actionPlayer.id });
      this.setState({selectedCard: undefined });
    }
  }

  getInstructions() {
    if (this.props.ctx.currentPlayer !== this.props.playerID) return "Wait...";
    if (!this.state.selectedCard) return "Select a card.";
    const selectedCardValue = this.state.selectedCard.value;
    if (selectedCardValue === 1)
      return "Select a card to guess."
    else if (selectedCardValue === 2)
      return "Select a card to view."
    else if (selectedCardValue === 3)
      return "Select a card to compare."
    else if (selectedCardValue === 5)
      return "Select a card to discard."
    else if (selectedCardValue === 6)
      return "Select a card to swap."
  }

  render() {
    const otherPlayers = [];
    for (const player of this.props.G.players) {
      if (player.id.toString() === this.props.playerID)
        continue;

      otherPlayers.push(<PlayerComponent
        player={player}
        requiredWins={this.props.G.requiredWins}
        currentPlayer={this.props.playerID}
        selectedCard={this.state.selectedCard}
        playCard={this.playCard}
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
            <div>Instructions: {this.getInstructions()}</div>
        </div>
        <div className="deck">

        </div>
        <PlayerComponent
          player={this.props.G.players[this.props.playerID]}
          moves={this.props.moves}
          requiredWins={this.props.G.requiredWins}
          currentPlayer={this.props.playerID}
          playCard={this.playCard}
          selectedCard={this.state.selectedCard}
        />
        <div className="others">{otherPlayers}</div>
      </div>
    );
  }
}

export default LoveLetterBoard;