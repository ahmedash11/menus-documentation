import http from "http";
import app from "./app";
import { ensureSocketAuthenticated } from "./utilities/mail.js";
import socketIo from "socket.io";

const PORT = process.env.PORT || 5000;

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`CRM Listening on ${bind}`);
};

const server = http.createServer(app);

global.SocketIO = socketIo(server);
SocketIO.use(ensureSocketAuthenticated);
SocketIO.on("connection", socket => {
  console.log(`Client ${socket.id} connected`);
  socket.join(`company_${socket.companyRoom}`);
  socket.on("disconnect", () =>
    console.log(`Client ${socket.id} disconnected`)
  );
});

server.listen(PORT);
server.on("listening", onListening);

export default server;
