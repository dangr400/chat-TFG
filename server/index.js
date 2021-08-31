const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("Nombre no válido"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  // recoger usuarios existentes
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);

  // notificar usuarios recogidos
  socket.broadcast.emit("Usuario Conectado", {
    userID: socket.id,
    username: socket.username,
  });

  // Enviar mensaje a receptor adecuado
  socket.on("Mensaje Privado", ({ content, to }) => {
    socket.to(to).emit("Mensaje Privado", {
      content,
      from: socket.id,
    });
  });

  // Notificar a los usuarios de desconexion
  socket.on("Desconectar", () => {
    socket.broadcast.emit("Usuario Desconectado", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
);