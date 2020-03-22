class Card {
  constructor(id) {
    this.id = id;
    this.number = this.getCardValue();
  }

  getCardValue() {
    return -1;
  }

  doAction() {

  }

  eliminatePlayer(G, ctx, player) {
    if (player.card)
      player.discarded.push(player.card);
    if (player.newCard)
      player.discarded.push(player.newCard);
    G.eligible = G.eligible.filter((p) => p !== player.id);
    player.eliminated = true;
    player.card = undefined;
    player.newCard = undefined;
  }
}

export class OneCard extends Card {
  getCardValue() {
    return 1;
  }
}

export class TwoCard extends Card {
  getCardValue() {
    return 2;
  }
}

export class ThreeCard extends Card {
  getCardValue() {
    return 3;
  }
}

export class FourCard extends Card {
  getCardValue() {
    return 4;
  }

  doAction(G, ctx) {
    G.players[ctx.currentPlayer].protected = true;
  }
}

export class FiveCard extends Card {
  getCardValue() {
    return 5;
  }
}

export class SixCard extends Card {
  getCardValue() {
    return 6;
  }
}

export class SevenCard extends Card {
  getCardValue() {
    return 7;
  }
}

export class EightCard extends Card {
  getCardValue() {
    return 8;
  }

  doAction(G, ctx) {
    this.eliminatePlayer(G, ctx, G.players[ctx.currentPlayer]);
  }
}