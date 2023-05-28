import type { GameState } from "./GameState";

export type Status = { success: true } | { success: false; reason: string };
export type ValueStatus<T> =
  | { success: true; data: T }
  | { success: false; reason: string };

type statusCallback = (status: Status) => void;
type valueCallback<T> = (status: ValueStatus<T>) => void;

export interface ServerToClientEvents {
  stepStarted: (state: GameState) => void;
  stepEnded: (state: GameState) => void;
  playerJoined: (name: string, state: GameState) => void;
  playerLeft: (name: string, state: GameState) => void;
  gameEnded: () => void;
}

export interface ClientToServerEvents {
  joinRoom: (
    roomCode: string,
    playerName: string,
    callback: valueCallback<GameState>
  ) => void;
  createRoom: (playerName: string, callback: valueCallback<GameState>) => void;
  startGame: (callback: valueCallback<GameState>) => void;
  submitAnswer: (answer: string, callback: valueCallback<GameState>) => void;
  endStep: (callback: valueCallback<GameState>) => void;
}
