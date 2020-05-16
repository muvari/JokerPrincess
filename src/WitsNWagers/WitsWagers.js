import { Player } from './Player';

const guessNumber = (G, ctx, playData) => {
  G.players[playData.userId].guessValue = playData.guessValue;
};

const changeQuestion = () => {

}

const wager1 = (G, ctx, playData) => {
  G.players[playData.userId].wager1 = { bracket: playData.bracket, amount: playData.amount};
}

const wager2 = (G, ctx, playData) => {
  G.players[playData.userId].wager2 = { bracket: playData.bracket, amount: playData.amount};
}

export const WitsWagers = {
  setup: (ctx) => ({
    round: 0,
    random: ctx.random,
    question: undefined,
    answer: 42,
    layout: {},
    players: Array(ctx.numPlayers).fill().map((_val, i) => (Player(i))),
  }),

  minPlayers: 2,
  maxPlayers: 7,
  name: 'WitsAndWagers',

  playerView: (G, ctx, playerID) => { 
    return G;
  },

  moves: {
    guessNumber,
    changeQuestion,
    wager1,
    wager2
  }, 


  phases: {
    guess: {
      moves: { guessNumber, changeQuestion },
      start: true,
      next: "wager",
      onBegin: (G, ctx) => {
        for (const player of G.players) {
          player.guessValue = undefined;
          player.wager1 = undefined;
          player.wager2 = undefined;
        }        
        ctx.events.setActivePlayers({
          currentPlayer: { stage: 'guessStage' },
          others: { stage: 'guessStage' },
        });
      },
      onEnd: (G, ctx) => {
      },
      endIf: (G, ctx) => {
        return !G.players.some((p) => !p.guessValue);
      },
      turn: {
        stages: {
          guessStage: {
            moves: { guessNumber, changeQuestion },
            next: "wait",
          },
          wait: {
            moves: {},
          }
        }
      }
    },

    wager: {
      moves: { wager1, wager2 },
      next: "round",
      onBegin: (G, ctx) => {
        G.layout = {};
        const uniqueValues = [...new Set(G.players.map(player => player.guessValue))].sort();
        if (uniqueValues === 1) {
          G.layout[0] = G.players.map((player) => player.id);
        } else {
          const middleIndex = Math.trunc(uniqueValues.length / 2);
          if (uniqueValues.length % 2 === 1) {
            G.layout[0] = G.players.filter((player) => player.guessValue === uniqueValues[middleIndex]).map((player) => player.id);
            for (let i = middleIndex + 1; i < uniqueValues.length; i++)
              G.layout[i - middleIndex] = G.players.filter((player) => player.guessValue === uniqueValues[i]).map((player) => player.id);
            for (let i = middleIndex - 1; i >= 0; i--) 
              G.layout[i - middleIndex] = G.players.filter((player) => player.guessValue === uniqueValues[i]).map((player) => player.id);   
          } else {
            for (let i = middleIndex; i < uniqueValues.length; i++)
              G.layout[i] = G.players.filter((player) => player.guessValue === uniqueValues[i]).map((player) => player.id);
            for (let i = middleIndex - 1; i >= 0; i--) 
              G.layout[i - middleIndex] = G.players.filter((player) => player.guessValue === uniqueValues[i]).map((player) => player.id); 
          }
        }
        ctx.events.setActivePlayers({
          currentPlayer: { stage: 'wager1' },
          others: { stage: 'wager1' },
        });
      },
      endIf: (G, ctx) => {
        return !G.players.some((p) => !(p.wager1 && p.wager2));
      },
      turn: {
        stages: {
          wager1: {
            moves: { wager1, wager2 },
            next: 'wait'
          },
          wait: {
            moves: {},
          }
        }
      }
    },
  },

  endIf: (G, ctx) => {
    if (G.round > 6) return;
  },
};