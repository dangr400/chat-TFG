/**
 * @file Controlador de peticiones para el modelo usuarios
 * @author Daniel Gomez Rodriguez
 * @since 02.10.2021
 */
const db = require("../models");
const Usuarios = db.Usuarios;

// Crear y guardar un nuevo Usuario
exports.create = (req, res) => {
  // Validar peticion
  if (!req.body.nombre || !req.body.contra) {
    res.status(400).send({ message: "Necesario nombre de usuario y contraseña" });
    return;
  }

  // Crear un Usuario
  const usuario = new Usuario({
    nombre: req.body.title,
    contra: req.body.contra
  });

  // Guardar Usuario en la base de datos
  Usuarios
    .save(usuario)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Algun error ha sucedido mientras se creaba el usuario."
      });
    });
};

// Recuperar todos los usuarios en la base de datos dada una condicion
exports.findAll = (req, res) => {
    // recuperar el nombre en de la petición para la condicion
    const nombre = req.query.nombre;
    var condicion = nombre ? { nombre: { $regex: new RegExp(nombre), $options: "i" } } : {};
  
    Usuarios.find(condicion)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algun error ha sucedido mientras se recuperaban los usuarios."
        });
      });
};

// Encontrar un unico usuario por el id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Tutorial.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "No se ha encontrado ningun usuario con id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error recuperando usuario con id " + id });
      });
};

// Actualizar Usuario por el id en la peticion
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "La información para la actualización no puede ir vacía"
        });
      }
    
      const id = req.params.id;
    
      Usuarios.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `No se puede actualizar el usuario con id=${id}. Puede deberse a que no se ha encontrado el usuario.`
            });
          } else res.send({ message: "Usuario actualizado correctamente." });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error en la actualización del usuario con id " + id
          });
        });
};

// Eliminar usuario con la id especificada en la peticion
exports.delete = (req, res) => {
    const id = req.params.id;

    Usuarios.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `No se puede eliminar el usuario con id=${id}. Puede deberse a que no se ha encontrado el usuario.`
          });
        } else {
          res.send({
            message: "Usuario eliminado correctamente."
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "No se ha podido eliminar el usuario con id " + id
        });
      });
};

// Borrar todos los usuarios de la base de datos
exports.deleteAll = (req, res) => {
    Usuarios.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Usuarios eliminados!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ha ocurrido un error mientras se eliminaban los usuarios."
      });
    });
};

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};