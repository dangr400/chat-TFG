const config = require("../config/auth.config");
const db = require("../models");
const User = db.usuario;
const Grupos = db.grupos;
const Peticion = db.peticion;

exports.getYo = (req, res) => {
  
  User.findById(req.userId)
  .exec((err, user) => {
    if (err) {
      res.status(500).send({message: "error en el servidor"});
    }
    if (!user){
      res.status(404).send({ message: "No existe el usuario." });
      return;
    }
    res.status(200).json({success: true, user});
  })
}

exports.getUsuario = (req, res) => {
  // Preformatear la entrada

  const idUsuario = req.body.usuario.id;
  User.getUserByIds(idUsuario)
  .exec((err, usuarios) => {
    if (err) {
      console.log(err);
      res.status(500).send({message: "error en el servidor"});
    }
    if (usuarios) {
      res.status(200).send({ success: true, usuarios});
    }
  });
}

exports.getContactos = (req, res) => {
  User.findById(req.userId, 'contactos')
    .populate("contactos")
    .exec((err, contact) => {
      if (err) {
        console.log(err);
        return res.status(500).send({message: "error en el servidor"});
        
      }
      if (!contact){
        return res.status(404).send({ message: "No hay contactos añadidos." });
        
      }
      const contactos = contact.contactos;
      res.status(200).json({success: true, contactos});
    });
}

exports.eliminarContacto = (req, res) => {
  User.findById(req.userId, 'contactos')
  .exec((err, contact) => {
    if (err) {
      console.log(err);
      return res.status(500).send({message: "error en el servidor"});
    }
    if (!contact){
      return res.status(404).send({ message: "No hay contactos añadidos." });
    }
    var contactosActualizado = contact.filter(function(value, index, arr){ 
      return value._id !== req.body._id;
    });
    User.findByIdAndUpdate(req.userId,{contactos: contactosActualizado})
    .exec((err, actualizacion) => {
      if (err) {
        console.log(err);
        return res.status(500).send({message: "error en el servidor"});
      }
      if (actualizacion){
        return res.status(200).send({ message: "Contacto eliminado" });
      }
    });
  })
}

exports.getContactosNombre = (req, res) => {
  const nombre = req.params.nombre;
  User.findById(req.userId, 'contactos')
    .populate("contactos")
    .exec((err, contact) => {
      if (err) {
        console.log(err);
        return res.status(500).send({message: "error en el servidor"});
      }
      if (!contact){
        return res.status(404).send({ message: "No hay contactos añadidos." });
      }
      const sinFiltro = contact.contactos;
      const contactos = [];
      sinFiltro.forEach(c => {
        if (c.username.match(new RegExp(nombre))) {
          contactos.push(c);
        }
      })  
      res.status(200).json({success: true, contactos});
    });
}

exports.enviarPeticionContacto = (req, res) => {
    User.getUserIdByName(req.body.nombre)
    .then(usuarioId => {
      const nuevaPeticion = new Peticion({
        idEmisor: req.userId,
        idReceptor: usuarioId,
        estado: "PENDIENTE",
        fecha: new Date(),
      });

      nuevaPeticion.save((err, peticion) => {
        if (err) {
          res.status(500).send({ success: false, message: err});
          return;
        }
        res.status(200).send({ success: true, message: "Peticion Enviada"});
      });

    }).catch(err => {
      res.status(500).send({ message: err});
    })
}

exports.aceptarPeticion = (req, res) => {
  Promise.all([
    Peticion.findById(req.body._id),
    User.findById(req.userId),
    User.findById(req.body.idEmisor._id)
  ]).then(([peticion, usuario1, usuario2]) => {
    usuario1.contactos.push(usuario2._id);
    usuario2.contactos.push(usuario1._id);
    usuario1.save();
    usuario2.save();
    peticion.delete();
    res.status(200).send({ success: true, message: "Contacto añadido"});
  }).catch((error) => {
    console.log(error);
    res.status(500).send({ success: false, message: "Hubo un error en el proceso"});
    return;
  });
}

exports.cancelarPeticion =(req, res) => {
  Peticion.findByIdAndDelete(req.body.peticion._id)
  .exec((err) => {
    if (err) {
      res.status(500).send({ success: true, message: err});
      return;
    }
    res.status(200).send({ success: true, message: "peticion cancelada"});
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
    res.status(200).json({success:true, peticiones});
  })
}

exports.verPeticionesPendientes = (req, res) => {
  Peticion.find({idReceptor: req.userId})
  .populate("idEmisor", "username")
  .exec((err, peticiones) =>{
    if (err) {
      console.log(err);
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).json({success:true, peticiones});
  })
}

exports.misGrupos = (req, res) => {
  Grupos.find({creador: req.userId})
  .exec((err, grupos) => {
    if (err) {
      res.status(500).send({ message: "grupos no encontrados"});
      return;
    }
    res.status(200).send(grupos);
  });
}

exports.eliminarUsuario = (req, res) => {
  User.findByIdAndDelete(req.userId)
  .exec((err, exito) =>{
    if (err) {
      res.status(500).send({ message: "No se pudo eliminar"});
      return;
    }
    res.status(200).send({ message: "usuario eliminado"});
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