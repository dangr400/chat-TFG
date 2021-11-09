<template>
  <div>
      <div class="col-md-8">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Buscar por nombre"
          v-model="nombre"/>
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
        <strong>Conversaciones</strong>
      </h3>
      <button class="btn btn-outline-secondary" type="button"
        @click="seleccionarGrupos"
        >
        Grupos
      </button>

      <button class="btn btn-outline-secondary" type="button"
            @click="seleccionarUsuarios"
        >
            Usuarios
      </button>
        
      <ul v-if="verUsuarios" class="list-group">
        <li class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(usuario, index) in usuarios"
          :key="index"
          @click="iniciarChatUsuario(usuario)"
        >
          {{ usuario.username }}
        </li>
      </ul>
      <ul v-if="verGrupos" class="list-group">
        <li class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(grupo, index) in grupos"
          :key="index"
          @click="iniciarChatGrupo(grupo)"
        >
          {{ grupo.nombre }}
        </li>
      </ul>
    </div>
    <chat v-if="enChat" :grupo="currentGrupo"></chat>

  </div>
</template>

<script>

import GruposService from "../services/grupos.service";
import UserService from "../services/user.service";
import chat from "./Chat.vue";

export default {
    components: {
        chat,
    },
    name: "conversaciones-list",

    data() {
        return {
            // para grupos
            grupos: [],
            currentGrupo: null,
            nombre: "",
            integrantes: [],
            tienePermisos: false,
            // para usuarios
            usuarios: [],
            currentContacto: null,
            username: "",
            // compartidas
            currentIndex: -1,
            verUsuarios: false,
            verGrupos: false,
            enChat: false,
        };
    },

    methods: {

        seleccionarGrupos() {
            this.verGrupos = true;
            this.verUsuarios = false;
        },

        seleccionarUsuarios() {
            this.verGrupos = false;
            this.verUsuarios = true;
        },

        recuperarGrupos() {
            GruposService.getGrupos()
                .then(response => {
                this.grupos = response.data;
                console.log(response.data);
                })
                .catch(e => {
                console.log(e);
                });
        },

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

        iniciarChatGrupo(grupo) {
            console.log(grupo);
            this.enChat = true;
        },

        iniciarChatUsuario(usuario) {
            console.log(usuario);
            this.$router.push({path: `/chatU/${usuario._id}`})
        },
    },
    mounted() {
        this.recuperarGrupos();
        this.recuperarContactos();
    },
}
</script>

<style>

</style>