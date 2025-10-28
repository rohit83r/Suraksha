import http from "http";
import { Server } from "socket.io";
import app from "./app";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);
});

server.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));
