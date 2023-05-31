import { io, Socket } from "socket.io-client";
import type { GameState } from "../../common/GameState";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  ValueStatus,
} from "../../common/socket-events";
import { gameState } from "./game";

type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export class SocketClient {
  constructor(private readonly socket: GameSocket) {
    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("stepStarted", updateGameState);
    socket.on("stepEnded", updateGameState);
    socket.on("playerJoined", (name, state) => updateGameState(state));
    socket.on("playerLeft", (name, state) => updateGameState(state));
  }

  connect() {
    this.socket.connect();
  }

  create(playerName: string) {
    return new Promise<GameState>((resolve, reject) => {
      this.socket.emit(
        "createRoom",
        playerName,
        handleGameState(resolve, reject)
      );
    });
  }

  join(code: string, playerName: string) {
    return new Promise<GameState>((resolve, reject) => {
      this.socket.emit(
        "joinRoom",
        code,
        playerName,
        handleGameState(resolve, reject)
      );
    });
  }

  start() {
    return new Promise<GameState>((resolve, reject) => {
      this.socket.emit("startGame", handleGameState(resolve, reject));
    });
  }

  submitAnswer(answer: string) {
    return new Promise<GameState>((resolve, reject) => {
      this.socket.emit(
        "submitAnswer",
        answer,
        handleGameState(resolve, reject)
      );
    });
  }

  endStep() {
    return new Promise<GameState>((resolve, reject) => {
      this.socket.emit("endStep", handleGameState(resolve, reject));
    });
  }
}

function updateGameState(state: GameState) {
  gameState.value = state;
}

function handleGameState(
  resolve: (value: GameState | PromiseLike<GameState>) => void,
  reject: (reason?: any) => void
) {
  return (status: ValueStatus<GameState>) => {
    if (!status.success) {
      reject(status.reason);
      return;
    }

    updateGameState(status.data);
    resolve(status.data);
  };
}

export function createClient() {
  const socket: GameSocket = io();

  return new SocketClient(socket);
}

export const socketClient = createClient();
