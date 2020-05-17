import { Player } from './Player';
import { Questions } from './questions';

const guessNumber = (G, ctx, playData) => {
  G.players[playData.userId].guessValue = playData.guessValue;
};

const changeQuestion = (G, ctx) => {
  G.previousQuestions.push(G.questionIndex);
  newQuestion(G, ctx);
}

const wager1 = (G, ctx, playData) => {
  G.players[playData.userId].wager1 = { bracket: playData.bracket, amount: playData.amount, value: playData.value};
}

const wager2 = (G, ctx, playData) => {
  G.players[playData.userId].wager2 = { bracket: playData.bracket, amount: playData.amount, value: playData.value};
}

const nextRound = (G, ctx) => {
  ctx.events.endPhase();
}

const namePlayer = (G, ctx, metadata) => {
  G.gameMetadata = metadata;
}

const newQuestion = (G, ctx) => {
  let die = ctx.random.Die(Questions.length);
  while (G.previousQuestions.indexOf(die) > -1)
    die = ctx.random.Die(Questions.length);
  G.question = Questions[die].question;
  G.questionIndex = die;
}

const odds = { "-4": 6, "-3": 5, "-2": 4, "-1": 3, "0": 2, "1": 3, "2": 4, "3": 5};


export const WitsWagers = {
  setup: (ctx) => ({
    round: 1,
    previousQuestions: [],
    questionIndex: undefined,
    question: undefined,
    answer: undefined,
    layout: {},
    results: {},
    players: Array(ctx.numPlayers).fill().map((_val, i) => (Player(i))),
  }),

  minPlayers: 2,
  maxPlayers: 7,
  name: 'WitsWagers',

  playerView: (G, ctx, playerID) => { 
    return G;
  },

  moves: {
    guessNumber,
    changeQuestion,
    wager1,
    wager2,
    nextRound,
    namePlayer
  }, 

  phases: {
    guess: {
      moves: { guessNumber, changeQuestion, namePlayer },
      start: true,
      next: "wager",
      onBegin: (G, ctx) => {
        for (const player of G.players) {
          player.guessValue = undefined;
          player.wager1 = undefined;
          player.wager2 = undefined;
        }     
        G.results = {};
        G.answer = undefined;
        newQuestion(G, ctx);
        ctx.events.setActivePlayers({
          currentPlayer: { stage: 'guessStage' },
          others: { stage: 'guessStage' },
        });
      },
      endIf: (G, ctx) => {
        return !G.players.some((p) => !p.guessValue);
      },
      turn: {
        stages: {
          guessStage: {
            moves: { guessNumber, changeQuestion, namePlayer },
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
      next: "result",
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
      onEnd: (G, ctx) => {
        G.answer = Questions[G.questionIndex].answer;
        G.results = {};
        const uniqueValues = [...new Set(G.players.map(player => player.guessValue))].sort();
        let winner;
        for (let u of uniqueValues) {
          if (u <= G.answer)
            winner = u;
          else
            break;
        }
        if (!winner)
          winner = "Lower";

        for (const p of G.players) {
          const pR = {guess: 0, wager1: 0, wager2: 0};
          if (p.guessValue === winner)
            pR.guess = 3;
          if (p.wager1.value === winner)
            pR.wager1 = odds[p.wager1.bracket] * p.wager1.amount;
          else
            pR.wager1 = (p.wager1.amount - 1) * -1;
          if (p.wager2.value === winner)
            pR.wager2 = odds[p.wager2.bracket] * p.wager2.amount;
          else
            pR.wager2 = (p.wager2.amount - 1) * -1;

          p.score += pR.guess + pR.wager1 + pR.wager2;
          G.results[p.id] = pR;
        }
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
    result: {
      moves: { nextRound },
      onBegin: (G, ctx) => {
        ctx.events.setActivePlayers({
          currentPlayer: { stage: 'reset' },
          others: { stage: 'reset' },
        });        
        G.round += 1;
      },
      onEnd: (G, ctx) => {
        G.players[0].guessValue = undefined;
        G.previousQuestions.push(G.questionIndex);
      },
      turn: {
        stages: {
          reset: {
            moves: { nextRound },
          },
        }
      },
      next: 'guess',   
    },
  },

  endIf: (G, ctx) => {
    if (G.round > 7) {
      const winner = G.players.reduce((max, player) => max.score > player.score ? max : player);
      return { winner: winner.id, message: `${G.gameMetadata[winner.id].name} WINS $${winner.score}!!!`};
    }
  },
};