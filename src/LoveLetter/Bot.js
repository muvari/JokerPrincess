import { removeKnownCard } from './Card';
import { MCTSBot } from 'boardgame.io/ai';

const cardSelection = (G, ctx) => {  
  const player = G.players[ctx.currentPlayer]; 
  let selection;

  if (!player.newCard)
    selection = 'card';

  // Has an 8
  if (!selection) {
    if (player.card.value === 8)
      selection = 'newCard';
    if (player.newCard.value === 8)
      selection = 'card';
  }

  // Has a 7
  if (!selection) {
    if (player.card.value === 7 && (player.newCard.value === 5 || player.newCard.value === 6))
      selection = 'card';
    if (player.newCard.value === 7 && (player.card.value === 5 || player.card.value === 6))
      selection = 'newCard'
  }

  // Has a 4, 5, 6
  if (!selection) {
    if (player.card.value === 4)
      selection = 'card';
    if (player.newCard.value === 4)
      selection = 'newCard';
  }

  // Has a 3 choose if > 4
  if (!selection) {
    if (player.card.value === 3 && player.newCard.value > 4)
      selection = 'card';
    if (player.newCard.value === 3 && player.newCard.value > 4)
      selection = 'newCard';
  }

  //If card is known by somebody, remove it
  if (!selection && player.cardIsKnownBy.length > 0 && player.card.value !== 1) {
    selection = 'card';
    for (const p of player.cardIsKnownBy)
      removeKnownCard(G.players[p], player, player.card);
  }

  // Has a 2
  if (!selection) {
    if (player.card.value === 2 && player.newCard.value === 1)
      selection = 'card';
    if (player.newCard.value === 2 && player.newCard.value === 1)
      selection = 'newCard';
  }

  if (!selection)
    selection = player.card.value > player.newCard.value ? 'newCard' : 'card';

  return selection === 'card' ? player.card : player.newCard;
}

const findEligiblePlayers = (G, ctx, card) => {
  const player = G.players[ctx.currentPlayer];
  const eligiblePlayers = [];
  for (const p of G.players) {
    if (p.id === player.id && card.value !== 5)
      continue;
    if (!p.eliminated && !p.protected)
      eligiblePlayers.push(p);
  }
  return eligiblePlayers;
}

const choosePlayer = (G, ctx, card) => {
  const player = G.players[ctx.currentPlayer];
  const eligiblePlayers = findEligiblePlayers(G, ctx, card);

  if (card.value === 1) {
    for (const k of player.knownCards) {
      const filtered = eligiblePlayers.filter((e) => e.id === k);
      if (filtered.length > 0)
        return filtered[0];
    }
  }

  const rdm = G.random.Die(eligiblePlayers.length);
  return eligiblePlayers[rdm - 1];
}

const remainingCards = (G) => {
  const cards = [2, 2, 3, 3, 4, 4, 5, 6, 7, 8];
  for (const d of G.deckDiscard) {
    const i = cards.findIndex(x => x === d.value);
    if (i > -1) cards.splice(i, 1);
  }

  for (const p of G.players) {
    for (const d of p.discarded) {
      const i = cards.findIndex(x => x === d.value);
      if (i > -1) cards.splice(i, 1);
    }
  }

  return cards;
}

const guessNumber = (G, ctx, otherPlayer) => {
  const player = G.players[ctx.currentPlayer];
  if (player.knownCards.indexOf(otherPlayer.id) > -1)
    return otherPlayer.card.value;

  const cards = remainingCards(G);
  if (cards.length < 1)
    return 8;

  const rdm = G.random.Die(cards.length);
  return cards[rdm - 1];
}

export class CustomBot extends MCTSBot {
  constructor(ai) {
    ai.iterations = 400000;
    ai.playoutDepth = 2000;
    super(ai);
  }
}

export const LoveLetterBot = {
  enumerate: (G, ctx) => {  
    if (ctx.phase === "reset")
      return  [{ move: 'nextRound', args: []}];
    const card = cardSelection(G, ctx);

    if (card.value === 4 || card.value === 8 || card.value === 7)
      return  [{ move: 'playCard', args: [{ id: card.id }]}];

    if (findEligiblePlayers(G, ctx, card).length === 0) 
      return  [{ move: 'playCard', args: [{ id: card.id, noOptions: true }]}];

    const chosenPlayer = choosePlayer(G, ctx, card);
    if (card.value !== 1)
      return  [{ move: 'playCard', args: [{ id: card.id, actionPlayerId: chosenPlayer.id }]}];

    const guess = guessNumber(G, ctx, chosenPlayer);
    return  [{ move: 'playCard', args: [{ id: card.id, actionPlayerId: chosenPlayer.id, guessCardValue: guess }]}];
  }
};