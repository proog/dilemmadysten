import { Chance } from "chance";
import { beforeEach, expect, it } from "vitest";
import { GameSession } from "../src/model/GameSession";
import { Player } from "../src/model/Player";
import { Question } from "../src/model/QuestionStep";

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

const hostPlayer = new Player("Johnny", true);
const players = [hostPlayer, new Player("Dingo"), new Player("Cuddles")];
let game: GameSession;

beforeEach(() => {
  game = new GameSession("RP9M", hostPlayer);
  players.filter((p) => !p.isHost).forEach((p) => game.addPlayer(p));
});

it("should start game", () => {
  game.start(questions);
  expect(game.scores).toHaveLength(players.length);
  expect(game.currentStepIndex).toBe(0);
  expect(game.currentStep).toBeTruthy();
  expect(game.canAdvance).toBe(false);
});

it("should alternate between players", () => {
  game.start(questions);

  let previousSubject: Player | undefined;
  for (const step of game.steps) {
    expect(step.subject).not.toBe(previousSubject);
    previousSubject = step.subject;
  }
});

it("should advance through question steps", () => {
  game.start(questions);

  while (!game.isFinished) {
    for (const player of game.players) {
      expect(game.canAdvance).toBe(false);

      const answer = chance.pickone(game.currentStep!.question.options);
      game.currentStep?.addAnswer(player, answer);
    }

    expect(game.canAdvance).toBe(true);
    game.advance();
  }
});

it("should update scores after each question step", () => {
  game.start(questions);

  const stepSubject = game.currentStep?.subject;
  const answer = chance.pickone(game.currentStep!.question.options);

  for (const player of game.players) {
    game.currentStep?.addAnswer(player, answer);
  }

  game.advance();

  for (const player of game.players) {
    const playerScore = game.scores.get(player);
    expect(playerScore).toBe(
      player === stepSubject ? 20 * (game.players.length - 1) : 50
    );
  }
});
