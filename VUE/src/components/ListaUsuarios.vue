<template>
  <div class="list row">
    <div class="col-md-8">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Buscar por nombre"
          v-model="nombre"/>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button"
            @click="buscarNombre"
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <h4>Lista de Usuarios</h4>
      <ul class="list-group">
        <li class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(usuario, index) in usuarios"
          :key="index"
          @click="setActiveUsuario(usuario, index)"
        >
          {{ usuario.title }}
        </li>
      </ul>

      <button class="m-3 btn btn-sm btn-danger" @click="removeAllUsuarios">
        Remove All
      </button>
    </div>
    <div class="col-md-6">
      <div v-if="UsuarioActual">
        <h4>Usuario</h4>
        <div>
          <label><strong>Nombre:</strong></label> {{ UsuarioActual.nombre }}
        </div>
        <div>
          <label><strong>Contraseña:</strong></label> {{ UsuarioActual.contra }}
        </div>

        <a class="badge badge-warning"
          :href="'/usuarios/' + UsuarioActual.id"
        >
          Editar
        </a>
      </div>
      <div v-else>
        <br />
        <p>Haga click en un Usuario...</p>
      </div>
    </div>
  </div>
</template>

<script>
import UsuariosDataService from "../services/UsuariosDataService";

export default {
  name: "usuarios-list",
  data() {
    return {
      usuarios: [],
      UsuarioActual: null,
      currentIndex: 0,
      title: ""
    };
  },
  methods: {
    retrieveUsuarios() {
      UsuariosDataService.getAll()
        .then(response => {
          this.usuarios = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveUsuarios();
      this.UsuarioActual = null;
      this.currentIndex = -1;
    },

    setActiveUsuario(usuario, index) {
      this.UsuarioActual = usuario;
      this.currentIndex = index;
    },

    removeAllUsuarios() {
      UsuariosDataService.deleteAll()
        .then(response => {
          console.log(response.data);
          this.refreshList();
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    buscarNombre() {
      UsuariosDataService.findByName(this.title)
        .then(response => {
          this.usuarios = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.retrieveUsuarios();
  }
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>