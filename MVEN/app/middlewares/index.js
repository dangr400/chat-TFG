// Módulo para exportar los módulos de verificación
// Autor: Daniel Gómez Rodríguez
// Referencias: Bezkoder

const authJwt = require("./authJwt");
const verifySignUp = require("./verificarRegistro");
const verificarContactos = require("./verificarContactos");
const verificarGrupos = require("./verificarGrupos");

module.exports = {
  authJwt,
  verifySignUp,
  verificarContactos,
  verificarGrupos
};