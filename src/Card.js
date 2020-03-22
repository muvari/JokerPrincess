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
}