const { authJwt , verificarGrupos } = require("../middlewares");
const controller = require("../controllers/chatGroup.controller");

module.exports = function(app) {
    app.use(function(req,res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
          );
          next();
    });

    app.post("/api/grupos/nuevoGrupo", [authJwt.verifyToken], controller.crearGrupo);

    app.delete("/api/grupos/eliminarGrupo", [authJwt.verifyToken], controller.eliminarGrupo);

    app.get("/api/grupos/misGrupos", [authJwt.verifyToken], controller.misGrupos);

    app.get("/api/grupos/gruposPertenecientes", [authJwt.verifyToken], controller.integranteEnGrupos);

    app.get("/api/grupos/permisosGrupo/:grupoId", [authJwt.verifyToken], controller.permisosGrupo);

    app.get("/api/grupos/gruposModerados", [authJwt.verifyToken], controller.moderadorEnGrupos);

    app.post("/api/grupos/agregarUsuario", [authJwt.verifyToken], [verificarGrupos.comprobarUsuarioAgregado], controller.agregarUsuario);

    app.get("/api/grupos/gruposPublicos", controller.gruposPublicos);

    app.get("/api/grupos/:id", [authJwt.verifyToken], controller.getGrupoPorId);

    app.put("/api/grupos/:id/addModeradores", [authJwt.verifyToken], controller.addModeradores);

    app.put("/api/grupos/:id/addIntegrantes", [authJwt.verifyToken], controller.addIntegrantes);
};