import express from "express";
import http from "http";
import { registerServer } from "./sockets";

const app = express();
const server = http.createServer(app);

registerServer(server);

server.listen(3000, () => {
  console.log("listening on *:3000");
});
