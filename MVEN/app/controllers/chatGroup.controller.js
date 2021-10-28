const db = require("../models");
const Grupo = db.chatgroup;
const Usuario = db.usuario;

exports.crearGrupo = (req, res) => {
    const grupo = new Grupo({
        nombre: req.body.nombre,
        creador: req.body.idusuario,
        moderadores: [],
        integrantes: [req.body.idusuario],
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

exports.gruposPublicos = (req, res) => {
  Grupo.find({publico: true})
  .exec((err, grupos) => {
    if (err) {
      res.status(500).send({ message: err});
    }
    res.status(200).send("x")
  });
}

exports.agregarUsuario = (req, res) => {
    Grupo.findById(req.body.id)
      .exec((err, grupo) => {
        if (err) {
          res.status(500).send({ message: err });
        return;
        }
        if (!grupo) {
          return res.status(404).send({ message: "Grupo no encontrado." });
        }
        Usuario.findOne({username: req.body.username}).exec((err,user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado." });
          }
          grupo.integrantes.push(user.id);
          grupo.save();
        })
      });
};
