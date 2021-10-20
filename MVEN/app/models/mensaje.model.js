/**
 * @file Módulo que describe el esquema de un mensaje en la BD.
 * @author Daniel Gomez Rodriguez
 * @since 20.10.2021
 * @returns mongoose.model
 */

 const mongoose = require("mongoose");

 const Mensaje = mongoose.model(
   "Mensaje",
   new mongoose.Schema({
        origen:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Usuario"
            },
        destino:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ChatGroup"
            },
        fecha: Date,
        contenido: String
   })
 );
 module.exports = Mensaje;