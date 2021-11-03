/**
 * @file Módulo que describe el esquema de un mensaje genérico en la BD. Este modelo será heredado por mensajes de grupo y privados
 * @author Daniel Gomez Rodriguez
 * @since 20.10.2021
 * @returns mongoose.model
 */

 const mongoose = require("mongoose");

 const opcionesBase = {
     timestamps: true,
     discriminatorKey: 'tipo',
     collection: "mensajes"
 }


 const Mensaje = mongoose.model(
   "Mensaje",
   new mongoose.Schema(
       {
        origen:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Usuario"
            },
        fecha: Date,
        contenido: String
        },
        opcionesBase,
   ),
 );
 module.exports = Mensaje;