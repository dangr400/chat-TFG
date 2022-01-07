/**
 * @file Módulo que describe el esquema de un mensaje privado en la BD. (MODULO EN DESUSO)
 * @author Daniel Gomez Rodriguez
 * @since 20.10.2021
 * @returns mongoose.model
 */

 const mongoose = require("mongoose");

 const Mensaje = require("./mensaje.model");

 const MensajePrivado = Mensaje.discriminator(
   "MensajePrivado",
   new mongoose.Schema(
       {
        destino:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Usuario"
            },
        
        }
   ),
 );
 module.exports = MensajePrivado;