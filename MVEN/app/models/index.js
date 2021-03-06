/**
 * Módulo para la conexión con la base de datos, así como para poder acceder a las distintas colecciones.
 * 
 * @file Modulo de la base de datos
 * @author Daniel Gomez Rodriguez
 * @since 02.10.2021
 */
const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url_atlas;
db.usuario = require("./usuario.model.js");
db.rol = require("./rol.model.js");
db.grupos = require("./chatgroup.model.js");
db.peticion = require("./peticionContacto.model.js");
db.mensajeGrupo = require("./mensajeGrupo.model.js");
db.mensajePrivado = require("./mensajePrivado.model.js");
db.salas = require("./salas.model.js");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;