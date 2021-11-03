/**
 * @file Módulo que describe el esquema de una peticion de contacto en la BD.
 * @author Daniel Gomez Rodriguez
 * @since 02.10.2021
 * @returns mongoose.model
 */
 const mongoose = require("mongoose");

 const Peticion = mongoose.model(
   "PeticionContacto",
   new mongoose.Schema({
      idEmisor: {type: mongoose.Schema.Types.ObjectId, ref: "Usuario"},
      idReceptor: {type: mongoose.Schema.Types.ObjectId, ref: "Usuario"},
      estado: {type: String, default: "PENDIENTE"},
      fecha: {type: Date, default: Date.now}
   },
   {
      timestamps : true,
      collection : "peticionescontacto",
   }
   )
 );
 module.exports = Peticion;