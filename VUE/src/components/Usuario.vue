<template>
  <div class="container">
    <header v-if="getUsuario" class="jumbotron">
      <h3>Pantalla de contactos</h3>
    </header>
    <header v-else class="jumbotron">
      <h3>No ha iniciado sesion</h3>
    </header>
    
  </div>
</template>

<script>
import UserService from "../services/user.service";

export default {
  name: "usuarios",
  data() {
    return {
      usuarioActual: null,
      message: '',

    };
  },
  methods: {
    getUsuario() {
      return this.$store.state.auth.user;
    },

    updatePublished(status) {
      var data = {
        id: this.getUsuario.id,
        nombre: this.getUsuario.nombre,
        contra: this.getUsuario.contra,
        published: status
      };

      UserService.update(this.getUsuario.id, data)
        .then(response => {
          this.getUsuario.published = status;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    actualizarUsuario() {
      UserService.update(this.getUsuario.id, this.getUsuario)
        .then(response => {
          console.log(response.data);
          this.message = 'Usuario actualizado correctamente';
        })
        .catch(e => {
          console.log(e);
        });
    },

    eliminarUsuario() {
      UserService.delete(this.getUsuario.id)
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
    this.getUsuario();
  }
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>