export class Card {
  constructor(id) {
    this.id = id;
    this.value = cardValuesById[id];
  }
}

export const eliminatePlayer= (G, ctx, player) => {
  G.eligible = G.eligible.filter((p) => p !== player.id);
  if (player.card && !player.discarded.some((d) => d.id === player.card.id))
    player.discarded.push(player.card);
  if (player.newCard && !player.discarded.some((d) => d.id === player.newCard.id))
    player.discarded.push(player.newCard);
  player.eliminated = true;
}

export const oneAction = (G, ctx, playData, otherCard) => {
}

export const twoAction = (G, ctx, playData, otherCard) => {
  const actionPlayer = G.players[playData.actionPlayerId];
  G.visibleCard = { id: ctx.currentPlayer, cardId: actionPlayer.card.id };
}

export const threeAction = (G, ctx, playData, otherCard) => {
  const player = G.players[ctx.currentPlayer];
  const actionPlayer = G.players[playData.actionPlayerId];

  if (!otherCard || !actionPlayer.card) return;

  if (otherCard.value > actionPlayer.card.value)
    eliminatePlayer(G, ctx, actionPlayer);
  else if (otherCard.value < actionPlayer.card.value)
    eliminatePlayer(G, ctx, player);
}

export const fourAction = (G, ctx) => {
  G.players[ctx.currentPlayer].protected = true;
}

export const fiveAction = (G, ctx, playData, otherCard) => {
}

export const sixAction = (G, ctx, playData, otherCard) => {
  const player = G.players[ctx.currentPlayer];
  const actionPlayer = G.players[playData.actionPlayerId];

  const cardCopy = Object.assign({}, otherCard);
  const actionPlayerCard = Object.assign({}, actionPlayer.card);
  actionPlayer.card = cardCopy;
  if (otherCard.id === player.card.id)
    player.card = actionPlayerCard;
  else
    player.newCard = actionPlayerCard;
}

export const sevenAction = (G, ctx, playData, otherCard) => {
  // DO nothing
}

export const eightAction = (G, ctx) => {
  eliminatePlayer(G, ctx, G.players[ctx.currentPlayer]);
}

export const cardValuesById = [1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8];
export const cardActions = [() => {}, oneAction, twoAction, threeAction, fourAction, fiveAction, sixAction, sevenAction, eightAction]