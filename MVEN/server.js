/**
 * Fichero en el que se crea el servidor, las APIs y las conexiones con la BD.
 * 
 * @file Punto de inicio de la aplicación. 
 * @author Daniel Gomez Rodriguez
 * @since 02.10.2021
 */
// paquetes necesarios
require('dotenv').config();
const express = require("express");
const cors = require("cors");
// aplicación de Express. Necesario para las APIs REST
const app = express();
// variable que contiene lo necesario para poder acceder a la base de datos
const db = require("./app/models");
// middleware para Cross-Origin Resource Sharing (para solicitar recursos desde un dominio distinto al que sirve el primer recurso)
var corsOptions = {
  origin: "http://localhost:8081"
};

const Rol = db.rol;
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

// configurar puerto, a la escucha de peticiones
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en puerto ${PORT}.`);
});

function initial() {
  Rol.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Rol({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Rol({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Rol({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}