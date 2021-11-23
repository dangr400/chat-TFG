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

        <button @click="activarModal" class="btn btn-success" data-toggle="modal" data-target="#nuevoGrupo">
            CrearGrupo
        </button>
        <!-- MODAL -->
        <div class="modal fade" id="nuevoGrupo" tabindex="-1" role="dialog" aria-labelledby="nuevoGrupoLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="nuevoGrupoLabel">Nuevo Grupo</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <Form @submit="crearGrupo" :validation-schema="schema">
                  <div class="form-group">
                    <label for="nombreGrupo" class="col-form-label">Nombre:</label>
                    <Field v-model="nuevoGrupo.nombre" type="text" name="nombre" class="form-control" id="nombreGrupo" />
                    <ErrorMessage name="nombre" class="error-feedback" />
                  </div>
                  <div class="form-group">
                    <label for="message-text" class="col-form-label">Visibilidad:</label>
                    <br>
                   
                    <label class="form-check-label col-form-label" for="radioPrivado">
                       <Field v-model="nuevoGrupo.visibilidad" class="form-check-input" type="radio" name="visibilidad" id="radioPrivado" value="0" checked />
                      Privado
                    </label>
                    <br>
                    
                    <label class="form-check-label col-form-label" for="radioPublico">
                      <Field v-model="nuevoGrupo.visibilidad" class="form-check-input " type="radio" name="visibilidad" id="radioPublico" value="1" />
                      Publico
                    </label>
                    <ErrorMessage name="visibilidad" class="error-feedback" />
                  </div>
                  <div class="form-group">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="submit" class="btn btn-primary">Crear Grupo</button>
                  </div>
                </Form>
                
              </div>
            </div>
          </div>
        </div>
        <!--
        <Modal @cerrar="activarModal" :modalActive="modalActive">
          <div class="modal-content">
            <h1>Cabecera</h1>
            <p>Texto</p>
          </div>
        </Modal>
        -->
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
            <br>
            <button v-if="esCreador" @click="borrarGrupo" class="badge badge-danger">
              BORRAR GRUPO
            </button>
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
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
//import Modal from '../components/Modal.vue';
//import {ref} from 'vue';

export default {
  name: "grupos-list",
  
  components: {
    Form,
    Field,
    ErrorMessage,
    //Modal,
  },
/*
  setup() {
    const modalActive = ref(true);
    const activarModal = () => {
      modalActive.value = !modalActive.value;
    }
    return {modalActive, activarModal};
  },
*/
  data() {
    const schema = yup.object().shape({
      nombre: yup.string().required("Introduzca un nombre para el grupo"),
      visibilidad: yup.string().required("seleccione una de las opciones"),
    });

    return {
      grupos: [],
      currentGrupo: null,
      currentIndex: -1,
      nombre: "",
      integrantes: [],
      tienePermisos: false,
      esCreador: false,
      schema,
      nuevoGrupo: {
        nombre: "",
        visibilidad: "",
      },
    };
  },
  methods: {

    crearGrupo() {
      console.log(this.nuevoGrupo);
      GruposService.nuevoGrupo(this.nuevoGrupo)
        .then(response => {
          console.log(response);
          this.$router.go(0);
        })
        .catch(e => {
          console.log(e);
        })
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
        GruposService.permisosGrupo(this.currentGrupo._id)
        .then(response => {
          console.log(response);
            this.tienePermisos = response.data.esModerador;
            this.esCreador = response.data.esCreador;
        })
        .catch(e => {
          console.log(e);
        });
    },

    borrarGrupo() {
      GruposService.borrarGrupo(this.currentGrupo)
      .then(response => {
        console.log(response);
        this.$router.go(0);
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