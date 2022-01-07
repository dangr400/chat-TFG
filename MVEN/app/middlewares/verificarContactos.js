// Módulo de funciones para verificaciones referentes a los contactos
// Autor: Daniel Gómez Rodríguez
// Referencias: Bezkoder

const db = require("../models");
const Peticion = db.peticion;
const Usuario = db.usuario;

// Comprueba si existe el usuario al que se le envia la peticion
const comprobarExisteUsuario = (req, res, next) => {
    Usuario.findOne({ username: req.body.nombre})
    .exec((err, usuario) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: err});
            return;
        }
        if (!usuario) {
            res.status(404).send({message: "no existe el usuario"});
            return;
        }
        next();
    });
}

// Comprueba si el usuario ya forma parte de la lista de contactos
const comprobarContactoAgregado = (req, res, next) => {
    Usuario.findById(req.userId, 'contactos')
    .exec((err, contactos) => {
        if (err) {
            res.status(500).send({ message: err});
            return;
        }
        
        if (Object.values(contactos).includes(req.body.nombre)) {
            res.status(400).send({message: "usuario ya agregado a contactos"});
            return;
        }
        next();
    });
};

/**
 * Función para comprobar si la peticion de contacto ya existe
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns {any}
 */
const comprobarPeticionExistente = (req, res, next) => {
    Usuario.findOne({ username: req.body.nombre})
    .exec((err, usuario) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: err});
            return;
        }
        Peticion.findOne({idEmisor: req.userId, idReceptor: usuario._id})
        .exec((err, peticion) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err});
                return;
            }
            if (peticion) {
                res.status(400).send({ message: "Ya existe la peticion"});
                return;
            }
            next();
    });
    })
};

const verificarContactos = {
    comprobarPeticionExistente,

    comprobarContactoAgregado,
    comprobarExisteUsuario

};

module.exports = verificarContactos;
