export interface GameStateQuestion {
  kind: "question";
  subject: string;
  options: {
    text: string;
    players: string[];
  }[];
}

export interface GameStateScores {
  kind: "scores";
  scores: {
    player: string;
    score: number;
  }[];
}

export interface GameStateEnd {
  kind: "finished";
  winners: string[];
}

export type GameStateStep = GameStateQuestion | GameStateScores | GameStateEnd;

export interface GameState {
  code: string;
  players: { name: string; score: number; isHost: boolean }[];
  progress: { current: number; total: number };
  currentStep: GameStateStep | undefined;
}
