/**
 * @file Módulo que describe el esquema de un mensaje en un grupo en la BD. (MODULO EN DESUSO)
 * @author Daniel Gomez Rodriguez
 * @since 20.10.2021
 * @returns mongoose.model
 */

 const mongoose = require("mongoose");

 const Mensaje = require("./mensaje.model");

 const MensajeGrupo = Mensaje.discriminator(
   "MensajeGrupo",
   new mongoose.Schema(
       {
        destino:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ChatGroup"
            },
        
        },
   ),
 );
 module.exports = MensajeGrupo;