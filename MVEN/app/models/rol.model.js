const mongoose = require("mongoose");

const Rol = mongoose.model(
  "Rol",
  new mongoose.Schema({
    name: String
  })
);

module.exports = Rol;