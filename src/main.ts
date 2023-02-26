import { Chance } from "chance";
import { GameSession } from "./model/GameSession";
import { Player } from "./model/Player";
import { Question } from "./model/QuestionStep";

const chance = new Chance();

const questions: Question[] = chance.n(
  () => ({
    options: [{ text: "A" }, { text: "B" }, { text: "C" }],
  }),
  6
);
const host = { name: "Hanne", isHost: true };
const game = new GameSession("RP9M", host);
game.addPlayer(new Player("Johnny"));
game.start(questions);

submitAnswer("Johnny", "B");
submitAnswer("Hanne", "C");
submitAnswer("Johnny", "B");
submitAnswer("Hanne", "C");
submitAnswer("Johnny", "B");
submitAnswer("Hanne", "C");
submitAnswer("Johnny", "B");
submitAnswer("Hanne", "C");
submitAnswer("Johnny", "B");
submitAnswer("Hanne", "C");
submitAnswer("Johnny", "B");
submitAnswer("Hanne", "C");

console.log(game.isFinished);

function submitAnswer(playerName: string, answerText: string) {
  const player = findPlayer(playerName);
  const answer = findAnswer(answerText);
  game.currentStep?.addAnswer(player, answer);

  if (game.canAdvance) {
    game.advance();
  }
}

function findPlayer(name: string) {
  const player = game.players.find((p) => p.name === name);

  if (!player) {
    throw new Error(`No player named "${name}"`);
  }

  return player;
}

function findAnswer(text: string) {
  const option = game.currentStep?.question.options.find(
    (p) => p.text === text
  );

  if (!option) {
    throw new Error(`No option named "${text}"`);
  }

  return option;
}
