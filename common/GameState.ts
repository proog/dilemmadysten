export interface GameState {
  code: string;
  scores: { player: string; score: number }[];
  progress: { current: number; total: number };
  currentStep: { options: string[]; answered: string[] } | undefined;
}
