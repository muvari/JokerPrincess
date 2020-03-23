export class Player {
  id = 0;
  wins = 0;
  card = undefined;
  newCard = undefined;
  discarded = [];
  eliminated = false;
  protected = false;

  constructor(id) {
    this.id = id;
  }
}