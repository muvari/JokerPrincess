import React from 'react';
import "./WitsWagers.css";
import Bracket from './Bracket';
import PlayerComponent from './PlayerComponent';

class WitsWagersBoard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedBracket: undefined
    }

    this.selectBracket.bind(this);
  }

  selectBracket = (bracketId) => {
    this.setState({selectedBracket: bracketId});
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
        selectBracket={this.selectBracket}
      />);
    }

    return (
      <div className="board">
        <h3>How many are there?</h3>
        <div className="gameBoard">
          <div className="lower">6 in one</div>
          <Bracket o={5} odds="5 to 1" id="-3" guesses={this.props.G.layout["-3"] || []} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} selectBracket={this.selectBracket}/>
          <Bracket o={4} odds="4 to 1" id="-2" guesses={this.props.G.layout["-2"] || []} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} selectBracket={this.selectBracket}/>
          <Bracket o={3} odds="3 to 1" id="-1" guesses={this.props.G.layout["-1"] || []} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} selectBracket={this.selectBracket}/>
          <Bracket o={2} odds="2 to 1" id="0" guesses={this.props.G.layout["0"] || []} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} selectBracket={this.selectBracket}/>
          <Bracket o={3} odds="3 to 1" id="1" guesses={this.props.G.layout["1"] || []} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} selectBracket={this.selectBracket}/>
          <Bracket o={4} odds="4 to 1" id="2" guesses={this.props.G.layout["2"] || []} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} selectBracket={this.selectBracket}/>
          <Bracket o={5} odds="5 to 1" id="3" guesses={this.props.G.layout["3"] || []} G={this.props.G} ctx={this.props.ctx} moves={this.props.moves} selectBracket={this.selectBracket}/>
        </div>
        <div className="others">{otherPlayers}</div>
      </div>
    );
  }
}

export default WitsWagersBoard;