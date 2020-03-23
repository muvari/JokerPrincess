import React from 'react';

const classes = ["zero","one","two","three","four","five","six","seven","eight"];

class CardComponent extends React.Component {

  onClick = () => {
    window.navigator.vibrate(20);
    if (this.props.playCard && this.props.highlight)
      this.props.playCard(this.props.card, this.props.player);
  }

	render() {
		return (
      <button key={this.props.id} 
        type="button"
        className={`square ${this.props.hide ? classes[0] : classes[this.props.card.value]} ${this.props.highlight ? "highlight": ""}`}
        onClick={this.onClick}>
        {this.props.hide ? "LL" : this.props.card.value}
      </button>
		)
	}
}

export default CardComponent;