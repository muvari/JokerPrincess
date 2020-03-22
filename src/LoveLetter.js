import { Player } from './Player';
import * as Card from './Card';

const Deck = [
  new Card.OneCard(0),
  new Card.OneCard(1),
  new Card.OneCard(2),
  new Card.OneCard(3),
  new Card.OneCard(4),
  new Card.TwoCard(5),
  new Card.TwoCard(6),
  new Card.ThreeCard(7),
  new Card.ThreeCard(8),
  new Card.FourCard(9),
  new Card.FourCard(10),
  new Card.FiveCard(11),
  new Card.FiveCard(12),
  new Card.SixCard(13),
  new Card.SevenCard(14),
  new Card.EightCard(15),
];

const drawCard = (G, ctx) => {
  const player = G.players[ctx.currentPlayer];
  if (G.deck.length > 0)
    player.newCard = G.deck.pop();
}

const playCard = (G, ctx, playData) => {  
  const player = G.players[ctx.currentPlayer];
  const oldCard = player.card.id === playData.id;
  const card = oldCard ? player.card : player.newCard;

  card.doAction(G, ctx, playData);

  if (!player.eliminated)
    player.discarded.push(card);
  if (oldCard)
    player.card = player.newCard; 
  player.newCard = undefined;
  ctx.events.endTurn();
}

export const LoveLetter = {
  setup: (ctx) => ({
    round: 1,
    requiredWins: parseInt(13 / ctx.numPlayers) + 1,
    players: Array(ctx.numPlayers).fill().map((_val, i) => (new Player(i))),
    deck: [],
    hiddenCard: undefined,
    eligible: [],
    lastWin: 0,
    history: []
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
      onBegin: (G, ctx) => {
        G.eligible = Array.from(Array(ctx.numPlayers).keys());
        G.deck = [].concat(Deck);
        G.deck = ctx.random.Shuffle(G.deck);
        G.hiddenCard = G.deck.pop();
        for (const player of G.players)
          player.card = G.deck.pop();
      },
      onEnd: (G, ctx) => {
        G.round += 1;
      }
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
      drawCard(G, ctx);
    }
  },

  endIf: (G, ctx) => {
    if (false)
      return { };
  },
};