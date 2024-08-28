import { createServer } from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 3001;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("connection", socket.id);
  socket.on("join-room", (id, roodID) => {
    console.log("join-room", id, roodID);
    socket.join(roodID);
    socket.broadcast.to(roodID).emit("user-connected", id);
  });
  socket.on("toggle-track", (userId, roomId,type) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("updateList", userId, type);
  });
  socket.on("user-leave", (userId, roomId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("userDelete", userId);
  });
});

httpServer.listen(port, () => {
  console.log("listening on *:3001");
});
