const mongoose = require("mongoose");

const Rol = mongoose.model(
  "rols",
  new mongoose.Schema({
    name: String
  })
);

module.exports = Rol;