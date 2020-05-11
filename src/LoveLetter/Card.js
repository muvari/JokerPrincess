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
  for (const p of player.cardIsKnownBy)
      removeKnownCard(G.players[p], player, player.card);
  G.lastAction += ` - Player ${G.gameMetadata[player.id].name} Eliminated!`;
}

export const oneAction = (G, ctx, playData) => {
  const actionPlayer = G.players[playData.actionPlayerId];
  G.lastAction += ` Guesses ${G.gameMetadata[actionPlayer.id].name} has '${playData.guessCardValue}'.`
  if (actionPlayer.card.value === playData.guessCardValue)
    eliminatePlayer(G, ctx, actionPlayer);
}

export const twoAction = (G, ctx, playData, otherCard) => {
  const actionPlayer = G.players[playData.actionPlayerId];
  G.lastAction += ` Looks at ${G.gameMetadata[actionPlayer.id].name}'s card`;
  G.visibleCard = { id: ctx.currentPlayer, cardId: actionPlayer.card.id };

  addKnownCard(G.players[ctx.currentPlayer], actionPlayer);
}

export const threeAction = (G, ctx, playData, otherCard) => {
  const player = G.players[ctx.currentPlayer];
  const actionPlayer = G.players[playData.actionPlayerId];

  if (!otherCard || !actionPlayer.card) return;
  
  G.lastAction += ` Compares cards with ${G.gameMetadata[actionPlayer.id].name}.`;
  if (otherCard.value > actionPlayer.card.value)
    eliminatePlayer(G, ctx, actionPlayer);
  else if (otherCard.value < actionPlayer.card.value)
    eliminatePlayer(G, ctx, player);
}

export const fourAction = (G, ctx) => {
  G.players[ctx.currentPlayer].protected = true;
  G.lastAction += ` ${G.gameMetadata[G.players[ctx.currentPlayer].id].name} is protected.`;
}

export const fiveAction = (G, ctx, playData, otherCard) => {
  const player = G.players[ctx.currentPlayer];
  const actionPlayer = G.players[playData.actionPlayerId];
  const card = (actionPlayer.id.toString() === ctx.currentPlayer) ? otherCard : actionPlayer.card;
  G.lastAction += ` Chooses to discard ${G.gameMetadata[actionPlayer.id].name}'s card.`;
  if (card.value === 8) {
    eliminatePlayer(G, ctx, actionPlayer);
    return;
  }
  actionPlayer.discarded.push(card);

  const newCard = G.deck.length > 0 ? G.deck.pop() : G.hiddenCard;
  if (actionPlayer.id.toString() === ctx.currentPlayer) {
    if (otherCard.id === player.card.id)
      player.card = newCard;
    else
      player.newCard = newCard;
  } else {
    actionPlayer.card = newCard;
  }
}

export const sixAction = (G, ctx, playData, otherCard) => {
  const player = G.players[ctx.currentPlayer];
  const actionPlayer = G.players[playData.actionPlayerId];

  G.lastAction += ` Swaps cards with ${G.gameMetadata[actionPlayer.id].name}.`;
  const cardCopy = Object.assign({}, otherCard);
  const actionPlayerCard = Object.assign({}, actionPlayer.card);
  actionPlayer.card = cardCopy;
  if (otherCard.id === player.card.id)
    player.card = actionPlayerCard;
  else
    player.newCard = actionPlayerCard;

  addKnownCard(player, actionPlayer);
  addKnownCard(actionPlayer, player);
}

export const sevenAction = (G, ctx, playData, otherCard) => {
  // Do nothing
}

export const eightAction = (G, ctx) => {
  eliminatePlayer(G, ctx, G.players[ctx.currentPlayer]);
}

export const addKnownCard = (player, otherPlayer) => {
  player.knownCards.push(otherPlayer);
  otherPlayer.cardIsKnownBy.push(player.id);
}

export const removeKnownCard = (player, otherPlayer) => {
  let config = Object.getOwnPropertyDescriptor(otherPlayer, 'cardIsKnownBy');
  if (config.configurable) {
    const i = otherPlayer.cardIsKnownBy.findIndex(x => x === player.id);
    if (i > -1) otherPlayer.cardIsKnownBy.splice(i, 1);
  }

  config = Object.getOwnPropertyDescriptor(player, 'knownCards');
  if (config.configurable) {
    const j = player.knownCards.findIndex(x => x === otherPlayer.id);
    if (j > -1) player.knownCards.splice(j, 1);
  }
}

export const cardValuesById = [1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8];
export const cardActions = [() => {}, oneAction, twoAction, threeAction, fourAction, fiveAction, sixAction, sevenAction, eightAction];