const { authJwt, verificarContactos } = require("../middlewares");
const controller = require("../controllers/usuario.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/contactos", [authJwt.verifyToken], controller.verContactos);

  app.post("/api/test/enviarPeticion", [authJwt.verifyToken], [verificarContactos.comprobarContactoAgregado], [verificarContactos.comprobarPeticionExistente],  controller.enviarPeticionContacto);

  app.post("/api/test/aceptarPeticion", [authJwt.verifyToken], controller.aceptarPeticion);

  app.delete("/api/test/cancelarPeticion", [authJwt.verifyToken], controller.cancelarPeticion);

  app.get("/api/test/verMisPeticiones", [authJwt.verifyToken], controller.verMisPeticiones);

  app.get("/api/test/verPeticionesPendientes", [authJwt.verifyToken], controller.verPeticionesPendientes);

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user/:userId", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken],
    controller.adminBoard
  );
};