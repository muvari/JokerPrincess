import React from 'react';
import "./WitsWagers.css";
import Bracket from './Bracket';
import PlayerComponent from './PlayerComponent';

class WitsWagersBoard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedBracket: undefined,
      selectedBracketValue: undefined,
    }

    this.selectBracket.bind(this);
  }

  selectBracket = (bracketId, value) => {
    this.setState({selectedBracket: bracketId, selectedBracketValue: value});
  }

  startNextRound = () => {
    this.props.moves.nextRound();
  }

  changeQuestion = () => {
    this.props.moves.changeQuestion();
  }

  componentDidMount() {
    if (!this.props.G.gameMetadata)
      this.props.moves.namePlayer(this.props.gameMetadata || this.getOfflineMetadata());
  }

  getOfflineMetadata() {
    return [
    {id: 0, name: "You"},
    {id: 1, name: "Bender"},
    {id: 2, name: "R2D2"},
    {id: 3, name: "Terminator"},
    {id: 4, name: "T3"},
    {id: 5, name: "T4"},
    {id: 6, name: "T5"},
    "Local"];
  }

  getInstructions() {
    if (this.props.ctx.phase === "guess") {
      return "Guess an answer without going over.";
    } else if (this.props.ctx.phase === "wager") {
      const wager = this.props.G.players[Number(this.props.playerID)].wager1 ? "2" : "1";
      if (this.state.selectedBracket) {
        return `Choose an amount to wager. (${wager}/2)`;
      } else {
        return `On the board, choose what answer you think is closest without going over, or 'Lower'. (${wager}/2)`;
      }
    } else if (this.props.ctx.phase === "result") {
      return "Start next round.";
    }
    return "";
  }

  render() {
    const otherPlayers = [];
    for (const player of this.props.G.players) {
      otherPlayers.push(<PlayerComponent
        player={player}        
        playerName={this.props.G.gameMetadata ? this.props.G.gameMetadata[player.id].name : player.id}
        key={`player-${player.id}`}
        userId={this.props.playerID}
        guessNumber={this.props.moves.guessNumber}
        wager1={this.props.moves.wager1}
        wager2={this.props.moves.wager2}
        phase={this.props.ctx.phase}
        selectedBracket={this.state.selectedBracket}
        selectedBracketValue={this.state.selectedBracketValue}
        selectBracket={this.selectBracket}
        G={this.props.G}
      />);
    }

    return (
      <div className="board-w">
        { this.props.ctx.gameover ? <h2>{this.props.ctx.gameover.message}</h2> : "" }
        {this.props.G.question ? <div style={{width: "700px"}}><h3>Q {this.props.G.round}/7: {this.props.G.question}</h3></div> : "" }
        {this.props.ctx.phase === "guess" ? <button type="button" onClick={this.changeQuestion.bind(this)} class="btn btn-link">Change question</button> : "" }
        {this.props.G.answer ? <h2>{this.props.G.answer}</h2> : "" }
        {this.props.G.answer && !this.props.ctx.gameover ? <button type="button" onClick={this.startNextRound.bind(this)} className="btn btn-primary" style={{margin: "8px"}}>Next Round</button> : "" }
        <div className="gameBoard">
          <Bracket o={6} odds="6 to 1" id="-4" guesses={[]} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} selectBracket={this.selectBracket} />
          <Bracket o={5} odds="5 to 1" id="-3" guesses={this.props.G.layout["-3"] || []} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} selectBracket={this.selectBracket}/>
          <Bracket o={4} odds="4 to 1" id="-2" guesses={this.props.G.layout["-2"] || []} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} selectBracket={this.selectBracket}/>
          <Bracket o={3} odds="3 to 1" id="-1" guesses={this.props.G.layout["-1"] || []} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} selectBracket={this.selectBracket}/>
          <Bracket o={2} odds="2 to 1" id="0" guesses={this.props.G.layout["0"] || []} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} selectBracket={this.selectBracket}/>
          <Bracket o={3} odds="3 to 1" id="1" guesses={this.props.G.layout["1"] || []} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} selectBracket={this.selectBracket}/>
          <Bracket o={4} odds="4 to 1" id="2" guesses={this.props.G.layout["2"] || []} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} selectBracket={this.selectBracket}/>
          <Bracket o={5} odds="5 to 1" id="3" guesses={this.props.G.layout["3"] || []} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} selectBracket={this.selectBracket}/>
        </div>
        <div className="others">{otherPlayers}</div>
        <div>Instructions: {this.getInstructions()}</div>
      </div>
    );
  }
}

export default WitsWagersBoard;