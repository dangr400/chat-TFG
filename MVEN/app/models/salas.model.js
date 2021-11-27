const mongoose = require("mongoose");

const SalasSchema = new mongoose.Schema(
        {
            hablando: [
                {type: mongoose.Schema.Types.ObjectId, ref: "usuarios"}
            ],
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
        grupoId: grupo
        });
        if (SalaDisponible) {
            SalaDisponible._doc.hablando.push(iniciador);
            SalaDisponible.save();
            return {
                isNew: false,
                message: 'retornando una sala de chat antigua',
                chatRoomId: SalaDisponible._doc._id,
                hablando: SalaDisponible._doc.hablando,
            };
        }
        else {
            const newRoom = await this.create({ 
               hablando: [iniciador],
               grupoId: grupo,
            });
            return {
                isNew: true,
                message: 'creando nueva sala de chat',
                chatRoomId: newRoom._doc._id,
            };
        }
    } catch (error) {
        console.log('erro en metodo de empezar chat', error);
        throw error;
    }
};

SalasSchema.statics.iniciarChatUsuarios = async function (usuarios) {
    try{
        const SalaDisponible = await this.findOne({
        hablando: {
            $all: [...usuarios],
        },
        grupoId: null,
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
                hablando: [...usuarios],
             });
            return {
                isNew: true,
                message: 'creando nueva sala de chat',
                chatRoomId: newRoom._doc._id,
                tipo: newRoom._doc.type,
            };
        }
    } catch (error) {
        console.log('erro en metodo de empezar chat', error);
        throw error;
    }
};

SalasSchema.statics.addHablante = async function (salaId, usuarioId) {
    try {
        const sala = await this.findById(salaId);
        if (sala) {
            sala._doc.hablando.push(usuarioId);
            sala.save();
            return sala;
        }
        else {
            console.log("no se encontró la sala");
        }
    } catch( error ) {
        console.log(error);
    }
};

SalasSchema.statics.salirHablante = async function (salaId, usuarioId) {
    try {
        const sala = await this.findById(salaId);
        if (sala) {
            const indexUsuario = sala._doc.hablando.indexOf(usuarioId);
            if (indexUsuario > -1) {
                sala._doc.hablando.splice(indexUsuario, 1);
            }
            else {
                console.log("usuario no registrado en la sala");
                
            }
            sala.save();
            return sala;
        }
        else {
            console.log("no se encontró la sala");
        }
    } catch( error ) {
        console.log(error);
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
};

const Salas = mongoose.model('Salas', SalasSchema);

module.exports = Salas;
//export default mongoose.model("Salas", chatRoomSchema);