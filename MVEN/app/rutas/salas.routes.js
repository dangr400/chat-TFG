const { authJwt } = require("../middlewares");
const controller = require("../controllers/salas.controller");

module.exports = function(app){
    app.use(function(req,res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });


    app.get('/chat/', [authJwt.verifyToken], controller.getRecentConversation);
    app.get('/chat/:roomId', [authJwt.verifyToken], controller.getConversationByRoomId);
    app.get('/chat/initiateGrupos', [authJwt.verifyToken], controller.initiateGrupos);
    app.get('/chat/initiateUsuarios', [authJwt.verifyToken], controller.initiateUsuarios);
    app.post('/chat/:roomId/message', [authJwt.verifyToken], controller.postMessage);
    app.put('/chat/:roomId/mark-read', [authJwt.verifyToken], controller.markConversationReadByRoomId);
}

