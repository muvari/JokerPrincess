import React from 'react';
import PlayerComponent from './PlayerComponent';
import CardComponent from './CardComponent';

class LoveLetterBoard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedCard: undefined,
      guessCardValue: undefined,
      showGuessModal: false,
      actionPlayer: undefined,
    }

    this.playCard = this.playCard.bind(this);
    this.startNextRound = this.startNextRound.bind(this);
  }

  componentDidMount() {
    if (!this.props.G.gameMetadata)
      this.props.moves.namePlayer(this.props.gameMetadata);
  }

  playCard(card, actionPlayer) {
    // First click
    if (!this.state.selectedCard) {
      this.setState({selectedCard: card}, () => {
        const numOptions = document.getElementsByClassName("highlight").length;
        if (card.value === 4 || card.value === 8 || card.value === 7) {
          this.props.moves.playCard({id: card.id });        
          this.setState({selectedCard: undefined});
          return;
        } else if (numOptions === 0) {
          this.props.moves.playCard({id: card.id, noOptions: true });        
          this.setState({selectedCard: undefined});
          return;
        }
      });
      return;
    }
    
    // Second click
    const selectedCardValue = this.state.selectedCard.value;
    if (selectedCardValue !== 1) {
      this.props.moves.playCard({id: this.state.selectedCard.id, actionPlayerId: actionPlayer.id });
      this.setState({selectedCard: undefined });
    } else if (!this.state.showGuessModal) {
      this.setState({showGuessModal: true, actionPlayer: actionPlayer });
    } else { // Third click?
      this.props.moves.playCard({id: this.state.selectedCard.id, actionPlayerId: this.state.actionPlayer.id, guessCardValue: card.value });
      this.setState({showGuessModal: false, selectedCard: undefined, actionPlayer: undefined });
    }
  }

  startNextRound() {
    this.props.moves.nextRound();
  }

  getInstructions() {
    if (this.props.ctx.currentPlayer !== this.props.playerID) return "Wait for your turn...";
    if (!this.state.selectedCard) return "Select a card.";
    const selectedCardValue = this.state.selectedCard.value;
    if (selectedCardValue === 1) {
      if (this.state.showGuessModal)
        return "Select a value to guess"
      return "Select a card to guess."
    }
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
        playerName={this.props.G.gameMetadata ? this.props.G.gameMetadata[player.id].name : player.id}
        requiredWins={this.props.G.requiredWins}
        currentPlayer={this.props.playerID}
        currentTurn={this.props.ctx.currentPlayer}
        selectedCard={this.state.selectedCard}
        playCard={this.playCard}
        visibleCard={this.props.G.visibleCard}
        phase={this.props.ctx.phase}
      />);
    }

    const guesses = [];
    if (this.state.showGuessModal) {
      for (let i = 2; i <= 8; i++) {
        guesses.push(<CardComponent 
                  card={{id: `g-${i}`, value: i}}
                  hide={false}
                  highlight={true}
                  playCard={this.playCard}
                  />)
        }
    }

    return (
      <div className="board">
        <div className="gameInfo">
          { this.props.ctx.gameover ? <div><h2>{this.props.ctx.gameover.message}</h2></div>: "" }
            <div style={{width: "500px"}}><b>{this.props.G.lastAction}</b></div>
            <div>Round: {this.props.G.round}</div>
            <div>Turn: {this.props.G.gameMetadata ? this.props.G.gameMetadata[this.props.ctx.currentPlayer].name : this.props.ctx.currentPlayer}</div>
            <div>Deck: {this.props.G.deck.length} cards left</div>
            { this.props.ctx.phase === "reset" ? <div><button type="button" disabled={this.props.playerID !== this.props.ctx.currentPlayer} onClick={this.startNextRound} class="btn btn-primary">Next Round</button></div>: "" }
            { this.props.ctx.numPlayers === 2 && this.props.G.deckDiscard.length === 3 ? 
            <React.Fragment>
              <b>Discarded</b>
              <div className="player" style={{ flexDirection: "row", justifyContent: "space-between"}}>
                <CardComponent 
                    card={this.props.G.deckDiscard[0]}
                    hide={false}
                    highlight={false}
                    />
                  <CardComponent 
                    card={this.props.G.deckDiscard[1]}
                    hide={false}
                    highlight={false}
                    />
                  <CardComponent 
                    card={this.props.G.deckDiscard[2]}
                    hide={false}
                    highlight={false}
                    />
              </div>
            </React.Fragment> : "" }
        </div>
        <div>Opponents</div>
        <div className="others">{otherPlayers}</div>
        <PlayerComponent
          player={this.props.G.players[this.props.playerID]}
          playerName={this.props.G.gameMetadata ? this.props.G.gameMetadata[this.props.playerID].name : this.props.playerID}
          moves={this.props.moves}
          requiredWins={this.props.G.requiredWins}
          currentPlayer={this.props.playerID}
          playCard={this.playCard}
          selectedCard={this.state.selectedCard}
          currentTurn={this.props.ctx.currentPlayer}
          phase={this.props.ctx.phase}
        />
        <div>Instructions: {this.getInstructions()}</div>
        {this.state.showGuessModal ? 
        <div className="player" style={{ flexDirection: "row", justifyContent: "space-between"}}>
          {guesses}
        </div> : ''  }
      </div>
    );
  }
}

export default LoveLetterBoard;