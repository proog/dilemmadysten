import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../common/socket-events";
import {
  ServerInternalEvents,
  SocketData,
  registerSocketEvents,
} from "./sockets";

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const httpServer = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  ServerInternalEvents,
  SocketData
>(httpServer);

io.on("connection", (socket) => {
  console.log("a user connected");
  registerSocketEvents(socket);
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
