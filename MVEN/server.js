// paquetes necesarios
const { Server } = require("socket.io");
require('dotenv').config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");

// variable que contiene lo necesario para poder acceder a la base de datos
const db = require("./app/models");

// Conexión con la base de datos
db.mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Conectado con la base de datos");
    initial();
  })
  .catch(err => {
    console.log("No se ha podido conectar con la base de datos:", err);
    process.exit();
  });
  

// aplicación de Express. Necesario para las APIs REST
const app = express();


// puerto donde escucha el servidor, añadirlo a Express
const port = process.env.PORT || 8080
app.set("port", port);

// middleware para Cross-Origin Resource Sharing (para solicitar recursos desde un dominio distinto al que sirve el primer recurso)
var corsOptions = {
  origin: "http://localhost:8081"
};

// añadir logger
app.use(logger("dev"));

// añadir CORS a la aplicación
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// ruta simple
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido" });
});
// rutas
require('./app/rutas/auth.routes')(app);
require('./app/rutas/user.routes')(app);
require('./app/rutas/grupo.routes')(app);
require('./app/rutas/salas.routes')(app);

// capturador de accesos a la API que no existen
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'No existe la ruta especificada'
  })
});

// Crear servidor HTTP. 
const server = http.createServer(app);
global.io = new Server(server, {
  cors: {
    origin: "http://localhost:8081",
    methods: ["GET", "POST"]
  }
  });
let usuariosConectados = [];
global.io.on("connection", (socket) => {
  // unirse a una sala
  socket.on('join', function(datos) {
    socket.join(datos.sala);
  });

  socket.on('enviarMensaje', function(datos) {
    function getNombreSocket(listaUsuarios) {
      return listaUsuarios.socketId === socket.id;
  }
  
   const usuario = usuariosConectados.find(getNombreSocket);
    
    const enviar = {
      mensaje: datos.mensaje,
      emisor: usuario.username,
    };
    global.io.to(datos.sala).emit('emitirMensaje', enviar);
  });

  socket.on("salirChat", () => {
    socket.disconnect();
  })
  socket.on("disconnecting", () => {
    // borrar usuario del registro
    for (var i = usuariosConectados.length - 1; i >= 0; --i) {
      if (usuariosConectados[i].socketId == socket.id) {
          usuariosConectados.splice(i,1);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log('Got disconnect!');
  });

  // añadir identidad del usuario mapeado al socket id
  socket.on("identity", (user) => {
    var actualizar = false;
    for (var i = usuariosConectados.length - 1; i >= 0; --i) {
      if (usuariosConectados[i].userId == user.id) {
          usuariosConectados[i].socketId = socket.id;
          actualizar = true;
          console.log("Actualizado usuario")
      }
    }
    if (!actualizar){
      usuariosConectados.push({
        socketId: socket.id,
        username: user.username,
        userId: user.id,
      });
      console.log("Nuevo usuario conectado");
    }
  });
});

// Escuchar en el puerto seleccionado.
server.listen(port);
// Capturador de eventos cuando el servidor esté a la espera de conexiones.
server.on("listening", () => {
  console.log(`Servidor ejecutandose en puerto: http://localhost:${port}/`)
});



/*
// configurar puerto, a la escucha de peticiones
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en puerto ${PORT}.`);
});
*/
function initial() {
  console.log("configuraciones iniciales finalizadas.");
}