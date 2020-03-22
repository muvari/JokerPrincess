export class Player {
  id = 0;
  wins = 0;
  card;
  newCard;
  discarded = [];

  constructor(id) {
    this.id = id;
  }
}