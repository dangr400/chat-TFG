const db = require("../models");
const Peticion = db.peticion;
const Usuario = db.usuario;

// Comprueba si el usuario ya forma parte de la lista de contactos
const comprobarContactoAgregado = (req, res, next) => {
    Usuario.findById(req.userId, 'contactos')
    .exec((err, usr) => {
        if (err) {
            res.status(500).send({ message: err});
            return;
        }
        let listaContactosIds = []
        usr.contactos.forEach(contacto => listaContactosIds.push(contacto.toString()));
        if (listaContactosIds.includes(req.body.contactoId)){
            res.status(400).send({message: "usuario ya agregado a contactos"});
            return;
        }
        next();
    });
};

// Comprueba si la peticion de contacto ya existe
const comprobarPeticionExistente = (req, res, next) => {
    Peticion.findOne({idEmisor: req.userId, idReceptor: req.body.contactoId})
    .exec((err, peticion) => {
        if (err) {
            res.status(500).send({ message: err});
            return;
        }
        if (peticion) {
            res.status(400).send({ message: "Ya existe la peticion"});
            return;
        }
        next();
    });
};

const verificarContactos = {
    comprobarPeticionExistente,
    comprobarContactoAgregado
};

module.exports = verificarContactos;
