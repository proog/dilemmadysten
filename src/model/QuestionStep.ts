import { Player } from "./Player";

export interface AnswerOption {
  text: string;
}

export interface Question {
  options: AnswerOption[];
}

export class QuestionStep {
  readonly answers = new Map<Player, AnswerOption>();
  readonly scores = new Map<Player, number>();

  get correctAnswer() {
    return this.answers.get(this.subject);
  }

  constructor(readonly subject: Player, readonly question: Question) {}

  addAnswer(player: Player, option: AnswerOption) {
    this.answers.set(player, option);
  }

  calculateScores() {
    if (!this.correctAnswer) {
      throw new Error("No correct answer set, cannot calculate scores");
    }

    const correctAnswerText = this.correctAnswer.text;
    let subjectScore = 0;
    this.scores.clear();

    for (const [player, answer] of this.answers) {
      if (player === this.subject) {
        continue;
      }

      const isCorrect = answer.text === correctAnswerText;
      this.scores.set(player, isCorrect ? 50 : 0);
      subjectScore += isCorrect ? 20 : 0;
    }

    this.scores.set(this.subject, subjectScore);
  }
}
