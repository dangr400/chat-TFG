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
     //discriminatorKey: 'tipo',
     collection: "mensajes"
 };

 const MensajeSchema = 
   new mongoose.Schema(
    {
        origen:
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "usuarios"
        },
        salaId: 
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "salas"
        },
        contenido: String,
        tipo: {
          type: String,
          default: () => MESSAGE_TYPES.TYPE_TEXT,
        },
        leidoPor: [leidoPorUsuariosSchema],
    },
    { 
      timestamps: true,
      collection: "mensajes"
    },
   );

   MensajeSchema.statics.createPostInChatRoom = async function (sala, mensaje, origen) {
    try {
      const post = await this.create({
        origen: origen,
        salaId: sala._id,
        contenido: mensaje.contenido,
        tipo: mensaje.type, 
        leidoPor: { leidoPorUsuarioId: origen }
      });
      post.save();
      /*
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
      */
      return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
  }

  MensajeSchema.statics.getConversationByRoomId = async function (salaId, opciones = {}) {
    try {
      /*
      const mensajes = this.aggregate([
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
         apply pagination
        { $skip: opciones.page * opciones.limit },
        { $limit: opciones.limit },
        { $sort: { createdAt: 1 } },
        
      ]);*/
      const mensajes = await this.find({ salaId: salaId }).populate('origen', 'username');
      if (!mensajes){
        console.log("no hay mensajes")
        return null;
      }
      console.log("mensajes recuperados: \n" + mensajes);
      return mensajes;

    } catch (error) {
        console.log(error);
      throw error;
    }
  }

 const Mensaje = mongoose.model("Mensaje", MensajeSchema);
 module.exports = Mensaje;