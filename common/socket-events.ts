import type { GameState } from "./GameState";

export type Status = { success: true } | { success: false; reason: string };
export type ValueStatus<T> =
  | { success: true; data: T }
  | { success: false; reason: string };

type ValueCallback<T> = (status: ValueStatus<T>) => void;
type GameStateCallback = ValueCallback<GameState>;

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
    callback: GameStateCallback
  ) => void;
  createRoom: (playerName: string, callback: GameStateCallback) => void;
  startGame: (callback: GameStateCallback) => void;
  submitAnswer: (answer: string, callback: GameStateCallback) => void;
  endStep: (callback: GameStateCallback) => void;
}
