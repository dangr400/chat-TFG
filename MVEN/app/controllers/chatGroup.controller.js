const db = require("../models");
const Grupo = db.grupos;
const Usuario = db.usuario;
const Mensaje = db.mensajeGrupo;

exports.crearGrupo = (req, res) => {
    const visibilidad = req.body.visibilidad ? true : false;
    const grupo = new Grupo({
        nombre: req.body.nombre,
        creador: req.userId,
        moderadores: [],
        integrantes: [req.userId],
        publico: visibilidad
      });

    grupo.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send({ message: "Grupo creado!" });
        return;
    });
};

exports.getGrupoPorId = (req, res) => {
  Grupo.findById(req.params.id)
  .populate("creador", "username")
  .populate("moderadores", "username")
  .populate("integrantes", "username")
  .exec((err, grupo) => {
    if (err) {
      console.log(err);
      res.status(500).send({success: false, message: "error en el servidor"});
      return;
    }
    if (!grupo){
      res.status(404).send({success: false, grupo, message: "no existe el grupo"});
      return;
    }
    res.status(200).send({success: true, grupo});
    return;
  })
}

exports.permisosGrupo = (req, res) => {
  Grupo.find({_id: req.params.grupoId , $or:[{creador: req.userId},{moderadores: req.userId}]})
  .exec((err, grupo) => {
    if (err) {
      res.status(404).send({success: false})
      return;
    }
    if (!grupo){
      res.status(200).send({success: false})
      return;
    }
    res.status(200).send({success: true, grupo});
    return;
  })
}

exports.nuevoMensaje = (req, res) => {
  const mensaje = new Mensaje({
    origen: req.userId,
    destino: req.body.grupoId,
    fecha: Date.now(),
    contenido: req.body.contenido
  });
  mensaje.save((err) => {
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send({ message: "ok"});
    return;
  })
};

exports.verMensajes = (req, res) => {
  Mensaje.find({destino: req.body.grupoId})
  .exec((err, msgs) => {
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send(msgs);
    return;
  })
};

exports.eliminarGrupo = (req, res) => {
  Grupo.findByIdAndDelete(req.body.grupoId)
  .exec((err) => {
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send({ message: "grupo eliminado"});
    return;
  });
};

exports.misGrupos = (req, res) => {
  Grupo.find({creador: req.userId})
  .exec((err, grupos) => {
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send(grupos);
    return;
  })
};

exports.integranteEnGrupos = (req, res) => {
  console.log("HOLA");
  Grupo.find({integrantes: req.userId})
  .populate("integrantes")
  .exec((err, grupos) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send(grupos);
    return;
  });
};

exports.moderadorEnGrupos = (req, res) => {
  Grupo.find({moderadores: req.userId})
  .exec((err, grupos) => {
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send(grupos);
    return;
  });
};

exports.gruposPublicos = (req, res) => {
  Grupo.find({publico: true})
  .exec((err, grupos) => {
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send(grupos);
    return;
  });
};

exports.agregarUsuario = (req, res) => {
    Grupo.findById(req.body.grupoId)
    .exec((err, grupo) => {
      if (err) {
        res.status(500).send({ message: err });
      return;
      }
      if (!grupo) {
        return res.status(404).send({ message: "Grupo no encontrado." });
      }
      Usuario.findById(req.body.usuarioId)
      .exec((err,user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!user) {
          res.status(404).send({ message: "Usuario no encontrado." });
          return;
        }
        grupo.integrantes.push(user._id);
        grupo.save();
        return;
      })
    });
};
