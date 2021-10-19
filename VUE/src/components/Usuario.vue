<template>
  <div v-if="usuarioActual" class="edit-form">
    <h4>Tutorial</h4>
    <form>
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input type="text" class="form-control" id="nombre"
          v-model="usuarioActual.nombre"
        />
      </div>
      <div class="form-group">
        <label for="contra">Contraseña</label>
        <input type="text" class="form-control" id="contra"
          v-model="usuarioActual.contra"
        />
      </div>

    </form>

    <button class="badge badge-danger mr-2"
      @click="eliminarUsuario"
    >
      Eliminar
    </button>

    <button type="submit" class="badge badge-success"
      @click="actualizarUsuario"
    >
      Actualizar
    </button>
    <p>{{ message }}</p>
  </div>

  <div v-else>
    <br />
    <p>Por favor haga click en un usuario...</p>
  </div>
</template>

<script>
import UsuariosDataService from "../services/UsuariosDataService";

export default {
  name: "tutorial",
  data() {
    return {
      usuarioActual: null,
      message: ''
    };
  },
  methods: {
    getUsuario(id) {
      UsuariosDataService.get(id)
        .then(response => {
          this.usuarioActual = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    updatePublished(status) {
      var data = {
        id: this.usuarioActual.id,
        nombre: this.usuarioActual.nombre,
        contra: this.usuarioActual.contra,
        published: status
      };

      UsuariosDataService.update(this.usuarioActual.id, data)
        .then(response => {
          this.usuarioActual.published = status;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    actualizarUsuario() {
      UsuariosDataService.update(this.usuarioActual.id, this.usuarioActual)
        .then(response => {
          console.log(response.data);
          this.message = 'Usuario actualizado correctamente';
        })
        .catch(e => {
          console.log(e);
        });
    },

    eliminarUsuario() {
      UsuariosDataService.delete(this.usuarioActual.id)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "usuarios" });
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.message = '';
    this.getUsuario(this.$route.params.id);
  }
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>