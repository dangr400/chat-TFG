/**
 * @file Módulo que describe el esquema de un usuario en la BD.
 * @author Daniel Gomez Rodriguez
 * @since 02.10.2021
 * @returns mongoose.model
 */
const mongoose = require("mongoose");

const Usuario = mongoose.model(
  "Usuario",
  new mongoose.Schema({
    username: String,
    email: String,
    password: {type: String, select: false},
    configuracion: 
      {
        publico: {type: Boolean, default: false},
        persistencia_msgs: {type: Boolean, default: false}
      },
    contactos:
      [
        {type: mongoose.Schema.Types.ObjectId, ref: "Usuario"}
      ]
      
  },
  {
    timestamps : true,
    collection : "usuarios",
  })
);
module.exports = Usuario;