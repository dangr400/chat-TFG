/**
 * Módulo que contiene las configuraciones necesarias para conectarse con la base de datos en MongoDB.
 * 
 * @file Modulo de configuracion
 * @author Daniel Gomez Rodriguez
 * @since 02.10.2021
 */
module.exports = {
    HOST: "localhost",
    PORT: 27017,
    DB: "tfg",
    url: "mongodb://localhost:27017/tfg",
    url_atlas: `mongodb+srv://admin:${process.env.DB_PASS}@dgr.kiftf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  };