import { Chance } from "chance";
import { GameState, GameStateStep } from "../../../common/GameState";
import { Player } from "./Player";
import { AnswerOption, Question, QuestionStep } from "./QuestionStep";

const chance = new Chance();

export class GameSession {
  readonly players: Player[] = [];

  steps: QuestionStep[] = [];
  currentStepIndex = -1;

  scores = new Map<Player, number>();

  get currentStep(): QuestionStep | undefined {
    return this.steps[this.currentStepIndex];
  }

  get canAdvance() {
    return this.currentStep?.answers.size === this.players.length;
  }

  get isFinished() {
    return this.currentStepIndex === this.steps.length;
  }

  constructor(readonly code: string, readonly host: Player) {
    this.players.push(host);
    this.scores.set(host, 0);
  }

  addPlayer(player: Player) {
    if (player.isHost) {
      throw new Error("Cannot add more than one host to the game");
    }

    if (this.players.some((p) => p.name === player.name)) {
      throw new Error("Cannot add more than one player with the same name");
    }

    this.players.push(player);
    this.scores.set(player, 0);
  }

  removePlayer(player: Player) {
    if (player.isHost) {
      throw new Error("Cannot remove the host from the game");
    }

    const index = this.players.indexOf(player);

    if (index > -1) {
      this.players.splice(index, 1);
      this.scores.delete(player);
    }
  }

  start(questions: Question[]) {
    if (this.currentStep) {
      throw new Error("Game has already started");
    }

    const shuffledPlayers = chance.shuffle(this.players);

    this.steps = chance
      .pickset(questions, this.players.length * 3)
      .map((question, index) => {
        const player = shuffledPlayers[index % shuffledPlayers.length];
        return new QuestionStep(player, question);
      });

    this.currentStepIndex++;
  }

  addAnswer(player: Player, option: AnswerOption) {
    if (!this.currentStep) {
      throw new Error("Cannot add answer at this point");
    }

    this.currentStep?.addAnswer(player, option);
  }

  advance() {
    if (!this.canAdvance || !this.currentStep) {
      throw new Error("Cannot advance at this point");
    }

    if (this.currentStep.state === "scores") {
      this.currentStepIndex++;
      return;
    }

    this.currentStep.calculateScores();

    for (const [player, stepScore] of this.currentStep.scores) {
      const playerScore = this.scores.get(player) || 0;
      this.scores.set(player, playerScore + stepScore);
    }
  }

  get state(): GameState {
    return {
      code: this.code,
      players: [...this.scores].map(([player, score]) => ({
        name: player.name,
        isHost: player.isHost,
        score: score,
      })),
      progress: {
        current: this.currentStepIndex,
        total: this.steps.length,
      },
      currentStep: this.getCurrentStepState(),
    };
  }

  private getCurrentStepState(): GameStateStep | undefined {
    if (this.isFinished) {
      return { kind: "finished", winners: this.getWinners() };
    }

    if (this.currentStep?.state === "question") {
      return {
        kind: "question",
        subject: this.currentStep.subject.name,
        options: this.currentStep.question.options.map((option) => option.text),
        answered: [...this.currentStep.answers.keys()].map(
          (player) => player.name
        ),
      };
    }

    if (this.currentStep?.state === "scores") {
      return {
        kind: "scores",
        scores: [...this.currentStep.scores].map(([player, score]) => ({
          player: player.name,
          score,
        })),
      };
    }

    return undefined;
  }

  private getWinners(): string[] {
    const maxScore = Math.max(...this.scores.values());
    const winners: Player[] = [];

    for (const [player, score] of this.scores) {
      if (score === maxScore) {
        winners.push(player);
      }
    }

    return winners.map((winner) => winner.name);
  }
}
