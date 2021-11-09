const mongoose = require("mongoose");

const CHAT_ROOM_TYPES = {
    GRUPO: "grupo",
    USUARIOS: "usuarios",
  };

const SalasSchema = new mongoose.Schema(
        {
            grupoId: {type: mongoose.Schema.Types.ObjectId, ref: "chatgroups"},
        },
        {
            timestamps: true,
            collection: "salas",
        }
    );

SalasSchema.statics.iniciarChatGrupo = async function (grupo, iniciador) {
    try{
        const SalaDisponible = await this.findOne({
        grupoId: grupo._id
        });
        if (SalaDisponible) {
            return {
                isNew: false,
                message: 'retornando una sala de chat antigua',
                chatRoomId: SalaDisponible._doc._id,
                tipo: SalaDisponible._doc.type,
            };
        }
        else {
            const newRoom = await this.create({ 
               hablando: [iniciador],
               tipo: "grupo",
               iniciadorChat: iniciador,
               grupoId: grupo._id,
            });
            return {
                isNew: true,
                message: 'creando nueva sala de chat',
                chatRoomId: NetworkInformation._doc._id,
                tipo: newRoom._doc.type,
            };
        }
    } catch (error) {
        console.log('erro en metodo de empezar chat', error);
        throw error;
    }
};

SalasSchema.statics.iniciarChatUsuarios = async function (usuarios, iniciador) {
    try{
        const SalaDisponible = await this.findOne({
        hablando: {
            $all: [...usuarios],
        },
        tipo : "usuarios",
        });
        if (SalaDisponible) {
            return {
                isNew: false,
                message: 'retornando una sala de chat antigua',
                chatRoomId: SalaDisponible._doc._id,
                tipo: SalaDisponible._doc.type,
            };
        }
        else {
            const newRoom = await this.create({ 
                hablando: [iniciador],
                tipo: tipo,
                iniciadorChat: iniciador,
             });
            return {
                isNew: true,
                message: 'creando nueva sala de chat',
                chatRoomId: NetworkInformation._doc._id,
                tipo: newRoom._doc.type,
            };
        }
    } catch (error) {
        console.log('erro en metodo de empezar chat', error);
        throw error;
    }
};

SalasSchema.statics.getChatRoomByRoomId = async function (salaId) {
    try {
      const room = await this.findOne({ _id: salaId });
      return room;
    } catch (error) {
      console.log("NO SE PUDO ENCONTRAR SALA: ERROR EN MODEL");
      throw error;
    }
  }

const Sala = mongoose.model('Salas', SalasSchema);

module.exports = Sala;
module.exports = CHAT_ROOM_TYPES;
//export default mongoose.model("Salas", chatRoomSchema);