<template>
    <div class="container">
    <header class="jumbotron">
      <h3><strong>Detalles del grupo {{this.$route.params.id}}</strong></h3>
    </header>
    <div class="container">
        <header class="jumbotron">
            <h3><strong>Creador</strong></h3>
            <h4><p>{{creador}}</p></h4>
        </header>
        

        <header class="jumbotron">
            <h3><strong>Moderadores</strong></h3>
            <span>
              <button class="btn btn-success"
               data-toggle="modal" data-target="#nuevosModeradores"
              >
               Añadir Moderadores
              </button>
            </span>
            <ul class="list-group">
                <li class="list-group-item"
                :class="{ active: index == currentIndex }"
                v-for="(moderador, index) in moderadores"
                :key="index"
                @click="setActiveModerador(moderador, index)"
                >
                {{ moderador.username }}
                </li>
            </ul>
        </header>
        
        <header class="jumbotron">
            <h3><strong>Integrantes</strong></h3>
            <span>
              <button class="btn btn-success"
                data-toggle="modal" data-target="#nuevosIntegrantes"
              >
              Añadir Usuarios
              </button></span>
            <ul class="list-group">
                <li class="list-group-item"
                :class="{ active: index == currentIndex }"
                v-for="(integrante, index) in integrantes"
                :key="index"
                @click="setActiveIntegrante(moderador, index)"
                >
                    {{ integrante.username }}
                </li>
        </ul>
        </header>
        
    </div>
    <!-- MODAL MODERADORES -->
        <div class="modal fade" id="nuevosModeradores" tabindex="-1" role="dialog" aria-labelledby="nuevosModeradoresLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="nuevosModeradoresLabel">Agregar Moderadores</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <Form @submit="addModeradores">
                  <div class="form-group">
                      <select v-model="listaMods" class="select" multiple>
                        <option class="list-group-item"
                        :class="{ active: index == indexUsuarios }"
                        v-for="(integrante, index) in integrantes"
                        :key="index"
                        :value="integrante._id"
                        >
                            {{integrante.username}}
                        </option>
                    </select>
                    <br>
                    <label class="form-label select-label">Seleccione usuarios</label>
                    <p>{{ listaMods }}</p>
                    <ErrorMessage name="visibilidad" class="error-feedback" />
                  </div>
                  <div class="form-group">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="submit" class="btn btn-primary">Añadir Usuarios</button>
                  </div>
                </Form>
                
              </div>
            </div>
          </div>
        </div>

      <!-- MODAL INTEGRANTES -->
        <div class="modal fade" id="nuevosIntegrantes" tabindex="-1" role="dialog" aria-labelledby="nuevosIntegrantesLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="nuevosIntegrantesLabel">Añadir integrantes</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <Form @submit="addIntegrantes">
                  <div class="form-group">
                      <select v-model="nuevosIntegrantes" class="select" multiple>
                        <option class="list-group-item"
                        :class="{ active: index == indexContactos }"
                        v-for="(usuario, index) in contactosUsr"
                        :key="index"
                        :value="usuario._id"
                        >
                            {{usuario.username}}
                        </option>
                    </select>
                    <br>
                    <label class="form-label select-label">Seleccione usuarios</label>
                    <p>{{ nuevosIntegrantes }}</p>
                    <ErrorMessage name="visibilidad" class="error-feedback" />
                  </div>
                  <div class="form-group">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="submit" class="btn btn-primary">Añadir Usuarios</button>
                  </div>
                </Form>
                
              </div>
            </div>
          </div>
        </div>
        
  </div>
</template>

<script>
import { Form, ErrorMessage } from "vee-validate";
import gruposService from '../services/grupos.service';
import UserService from '../services/user.service';

export default {
    components: {
        Form,
        ErrorMessage,
    },
    data() {

        return {
            // grupos
            grupo: null,
            integrantes: [],
            moderadores: [],
            creador: null,
            username: null,
            contactos: null,
            currentIndex: -1,
            indexUsuarios: -1,
            // para formularios nuevos moderadores e integrantes
            verNuevoModerador: false,
            verNuevoIntegrante: false,
            listaMods: [],
            options: [],
            // para agregar integrantes
            contactosUsr: [],
            indexContactos: -1,
            nuevosIntegrantes: [],
        };
    },

    methods: {

        getContactosUsr() {
          UserService.getContactos()
          .then(response => {
            console.log("Contactos:");
            console.log(response);
            this.contactosUsr = response.data.contactos;
          })
          .catch(e => {
            console.log(e);
          })
        },

        getGrupo() {
          const idGrupo = this.$route.params.id;
          console.log(idGrupo);
          gruposService.getGrupoPorId(idGrupo)
          .then(response => {
            console.log(response);
            this.grupo = response.data.grupo;
            this.integrantes = response.data.grupo.integrantes;
            this.moderadores = response.data.grupo.moderadores;
            this.creador = response.data.grupo.creador.username;
            this.username = response.data.grupo.username;
          })
          .catch(e => {
            console.log(e);
          }); 
        },

        addModeradores() {
            gruposService.añadirModeradores(this.grupo._id, this.listaMods)
            .then(response => {
              console.log(response);
              this.$router.go(0);
            })
            .catch(e => {
              console.log(e);
            })
        },

        addIntegrantes() {
          gruposService.añadirIntegrantes(this.grupo._id, this.nuevosIntegrantes)
          .then(response => {
              console.log(response);
              this.$router.go(0);
            })
            .catch(e => {
              console.log(e);
            })
        }

        
    },

    mounted() {
        this.getGrupo();
        this.getContactosUsr();
    }
}
</script>

<style>

</style>