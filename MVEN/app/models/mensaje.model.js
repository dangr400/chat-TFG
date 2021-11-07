/**
 * @file Módulo que describe el esquema de un mensaje genérico en la BD. Este modelo será heredado por mensajes de grupo y privados
 * @author Daniel Gomez Rodriguez
 * @since 20.10.2021
 * @returns mongoose.model
 */

 const mongoose = require("mongoose");

 const MESSAGE_TYPES = {
     TYPE_TEXT: "text",
 };

 const leidoPorUsuariosSchema = new mongoose.Schema(
    {
      _id: false,
      leidoPorUsuarioId: String,
      readAt: {
        type: Date,
        default: Date.now(),
      },
    },
    {
      timestamps: false,
    }
  );

 const opcionesBase = {
     timestamps: true,
     discriminatorKey: 'tipo',
     collection: "mensajes"
 };

 const MensajeSchema = 
   new mongoose.Schema(
    {
        origen:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Usuario"
            },
        salaID: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sala"
        },
        contenido: mongoose.Schema.Types.Mixed,
        tipo: {
            type: String,
            default: () => MESSAGE_TYPES.TYPE_TEXT,
        },
        leidoPor: [leidoPorUsuariosSchema],
    },
        opcionesBase,
   );

   MensajeSchema.statics.createPostInChatRoom = async function (salaId, mensaje, origen) {
    try {
      const post = await this.create({
        salaId,
        mensaje,
        origen,
        leidoPor: { leidoPorUsuarioId: origen }
      });
      const aggregate = await this.aggregate([
        // get post where _id = post._id
        { $match: { _id: post._id } },
        // do a join on another table called usuarios, and 
        // get me a user whose _id = origen
        {
          $lookup: {
            from: 'usuarios',
            localField: 'origen',
            foreignField: '_id',
            as: 'origen',
          }
        },
        { $unwind: '$origen' },
        // do a join on another table called salas, and 
        // get me a chatroom whose _id = salaId
        {
          $lookup: {
            from: 'salas',
            localField: 'salaId',
            foreignField: '_id',
            as: 'informacionSala',
          }
        },
        { $unwind: '$informacionSala' },
        { $unwind: '$informacionSala.hablando' },
        // do a join on another table called usuarios, and 
        // get me a user whose _id = hablando
        {
          $lookup: {
            from: 'usuarios',
            localField: 'informacionSala.hablando',
            foreignField: '_id',
            as: 'informacionSala.perfilUsuario',
          }
        },
        { $unwind: '$informacionSala.perfilUsuario' },
        // group data
        {
          $group: {
            _id: '$informacionSala._id',
            postId: { $last: '$_id' },
            salaId: { $last: '$informacionSala._id' },
            mensaje: { $last: '$mensaje' },
            type: { $last: '$type' },
            origen: { $last: '$origen' },
            leidoPor: { $last: '$leidoPor' },
            informacionSala: { $addToSet: '$informacionSala.perfilUsuario' },
            createdAt: { $last: '$createdAt' },
            updatedAt: { $last: '$updatedAt' },
          }
        }
      ]);
      return aggregate[0];
    } catch (error) {
        console.log("ERROR ENVIANDO MENSAJE");
        throw error;
    }
  }

  MensajeSchema.statics.getConversationByRoomId = async function (salaId, opciones = {}) {
    try {
      return this.aggregate([
        { $match: { salaId } },
        { $sort: { createdAt: -1 } },
        // do a join on another table called usuarios, and 
        // get me a user whose _id = origen
        {
          $lookup: {
            from: 'usuarios',
            localField: 'origen',
            foreignField: '_id',
            as: 'origen',
          }
        },
        { $unwind: "$origen" },
        // apply pagination
        { $skip: opciones.page * opciones.limit },
        { $limit: opciones.limit },
        { $sort: { createdAt: 1 } },
      ]);
    } catch (error) {
        console.log("ERROR RECUPERANDO SALA");
      throw error;
    }
  }

 const Mensaje = mongoose.model("Mensaje", MensajeSchema);
 module.exports = Mensaje;