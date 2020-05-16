import React from 'react';

const classes = ["zero","one","two","three","four","five","six","seven","eight"];

class Bracket extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  onClick() {
    if (this.props.ctx.phase !== "wager")
      return;
    if (this.props.guesses.length < 1)
      return;

    this.props.selectBracket(this.props.id, this.props.G.players[this.props.guesses[0]].guessValue);
  }

  render() {
    const guesses = [];
    for (const g of this.props.guesses) {
      guesses.push(<div className={`player-guess ${classes[this.props.G.players[g].id]}`}>{this.props.G.players[g].guessValue}</div>);      
    }
    
    return (
      <div className="bracket" onClick={this.onClick.bind(this)}>
        <div className="guesses">
          {this.props.ctx.phase === "wager" ? 
          guesses
          : ""
          }
        </div>
        <div className="wagers"></div>
        <div className="odds">{this.props.odds}</div>
      </div>
    );
  }
}

export default Bracket;