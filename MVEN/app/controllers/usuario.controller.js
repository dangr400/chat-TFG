const config = require("../config/auth.config");
const db = require("../models");
const User = db.usuario;
const Grupos = db.grupos;
const Peticion = db.peticion;

exports.verContactos = (req, res) => {
  User.findById(req.userId, 'contactos')
    .populate("contactos")
    .exec((err, contact) => {
      if (err) {
        res.status(500).send({message: "error en el servidor"});
      }
      if (!contact){
        res.status(404).send({ message: "No existe el usuario." });
        return;
      }
      let listaContactos = [];
      contact.contactos.forEach(element => listaContactos.push(element.username))
      res.status(200).send(contact);
    });
}

exports.enviarPeticionContacto = (req, res) => {
  const nuevaPeticion = new Peticion({
    idEmisor: req.userId,
    idReceptor: req.body.contactoId,
    estado: "PENDIENTE",
    fecha: new Date(),
  })
  nuevaPeticion.save((err, peticion) => {
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send({ message: "Peticion Enviada"});
  })
}

exports.aceptarPeticion = (req, res) => {
  Promise.all([
    Peticion.findById(req.body.peticionId),
    User.findById(req.userId),
    User.findById(req.body.emisorId)
  ]).then(([peticion, usuario1, usuario2]) => {
    usuario1.contactos.push(usuario2._id);
    usuario2.contactos.push(usuario1._id);
    usuario1.save();
    usuario2.save();
    peticion.delete();
    res.status(200).send({message: "Contacto añadido"});
  }).catch((error) => {
    console.log(error);
    res.status(500).send({message: "Hubo un error en el proceso"});
    return;
  });
}

exports.cancelarPeticion =(req, res) => {
  Peticion.findByIdAndDelete(req.body.peticionId)
  .exec((err, confirm) => {
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send({ message: "peticion cancelada"});
  })

}

exports.verMisPeticiones = (req, res) => {
  Peticion.find({idEmisor: req.userId})
  .populate("idReceptor")
  .exec((err, peticiones) =>{
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send(peticiones);
  })
}

exports.verPeticionesPendientes = (req, res) => {
  Peticion.find({idReceptor: req.userId})
  .populate("idEmisor")
  .exec((err, peticiones) =>{
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send(peticiones);
  })
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
        return;
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