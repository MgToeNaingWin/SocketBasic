import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  }
});

type Smg = { 
  username: string; 
  avatar: string; 
  smg: string; 
};

io.on("connection", (socket) => {
  console.log("A user connected!", socket.id);
  
  let connectedUser = "Anonymous";

  socket.on("send smg", ({ username, avatar, smg }: Smg) => {
    connectedUser = username;
    io.emit("send smg", { username, avatar, smg });
  });

  io.emit("Join message", { 
    username: "System", 
    avatar: "", 
    smg: "A new user joined the chat!" 
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    io.emit("leave message", { 
      username: "System", 
      avatar: "", 
      smg: `${connectedUser} left the chat.` 
    });
  });
});

httpServer.listen(3000, () => {
  console.log("HTTP server is running on port 3000");
});
