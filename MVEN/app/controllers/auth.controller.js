// Módulo de funciones para la autorizacion al acceso de la aplicacion
// Autor: Daniel Gómez Rodríguez
// Referencias: Bezkoder

const config = require("../config/auth.config");
const db = require("../models");
const User = db.usuario;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

/**
 * Método para registrarse como usuario de la aplicación
 * @param {any} req cuerpo de la petición a la API
 * @param {any} res respuesta de la API
 * @returns {any} Respuesta 
 */
exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });
  if (!req.body.configuracion){
    user.configuracion = {publico: false, persistencia_msgs: false};
  }
  else{
    user.configuracion = req.body.configuracion;
  }
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send({ message: "Usuario Registrado"});
  });
};

/**
 * Método para acceder a la aplicación con unos credenciales de usuario
 * En caso de ser correctos, envia al usuario el JWT (Json Web Token) de la sesión
 * En caso de error, informa al usuario del error.
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
exports.signin = (req, res) => {
  // Se accede a los datos de los usuarios, tanto nombres como contraseña
  User.findOne({
    username: req.body.username
  })
    .select("+password")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      // En caso de no existir dicho usuario, detener comprobación y enviar respuesta
      if (!user) {
        return res.status(404).send({ message: "No existe el usuario." });
      }
      // Si existe, comprobar que la contraseña es correcta
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Contraseña inválida"
        });
      }
      // Si son correctos nombre y contraseña, enviar token e información del usuario.
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token
      });
    });
};