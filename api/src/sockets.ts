import { Chance } from "chance";
import { Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../common/socket-events";
import { GameSession } from "./model/GameSession";
import { Player } from "./model/Player";
import { questions } from "./questions";

export interface ServerInternalEvents {}

export interface SocketData {
  roomCode: string;
  playerName: string;
}

const chance = new Chance();
const games = new Map<string, GameSession>();

export function registerSocketEvents(
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    ServerInternalEvents,
    SocketData
  >
) {
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
    socket.to(roomCode).emit("playerJoined", playerName, game.state);
    callback({ success: true, data: game.state });
  });

  socket.on("startGame", (callback) => {
    const roomCode = socket.data.roomCode || "";
    const game = games.get(roomCode);

    if (!game) {
      callback({ success: false, reason: `Game ${roomCode} does not exist` });
      return;
    }

    if (socket.data.playerName !== game.host.name) {
      callback({ success: false, reason: "You are not the host" });
      return;
    }

    game.start(questions);

    socket.to(roomCode).emit("stepStarted", game.state);
    callback({ success: true, data: game.state });
  });

  socket.on("submitAnswer", (answer, callback) => {
    const roomCode = socket.data.roomCode || "";
    const game = games.get(roomCode);

    if (!game?.currentStep) {
      callback({ success: false, reason: "No current step" });
      return;
    }

    const player = game.players.find((p) => p.name === socket.data.playerName);
    const option = game.currentStep.question.options.find(
      (o) => o.text === answer
    );

    if (!player || !option) {
      callback({ success: false, reason: "Player or option invalid" });
      return;
    }

    game.addAnswer(player, option);

    if (game.canAdvance) {
      game.advance();
      socket.to(roomCode).emit("stepEnded", game.state);
    }

    callback({ success: true, data: game.state });
  });

  socket.on("endStep", (callback) => {
    const roomCode = socket.data.roomCode || "";
    const game = games.get(roomCode);

    if (!game?.canAdvance) {
      callback({ success: false, reason: "No current step" });
      return;
    }

    game.advance();

    socket.to(roomCode).emit("stepEnded", game.state);
    callback({ success: true, data: game.state });
  });
}
