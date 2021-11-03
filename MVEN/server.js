/**
 * Fichero en el que se crea el servidor, las APIs y las conexiones con la BD.
 * 
 * @file Punto de inicio de la aplicación. 
 * @author Daniel Gomez Rodriguez
 * @since 02.10.2021
 */
// paquetes necesarios
require('dotenv').config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
// aplicación de Express. Necesario para las APIs REST
const app = express();
// variable que contiene lo necesario para poder acceder a la base de datos
const db = require("./app/models");
// puerto donde escucha el servidor
const port = process.env.PORT || 8080
// middleware para Cross-Origin Resource Sharing (para solicitar recursos desde un dominio distinto al que sirve el primer recurso)
var corsOptions = {
  origin: "http://localhost:8081"
};

// añadir puerto
app.set("port", port);

// añadir logger
app.use(logger);

// añadir CORS a la aplicación
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

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
  
// ruta simple
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido" });
});
// rutas
require('./app/rutas/auth.routes')(app);
require('./app/rutas/user.routes')(app);
require('./app/rutas/grupo.routes')(app);

// capturador de accesos a la API que no existen
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'No existe la ruta especificada'
  })
});

// Crear servidor HTTP. 
const server = http.createServer(app);
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