<template>
  <div class="submit-form">
    <div v-if="!submitted">
      <div class="form-group">
        <label for="nombre">Nombre de usuario</label>
        <input
          type="text"
          class="form-control"
          id="nombre"
          required
          v-model="usuario.nombre"
          name="nombre"
        />
      </div>

      <div class="form-group">
        <label for="contra">contraseña</label>
        <input
          class="form-control"
          id="contra"
          required
          v-model="usuario.contra"
          name="contra"
        />
      </div>

      <div class="form-group">
        <label for="contracheck">vuelva a escribir la contraseña</label>
        <input
          class="form-control"
          id="contracheck"
          required
          v-model="usuario.contracheck"
          name="contracheck"
        />
      </div>

      <button @click="saveUsuario" class="btn btn-success">Enviar</button>
    </div>

    <div v-else>
      <h4>Enviado correctamente</h4>
      <button class="btn btn-success" @click="newUsuario">Añadir usuario</button>
    </div>
  </div>
</template>

<script>
import UsuariosDataService from "../services/UsuariosDataService";

export default {
  name: "registrar-usuario",
  data() {
    return {
      usuario: {
        id: null,
        nombre: "",
        contra: "",
        contracheck: ""
      },
      submitted: false
    };
  },
  methods: {
    saveUsuario() {
      var data = {
        nombre: this.usuario.nombre,
        contra: this.usuario.contra,
        contracheck: this.usuario.contracheck
      };
      
      UsuariosDataService.create(data)
        .then(response => {
          this.usuario.id = response.data.id;
          console.log(response.data);
          this.submitted = true;
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    newUsuario() {
      this.submitted = false;
      this.usuario = {};
    }
  }
};
</script>

<style>
.submit-form {
  max-width: 300px;
  margin: auto;
}
</style>