import { Chance } from "chance";
import { GameSession } from "./model/GameSession";
import { Player } from "./model/Player";
import { Question } from "./model/QuestionStep";

const chance = new Chance();

const questions: Question[] = chance.n(
  () => ({
    options: [
      { text: chance.sentence() },
      { text: chance.sentence() },
      { text: chance.sentence() },
    ],
  }),
  100
);
const host = { name: "Hanne", isHost: true };
const game = new GameSession("RP9M", host);

game.addPlayer(new Player("Johnny"));
game.addPlayer(new Player("Dingo"));

game.start(questions);
