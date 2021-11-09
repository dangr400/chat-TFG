/**
 * @file Módulo que describe el esquema de un chat de grupo en la BD.
 * @author Daniel Gomez Rodriguez
 * @since 20.10.2021
 * @returns mongoose.model
 */

 const mongoose = require("mongoose");

 const ChatGroup = mongoose.model(
   "ChatGroup",
   new mongoose.Schema({
      nombre: String,
      creador: 
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "usuarios"
        },
      moderadores: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "usuarios"
        }
      ],
      integrantes: [
       {
         type: mongoose.Schema.Types.ObjectId,
         ref: "usuarios"
       }
     ],
      publico: Boolean,
      mensajes: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mensaje"
      }
   },
   {
    timestamps : true,
    collection : "chatgroups",
  })
 );
 module.exports = ChatGroup;