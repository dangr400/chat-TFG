const db = require("../models");
const Grupo = db.grupos;

// Comprueba si el usuario ya forma parte del grupo
const comprobarUsuarioAgregado = (req, res, next) => {
    Grupo.find({integrantes: req.body.usuarioId})
    .exec((err, usr) => {
        if (err) {
            res.status(500).send({ message: err});
            return;
        }
        let listaContactosIds = []
        usr.contactos.forEach(contacto => listaContactosIds.push(contacto.toString()));
        if (listaContactosIds.includes(req.body.usuarioId)){
            res.status(400).send({message: "usuario ya agregado a grupo"});
            return;
        }
        next();
    });
};

const verificarGrupos = {
    comprobarUsuarioAgregado
};

module.exports = verificarGrupos;