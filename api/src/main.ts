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

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  ServerInternalEvents,
  SocketData
>({
  cors: {
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  registerSocketEvents(socket);
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

console.log(`Listening on port ${port}`);
io.listen(port);
