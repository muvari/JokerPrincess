export class Player {
  id = 0;
  wins = 0;
  card;
  newCard;
  discarded = [];
  eliminated = false;
  protected = false;

  constructor(id) {
    this.id = id;
  }
}