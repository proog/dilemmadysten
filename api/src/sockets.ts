import { Chance } from "chance";
import http from "http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../common/socket-events";
import { GameSession } from "./model/GameSession";
import { Player } from "./model/Player";
import { Question } from "./model/QuestionStep";

const chance = new Chance();

interface ServerInternalEvents {}

interface SocketData {
  roomCode: string;
  playerName: string;
}

const games = new Map<string, GameSession>();

export function registerServer(server: http.Server) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    ServerInternalEvents,
    SocketData
  >(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      const roomCode = socket.data.roomCode;
      const playerName = socket.data.playerName;

      if (roomCode && playerName) {
        const game = games.get(roomCode);
        const player = game?.players.find((p) => p.name === playerName);

        if (game && player) {
          if (player.isHost) {
            games.delete(game.code);
            socket.to(game.code).emit("gameEnded");
          } else {
            game.removePlayer(player);
            socket.to(game.code).emit("playerLeft", player.name, game.state);
          }
        }
      }

      console.log("a user disconnected");
    });

    socket.on("createRoom", async (playerName, callback) => {
      const roomCode = chance.guid();
      const player = new Player(playerName, true);
      const game = new GameSession(roomCode, player);
      games.set(roomCode, game);

      await socket.join(roomCode);
      socket.data.roomCode = roomCode;
      socket.data.playerName = playerName;

      console.log(`Player ${playerName} created room ${roomCode}`);
      callback({ success: true, data: game.state });
    });

    socket.on("joinRoom", async (roomCode, playerName, callback) => {
      const game = games.get(roomCode);

      if (!game) {
        callback({ success: false, reason: `Game ${roomCode} does not exist` });
        return;
      }

      if (game.players.some((p) => p.name === playerName)) {
        callback({
          success: false,
          reason: `That name has already been taken`,
        });
        return;
      }

      game.addPlayer(new Player(playerName));

      await socket.join(roomCode);
      socket.data.roomCode = roomCode;
      socket.data.playerName = playerName;

      console.log(`Player ${playerName} joined room ${roomCode}`);
      callback({ success: true });
    });

    socket.on("startGame", () => {
      const roomCode = socket.data.roomCode || "";
      const game = games.get(roomCode);

      if (!game) {
        return;
      }

      if (socket.data.playerName !== game.host.name) {
        return;
      }

      const questions: Question[] = chance.n(
        () => ({
          options: [
            { text: chance.sentence() },
            { text: chance.sentence() },
            { text: chance.sentence() },
          ],
        }),
        30
      );
      game.start(questions);

      socket.to(roomCode).emit("stepStarted", game.state);
    });
  });

  return io;
}
