const { authJwt } = require("../middlewares");
const controller = require("../controllers/chatGroup.controller");

module.exports = function(app) {
    app.use(function(req,res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
          );
          next();
    });

    app.post("/api/grupos/crear-grupo", [authJwt.verifyToken], controller.crearGrupo);

    app.post("/api/grupos/add-usuario", [authJwt.verifyToken], controller.agregarUsuario);

    app.get("/api/grupos/grupos-publicos", [authJwt.verifyToken], controller.gruposPublicos);
};