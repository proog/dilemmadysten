import { Chance } from "chance";
import { GameState } from "../../../common/GameState";
import { Player } from "./Player";
import { Question, QuestionStep } from "./QuestionStep";

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

  advance() {
    if (!this.canAdvance || !this.currentStep) {
      throw new Error("Cannot advance at this point");
    }

    this.currentStep.calculateScores();

    for (const [player, stepScore] of this.currentStep.scores) {
      const playerScore = this.scores.get(player) || 0;
      this.scores.set(player, playerScore + stepScore);
    }

    this.currentStepIndex++;
  }

  get state(): GameState {
    return {
      code: this.code,
      scores: [...this.scores].map(([player, score]) => ({
        player: player.name,
        score: score,
      })),
      progress: {
        current: this.currentStepIndex,
        total: this.steps.length,
      },
      currentStep: !this.currentStep
        ? undefined
        : {
            options: this.currentStep.question.options.map(
              (option) => option.text
            ),
            answered: [...this.currentStep.answers.keys()].map(
              (player) => player.name
            ),
          },
    };
  }
}
