import { io, Socket } from "socket.io-client";
import type { GameState } from "../../common/GameState";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  ValueStatus,
} from "../../common/socket-events";

type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export class SocketClient {
  constructor(private readonly socket: GameSocket) {
    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("stepStarted", (state) => {
      console.log(state);
    });
    socket.on("stepEnded", (state) => {
      console.log(state);
    });
    socket.on("playerJoined", (name, state) => {
      console.log(name, state);
    });
    socket.on("playerLeft", (name, state) => {
      console.log(name, state);
    });
  }

  connect() {
    this.socket.connect();
  }

  create(playerName: string) {
    return new Promise<GameState>((resolve, reject) => {
      this.socket.emit("createRoom", playerName, handleStatus(resolve, reject));
    });
  }

  join(code: string, playerName: string) {
    return new Promise<void>((resolve, reject) => {
      this.socket.emit("joinRoom", code, playerName, (status) => {
        if (!status.success) reject(status.reason);
        else resolve();
      });
    });
  }

  start() {
    this.socket.emit("startGame");
  }
}

function handleStatus<T>(
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void
) {
  return (status: ValueStatus<T>) => {
    if (!status.success) reject(status.reason);
    else resolve(status.data);
  };
}

export function createClient() {
  const socket: GameSocket = io("ws://localhost:3000", {
    autoConnect: false,
  });

  return new SocketClient(socket);
}

export const socketClient = createClient();
socketClient.connect();
