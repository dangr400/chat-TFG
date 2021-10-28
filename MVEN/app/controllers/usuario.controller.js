const config = require("../config/auth.config");
const db = require("../models");
const User = db.usuario;
const Grupos = db.grupos;

exports.verContactos = (req, res) => {
  User.findById(req.body.userID, 'contactos')
    .populate('contactos')
    .exec((err, contact) => {
      if (err) {
        res.status(500).send({message: "error en el servidor"});
      }
      if (!contact){
        return res.status(404).send({ message: "No existe el usuario." });
      }
      let listaContactos = [];
      contact.contactos.forEach(element => listaContactos.push(element.username))
      res.status(200).send(listaContactos);
    });
}

exports.enviarPeticionContacto = (req, res) => {
  User.findByIdAndUpdate(req.userId, {$push: {peticiones_contacto_enviadas: req.body.contactoId}})
  User.findByIdAndUpdate(
    req.userId,
    {$push:
      {
        peticiones_contacto_enviadas: req.body.contactoId
      }
    },
    function (err, exito) {
      if (err){
        res.status(500).send({message: "no se ha podido enviar la peticion"})
      }
      else {
        res.status(200).send({message: "peticion enviada"})
      }
    }
  )
}

exports.misGrupos = (req, res) => {
  User.findOne({username: req.body.username})
  .exec((err, user) => {
    if (err) {
      res.status(500).send({ message: "error en el servidor"});
    }
    Grupos.find({creador: user._id})
    .exec((err, grupos) => {
      if (err) {
        res.status(500).send({ message: "grupos no encontrados"});
      }
      res.status(200).send(grupos);
    })
  })
}

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