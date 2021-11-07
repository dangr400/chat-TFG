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
        <strong>Grupos</strong>
      </h3>
      <ul class="list-group m-1">
        <li class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(grupo, index) in grupos"
          :key="index"
          @click="setActiveGrupo(grupo, index)"
        >
          {{ grupo.nombre }}
        </li>
      </ul>
      <div class="col-md-6">
        <div v-if="currentGrupo">
            <h4>Grupo</h4>
            <div>
            <label><strong>Nombre:</strong></label> {{ currentGrupo.nombre }}
            </div>
            <div>
            <label><strong>Integrantes:</strong></label>
            <li class="list-group"
                v-for="(integrante, num) in currentGrupo.integrantes"
                :key="num"
            >
          {{ integrante.username }}
            </li>
            </div>

            <router-link v-if="tienePermisos" class="badge badge-warning"
            :to="'/grupos/' + currentGrupo._id"
            >
            Editar
            </router-link>
        </div>
        <div v-else>
            <br />
            <p>Seleccione Grupo...</p>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
import GruposService from "../services/grupos.service";
export default {
  name: "grupos-list",
  data() {
    return {
      grupos: [],
      currentGrupo: null,
      currentIndex: -1,
      nombre: "",
      integrantes: [],
      tienePermisos: false,
    };
  },
  methods: {
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

    refreshList() {
      this.recuperarGrupos();
      this.currentGrupo = null;
      this.currentIndex = -1;
    },

    setActiveGrupo(grupo, index) {
      this.currentGrupo = grupo;
      this.currentIndex = index;
      this.integrantes = this.currentGrupo.integrantes;
      this.permisosGrupo();
    },

    permisosGrupo() {
        console.log(this.currentGrupo._id);
        GruposService.permisosGrupo(this.currentGrupo._id)
        .then(response => {
            console.log(response.data);
            this.tienePermisos = response.data.success;
        })
        .catch(e => {
          console.log(e);
        });
    },

    removeAllGrupos() {
      GruposService.deleteAll()
        .then(response => {
          console.log(response.data);
          this.refreshList();
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    searchNombre() {
      GruposService.getGrupoPorNombre(this.nombre)
        .then(response => {
          this.grupos = response.data.grupos;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.recuperarGrupos();
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