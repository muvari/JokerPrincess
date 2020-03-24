import { Player } from './Player';
import * as Card from './Card';

const Deck = () => { return Array(16).fill().map((_val, i) => (new Card.Card(i))) };

const drawCard = (G, ctx) => {
  const player = G.players[ctx.currentPlayer];
  if (G.deck.length > 0)
    player.newCard = G.deck.pop();
}

const playCard = (G, ctx, playData) => {  
  // if (typeof window !== 'undefined') return;
  const player = G.players[ctx.currentPlayer];
  const isOldCard = player.card && player.card.id === playData.id;
  const selectedCard = isOldCard ? player.card : player.newCard;
  const otherCard = !isOldCard ? player.card : player.newCard;
  G.visibleCard = undefined;

  // Run card action
  if (!playData.noOptions)
    Card.cardActions[Card.cardValuesById[playData.id]](G, ctx, playData, otherCard);
  
  if (!player.eliminated) {  
    if (selectedCard)
      player.discarded.push(selectedCard);
    if (isOldCard)
      player.card = player.newCard; 
  } 
  player.newCard = undefined;
  ctx.events.endTurn();
}

export const LoveLetter = {
  setup: (ctx) => ({
    round: 1,
    requiredWins: parseInt(13 / ctx.numPlayers) + 1,
    players: Array(ctx.numPlayers).fill().map((_val, i) => (Player(i))),
    deck: Deck(),
    hiddenCard: undefined,
    eligible: [],
    lastWin: 0,
    history: [],
    lastAction: "Round 1 Begins",
    visibleCard: undefined,
    random: ctx.random,
  }),

  playerView: (G, ctx, playerID) => { 
    return G;
  },

  moves: {
    playCard,
  },

  phases: {
    round: {
      moves: { playCard },
      start: true,
      next: "round",
      onBegin: (G, ctx) => {
        G.eligible = Array.from(Array(ctx.numPlayers).keys());
        G.deck = Deck();
        G.deck = G.random.Shuffle(G.deck);
        G.hiddenCard = G.deck.pop();
        for (const player of G.players) {
          player.card = G.deck.pop();
          player.newCard = undefined;
          player.discarded = [];
          player.eliminated = false;
          player.protected = false;
        }
      },
      onEnd: (G, ctx) => {
        G.round += 1;
        if (G.eligible.length === 1) {
          G.lastWin = G.players[G.eligible[0]].id;
          G.players[G.eligible[0]].wins += 1;
        } else if (G.deck.length === 0) {
          let winners = [];
          let value = -1;
          for (let i = 0; i < G.players.length; i++) {
            if (G.players[i].eliminated) 
              continue;

            if (G.players[i].card.value > value) {
              value = G.players[i].card.value;
              winners = [G.players[i]];
            } else if (G.players[i].card.value > value) {
              winners.push(G.players[i]);
            }
          }

          if (winners.length === 1) {
            G.lastWin = winners[0].id;
            winners[0].wins += 1;
          } else {
            // Calculate discarded points
            let doubleWinner;
            let highestSum = -1;
            for (const p of winners) {
              const sum = p.discarded.reduce((acc, card) => (acc + card.value));
              if (sum > highestSum) {
                highestSum = sum;
                doubleWinner = p;
              }
            }

            G.lastWin = doubleWinner;
            doubleWinner.wins += 1;
          }

        }
        G.lastAction = `${G.lastWin} Wins! Round ${G.round} Begins.`
      },
    },
  },

  turn: {
    order: {
      first: (G, ctx) => G.lastWin,
      next: (G, ctx) => {
        if (G.eligible.length < 1) return -1;
        let n = (ctx.playOrderPos + 1) % ctx.numPlayers;
        while (!G.eligible.includes(n)) {
          n = (n + 1) % ctx.numPlayers;
        }
        return n;
      },
    },
    onBegin: (G, ctx) => {
      G.players[ctx.currentPlayer].protected = false;
      drawCard(G, ctx);
    },
    onEnd: (G, ctx) => {
      if (G.eligible.length === 1)
        ctx.events.endPhase();
      if (G.deck.length === 0)
        ctx.events.endPhase();
    }
  },

  endIf: (G, ctx) => {
    if (G.players.some((p) => p.wins === G.requiredWins)) {
      const winner = G.players.filter((p) => p.wins === G.requiredWins)[0];
      return { winner: winner.id}
    }
  },
};