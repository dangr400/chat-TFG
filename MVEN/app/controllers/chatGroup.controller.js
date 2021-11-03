const db = require("../models");
const Grupo = db.grupos;
const Usuario = db.usuario;
const Mensaje = db.mensajeGrupo;

exports.crearGrupo = (req, res) => {
    const grupo = new Grupo({
        nombre: req.body.nombre,
        creador: req.userId,
        moderadores: [],
        integrantes: [req.userId],
        publico: req.body.publico
      });

    grupo.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send({ message: "Grupo creado!" });
    });
};

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
  })
}

exports.verMensajes = (req, res) => {
  Mensaje.find({destino: req.body.grupoId})
  .exec((err, msgs) => {
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send(msgs);
  })
}

exports.eliminarGrupo = (req, res) => {
  Grupo.findByIdAndDelete(req.body.grupoId)
  .exec((err, exito) => {
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    console.log(exito);
    res.status(200).send({ message: "grupo eliminado"});
  });
}

exports.misGrupos = (req, res) => {
  Grupo.find({creador: req.userId})
  .exec((err, grupos) => {
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send(grupos);
  })
}

exports.integranteEnGrupos = (req, res) => {
  Grupo.find({integrantes: req.userId})
  .exec((err, grupos) => {
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send(grupos);
  });
}

exports.moderadorEnGrupos = (req, res) => {
  Grupo.find({moderadores: req.userId})
  .exec((err, grupos) => {
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send(grupos);
  });
}

exports.gruposPublicos = (req, res) => {
  Grupo.find({publico: true})
  .exec((err, grupos) => {
    if (err) {
      res.status(500).send({ message: err});
      return;
    }
    res.status(200).send(grupos);
  });
}

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
      })
    });
};
