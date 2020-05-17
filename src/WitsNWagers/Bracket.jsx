import React from 'react';

const classes = ["zero-w","one-w","two-w","three-w","four-w","five-w","six-w","seven-w","eight-w"];

class Bracket extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    }

    this.shouldHover = this.shouldHover.bind(this);
  }

  onClick() {
    if (this.props.ctx.phase !== "wager")
      return;

    if (this.props.o === 6) {
      this.props.selectBracket(this.props.id, "Lower");
      return;
    }
    if (this.props.guesses.length < 1)
      return;

    this.props.selectBracket(this.props.id, this.props.G.players[this.props.guesses[0]].guessValue);
  }

  shouldHover() {
    if (this.props.ctx.phase !== "wager")
      return "";
    if (this.props.o === 6)
      return "bracket-hover";

    if (this.props.guesses.length < 1)
      return "";
    return "bracket-hover";
  }

  render() {
    const guesses = [];
    for (const g of this.props.guesses) {
      guesses.push(<div className={`player-guess ${classes[this.props.G.players[g].id]}`}>{this.props.G.players[g].guessValue}</div>);      
    }

    const wagers = [];
    for (const p of this.props.G.players) {
      if (p.wager1 && p.wager1.bracket === this.props.id)
        wagers.push(<div className={`player-wager ${classes[p.id]}`}>${p.wager1.amount}</div>);
      if (p.wager2 && p.wager2.bracket === this.props.id)
        wagers.push(<div className={`player-wager ${classes[p.id]}`}>${p.wager2.amount}</div>);
    }
    
    return (
      <div className={`bracket ${this.shouldHover()} ${this.props.o === 6 ? "lower" : ""}`} onClick={this.onClick.bind(this)}>
        <div className="guesses">
          {this.props.ctx.phase === "wager" || this.props.ctx.phase === "result" ? 
          guesses
          : ""
          }
        </div>
        <div className="wagers">
        {this.props.ctx.phase === "wager" || this.props.ctx.phase === "result" ? 
          wagers
          : ""
          }
        </div>
        {this.props.o === 6 ? <span className="odds">Lower</span> : "" }
        <div className="odds">{this.props.odds}</div>
      </div>
    );
  }
}

export default Bracket;