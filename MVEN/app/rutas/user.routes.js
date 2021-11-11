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
  
  app.get("/usuarios", [authJwt.verifyToken], controller.getUsuario);

  app.get("/usuarios/contactos", [authJwt.verifyToken], controller.getContactos);

  app.get("/usuarios/contactos/:nombre", [authJwt.verifyToken], controller.getContactosNombre);

  /* TODO: FINALIZAR METODO PARA ELIMINAR CONTACTO */
  //app.delete("/usuarios/contactos/eliminarContacto", [authJwt.verifyToken], controller.eliminarContacto);

  app.post("/usuarios/enviarPeticion", [authJwt.verifyToken], [verificarContactos.comprobarExisteUsuario],[verificarContactos.comprobarContactoAgregado], [verificarContactos.comprobarPeticionExistente],  controller.enviarPeticionContacto);

  app.post("/usuarios/aceptarPeticion", [authJwt.verifyToken], controller.aceptarPeticion);

  app.delete("/usuarios/cancelarPeticion", [authJwt.verifyToken], controller.cancelarPeticion);

  app.get("/usuarios/verMisPeticiones", [authJwt.verifyToken], controller.verMisPeticiones);

  app.get("/usuarios/verPeticionesPendientes", [authJwt.verifyToken], controller.verPeticionesPendientes);

  app.get("/usuarios/misGrupos", [authJwt.verifyToken], controller.misGrupos);

  app.get("/usuarios/all", controller.allAccess);

  app.get("/usuarios/user/:userId", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/usuarios/mod",
    [authJwt.verifyToken],
    controller.moderatorBoard
  );

  app.get(
    "/usuarios/admin",
    [authJwt.verifyToken],
    controller.adminBoard
  );
};