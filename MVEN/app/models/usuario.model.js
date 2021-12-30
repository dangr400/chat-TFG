/**
 * @file Módulo que describe el esquema de un usuario en la BD.
 * @author Daniel Gomez Rodriguez
 * @since 02.10.2021
 * @returns mongoose.model
 */
const mongoose = require("mongoose");

const UsuarioSchema = 
  new mongoose.Schema({
    username: String,
    email: String,
    password: {type: String, select: false},
    configuracion: 
      {
        publico: {type: Boolean, default: false},
        persistencia_msgs: {type: Boolean, default: false}
      },
    contactos:
      [
        {type: mongoose.Schema.Types.ObjectId, ref: "usuarios"}
      ]
      
  },
  {
    timestamps : true,
    collection : "usuarios",
  });

UsuarioSchema.statics.getUserByIds = async function (ids) {
  try {
    const users = await this.find({ _id: { $in: ids } });
    return users;
  } catch (error) {
    console.log("ERROR ENCONTRANDO USUARIO");
    throw error;
  }
}

UsuarioSchema.statics.getUserIdByName = async function (nombre) {
  try {
    const usuario = await this.findOne({ username: nombre });
    return usuario._id;
  } catch (error) {
    console.log("Error buscando usuario:\n" + error);
    throw error;
  }
  
}

UsuarioSchema.statics.permanenciaMsgs = async function (id) {
  try {
    const usuario = await this.findById(id, 'configuracion');
    return usuario.configuracion.persistencia_msgs;
  } catch(error) {
    console.log("Error recuperando permisos de usuario:\n" + error);
    throw error;
  }
}

const Usuario = mongoose.model("usuarios", UsuarioSchema);
module.exports = Usuario;