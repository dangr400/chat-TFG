<template>
  <div>
    <div class="col-md-8">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Enviar peticion al usuario..."
          v-model="nombreUsrPeticion"/>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button"
            @click="enviarPeticion()"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>

    <div class="container">
        <h3>
        <strong>Peticiones de Contacto</strong>
      </h3>
      <ul class="list-group">
        <li class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(peticion, index) in peticiones"
          :key="index"
          @click="setActivePeticion(peticion, index)"
        >
          {{ peticion.idEmisor.username }}
        </li>
      </ul>
      <div class="col-md-6">
        <div v-if="currentPeticion">
            <h4>Peticion</h4>
            <div>
            <label><strong>Nombre:</strong></label> {{ currentPeticion.idEmisor.username }}
            </div>
            <div>
            <label><strong>Fecha:</strong></label> {{ currentPeticion.createdAt }}
            </div>

            <button class="badge badge-success"
            @click="aceptarPeticion(currentPeticion)"
            >
            Aceptar
            </button>
            <button class="badge badge-danger"
            @click="cancelarPeticion(currentPeticion)"
            >
            Denegar
            </button>
        </div>
        <div v-else>
            <br />
            <p>Seleccione Peticion...</p>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
import UserService from "../services/user.service";
export default {
  name: "peticiones-list",
  data() {
    return {
      peticiones: [],
      currentPeticion: null,
      currentIndex: -1,
      username: "",
      nombreUsrPeticion: "",
    };
  },
  methods: {
    recuperarPeticiones() {
      UserService.getPeticionesPendientes()
        .then(response => {
          this.peticiones = response.data.peticiones;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    enviarPeticion() {
      UserService.enviarPeticionContacto(this.nombreUsrPeticion)
        .then(response => {
          this.nombreUsrPeticion = "";
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    aceptarPeticion(peticion) {
        UserService.aceptarPeticion(peticion)
            .then(response => {
                console.log(response.data);
                this.refreshList();
            })
            .catch(e => {
                console.log(e);
            });
    },

    cancelarPeticion(peticion) {
        UserService.cancelarPeticion(peticion)
            .then(response => {
                console.log(response.data);
                this.refreshList();
            })
            .catch(e => {
                console.log(e);
            });
            
    },

    refreshList() {
      this.recuperarPeticiones();
      this.currentPeticion = null;
      this.currentIndex = -1;
    },

    setActivePeticion(peticion, index) {
      this.currentPeticion = peticion;
      this.currentIndex = index;
    },

    removeAllPeticiones() {
      UserService.deleteAll()
        .then(response => {
          console.log(response.data);
          this.refreshList();
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    searchNombre() {
      UserService.getPeticionPorNombre(this.username)
        .then(response => {
          this.peticiones = response.data.peticiones;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.recuperarPeticiones();
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