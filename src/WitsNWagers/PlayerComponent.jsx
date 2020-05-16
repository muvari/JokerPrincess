import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const classes = ["zero","one","two","three","four","five","six","seven","eight"];

class PlayerComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      guessAmount: undefined,
      wager1Amount: 1,
      wager2Amount: 1
    }
  }

  onGuessInput(event) {
    this.setState({guessAmount: event.target.value});
  }

  onGuessSubmit() {
    this.props.guessNumber({userId: this.props.userId, guessValue: Number(this.state.guessAmount)});
  }

  onSliderChange(value) {
    if (this.props.player.wager1)
      this.setState({wager2Amount: value});
    else
      this.setState({wager1Amount: value});
  }

  onWagerInput(event) {
    const maxValue = this.props.player.wager1 ? this.props.player.score - this.props.player.wager1.amount : this.props.player.score + 1;
    const value = Math.min(Math.max(1, event.target.value), maxValue);
    if (this.props.player.wager1)
      this.setState({wager2Amount: value});
    else
      this.setState({wager1Amount: value});
  }

  onWagerSubmit() {
    if (this.props.player.wager1)
      this.props.wager2({userId: this.props.userId, amount: this.state.wager2Amount, bracket: this.props.selectedBracket, value: this.props.selectedBracketValue});
    else 
      this.props.wager1({userId: this.props.userId, amount: this.state.wager1Amount, bracket: this.props.selectedBracket, value: this.props.selectedBracketValue});
    this.props.selectBracket(undefined);
  }

  render() {

    let playerView = "";
    if (this.props.phase === "wager" && this.props.selectedBracket) {
      const maxValue = this.props.player.wager1 ? this.props.player.score - this.props.player.wager1.amount + 2: this.props.player.score + 1;
      playerView = (this.props.player.id.toString() === this.props.userId) ? 
      (<React.Fragment>
        <div>{`Wagering on '${this.props.selectedBracketValue}'`}</div>
        <Slider min={1} max={maxValue} step={1} defaultValue={1}
          onChange={this.onSliderChange.bind(this)}/>
        <Form.Control disabled={this.props.player.wager1 && this.props.player.wager2} 
          onInput={this.onWagerInput.bind(this)}  
          size="sm" type="number" 
          value={this.props.player.wager1 ? this.state.wager2Amount :  this.state.wager1Amount}/> 
        <Button disabled={this.props.player.wager1 && this.props.player.wager2} onClick={this.onWagerSubmit.bind(this)} style={{margin: "8px"}} variant="dark" type="submit">
            {`Wager ${this.props.player.wager1 ? "#2": "#1"}`}
        </Button> 
      </React.Fragment>)
      : 
        this.props.player.wager1 && this.props.player.wager2 ? "Submitted" : "Wagering...";
    } else if (this.props.phase === "wager" && !this.props.selectedBracket) {
      playerView = (this.props.player.id.toString() === this.props.userId) ? "" : this.props.player.wager1 && this.props.player.wager2 ? "Submitted" : "Wagering...";
    } else if (this.props.phase === "guess") {
      playerView = (this.props.player.id.toString() === this.props.userId) ? 
        (<React.Fragment>
          <Form.Control disabled={this.props.player.guessValue} onInput={this.onGuessInput.bind(this)} size="lg" type="number" placeholder="Enter number" /> 
          <Button disabled={!this.state.guessAmount || this.props.player.guessValue} style={{margin: "8px"}} variant="dark" type="submit" onClick={this.onGuessSubmit.bind(this)}>
            Guess
          </Button> 
        </React.Fragment>)
        : 
        this.props.player.guessValue ? "Submitted" : "Guessing...";
    } else if (this.props.phase === "result") {
      const pR = this.props.G.results[this.props.player.id];
      playerView = (<div><div>{`Guess: +$${pR.guess}`}</div><div>{`Wager 1: $${pR.wager1}`}</div><div>{`Wager 2: $${pR.wager2}`}</div><div>{`Total: $${pR.guess + pR.wager1 + pR.wager2}`}</div></div>);
    }
    
    return (
      <div className={`player ${classes[this.props.player.id]}`}>
        <div className="playerInfo">
          <div>Name: {this.props.playerName}</div>
            <div><span className="score">${this.props.player.score}</span></div>
          </div>
          <div style={{margin: "8px"}}>
            {playerView}
          </div>
      </div>
    );
  }
}

export default PlayerComponent;