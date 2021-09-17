const httpServer = require("http").createServer();
const { Server } = require("socket.io")
const { createAdapter } = require("@socket.io/mongo-adapter");
const { MongoClient } = require("mongodb");

const DB = "TFG";
const ADAPTER = "socket.io-adapter-events";
const MENSAJES = "Mensajes"
const USUARIOS = "Usuarios"

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

const mongoClient = new MongoClient("mongodb://localhost:27017/?replicaSet=rs0", {
  useUnifiedTopology: true,
});

const main = async () => {
  await mongoClient.connect();

  try {
    await mongoClient.db(DB).createCollection(ADAPTER, {
      capped: true,
      size: 1e6
    });
  } catch (e) {
    // collection already exists
  }
  const mongoCollection = mongoClient.db(DB).collection(ADAPTER);

  io.adapter(createAdapter(mongoCollection));
  io.listen(3000);
}
// Conexion con mongo
main();

// ID aleatorio para cada usuario del chat
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

// Objeto SessionStore, para almacenar los valores de la sesion de un cliente
const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();

// Objeto messageStore, para almacenar los mensajes del servidor
const { InMemoryMessageStore } = require("./messageStore");
const messageStore = new InMemoryMessageStore();

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    // Si ya existe una sesion, recuperarla
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  //mantener la sesión
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // emitir detalles de la sesión
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  // unirse a la sala de "userID"
  socket.join(socket.userID);
  
  const users = [];
  const messagesPerUser = new Map();
  // Recuperar los mensajes
  messageStore.findMessagesForUser(socket.userID).forEach((message) => {
    const { from, to } = message;
    const otherUser = socket.userID === from ? to : from;
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message]);
    }
  });
  // Recuperar los usuarios
  sessionStore.findAllSessions().forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected,
      messages: messagesPerUser.get(session.userID) || [],
    });
  });
  socket.emit("users", users);

  // notificar usuarios recogidos
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true,
    messages: [],
  });

  // Enviar mensaje a receptor adecuado
  socket.on("private message", ({ content, to }) => {
    const message = {
      content,
      from: socket.userID,
      to,
    };
    socket.to(to).to(socket.userID).emit("private message", message);
    messageStore.saveMessage(message);
  });

  // Notificar a los usuarios de desconexion
  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notificar usuarios
      socket.broadcast.emit("user disconnected", socket.userID);
      // actualizar el estado de conexion en la sesion
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
);