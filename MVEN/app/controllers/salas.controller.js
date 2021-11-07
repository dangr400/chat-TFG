const makeValidation = require('@withvoid/make-validation');
const { Salas }  = require("../models/salas.model");
const Mensajes = require("../models/mensaje.model");
const Usuarios = require("../models/usuario.model");

exports.initiateGrupos = async (req, res) => {
    try {
      const { userId: iniciadorChat } = req.userId;
      const allUserIds = [iniciadorChat];
      const chatRoom = await Salas.iniciarChat(allUserIds, iniciadorChat);
      return res.status(200).json({ success: true, chatRoom });
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
};

exports.initiateUsuarios = async (req, res) => {
  try {
    const { hablando, tipo } = req.body;
    const { userId: iniciadorChat } = req;
    const allUserIds = [...hablando, iniciadorChat];
    const chatRoom = await Salas.iniciarChat(allUserIds, tipo, iniciadorChat);
    return res.status(200).json({ success: true, chatRoom });
  } catch (error) {

    return res.status(500).json({ success: false, message: error });
  }
};

exports.postMessage = async (req, res) => {
    try {
      const { salaId } = req.params;
      const validacion = makeValidation(types => ({
        payload: req.body,
        checks: {
          messageText: { type: types.string },
        }
      }));
      if (!validacion.success) return res.status(400).json({ ...validacion });
  
      const messagePayload = {
        messageText: req.body.messageText,
      };
      const usuarioLogueado = req.userId;
      const post = await Mensajes.createPostInChatRoom(salaId, messagePayload, usuarioLogueado);
      global.io.sockets.in(salaId).emit('new message', { message: post });
      return res.status(200).json({ success: true, post });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  };

exports.getRecentConversation = async (req, res) => {
try {
    const usuarioLogueado = req.userId;
    const opciones = {
    page: parseInt(req.query.page) || 0,
    limit: parseInt(req.query.limit) || 10,
    };
    const salas = await Salas.getChatRoomsByUserId(usuarioLogueado);
    const salasIds = salas.map(sala => sala._id);
    const recentConversation = await Mensajes.getRecentConversation(
    salasIds, opciones, usuarioLogueado
    );
    return res.status(200).json({ success: true, conversation: recentConversation });
} catch (error) {
    return res.status(500).json({ success: false, error: error })
}
},

exports.getConversationByRoomId = async (req, res) => {
    try {
      const { salaId } = req.params;
      const sala = await Salas.getChatRoomByRoomId(salaId)
      if (!sala) {
        return res.status(400).json({
          success: false,
          message: 'No existe una sala con este id',
        })
      }
      const users = await Usuarios.getUserByIds(sala.userIds);
      const opciones = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
      };
      const conversation = await Mensajes.getConversationByRoomId(salaId, opciones);
      return res.status(200).json({
        success: true,
        conversation,
        users,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
};

exports.markConversationReadByRoomId = async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await Salas.getChatRoomByRoomId(roomId)
      if (!room) {
        return res.status(400).json({
          success: false,
          message: 'No room exists for this id',
        })
      }

      const currentLoggedUser = req.userId;
      const result = await Mensajes.markMessageRead(roomId, currentLoggedUser);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error });
    }
  };