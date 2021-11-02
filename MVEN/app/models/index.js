/*
    Doc: index.js
    Fecha creación: 02/10/1998
    Módulo para la conexión con la base de datos,
     así como para poder acceder a las distintas colecciones
*/
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

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;