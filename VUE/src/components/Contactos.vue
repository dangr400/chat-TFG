<template>
  <div>
    <div class="col-md-8">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Buscar contacto por nombre"
          v-model="username"/>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button"
            @click="searchNombre"
          >
            Buscar
          </button>
        </div>
      </div>
    </div>

    <div class="container">
        <h3>
        <strong>Contactos</strong>
      </h3>
      <ul class="list-group">
        <li class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(usuario, index) in usuarios"
          :key="index"
          @click="setActiveContacto(usuario, index)"
        >
          {{ usuario.username }}
        </li>
      </ul>
      <div class="col-md-6">
        <div v-if="currentContacto">
            <h4>Contacto</h4>
            <div>
            <label><strong>Nombre:</strong></label> {{ currentContacto.username }}
            </div>
            <div>
            <label><strong>Email:</strong></label> {{ currentContacto.email }}
            </div>

            <button class="badge badge-danger"
            @click="eliminarContacto(currentContacto)"
            >
            Eliminar Contacto
            </button>
        </div>
        <div v-else>
            <br />
            <p>Seleccione Contacto...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from "../services/user.service";
export default {
  name: "usuarios-list",
  data() {
    return {
      usuarios: [],
      currentContacto: null,
      currentIndex: -1,
      username: ""
    };
  },
  methods: {
    recuperarContactos() {
      UserService.getContactos()
        .then(response => {
          this.usuarios = response.data.contactos;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    refreshList() {
      this.recuperarContactos();
      this.currentContacto = null;
      this.currentIndex = -1;
    },

    setActiveContacto(usuario, index) {
      this.currentContacto = usuario;
      this.currentIndex = index;
    },

    removeAllContactos() {
      UserService.deleteAll()
        .then(response => {
          console.log(response.data);
          this.refreshList();
        })
        .catch(e => {
          console.log(e);
        });
    },

    eliminarContacto(usuario) {
      UserService.eliminarContacto(usuario)
        .then(response => {
          console.log(response.data);
          this.refreshList();
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    searchNombre() {
      UserService.getContactoPorNombre(this.username)
        .then(response => {
          this.usuarios = response.data.contactos;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.recuperarContactos();
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