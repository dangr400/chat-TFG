<template>
  <div class="container">
    <header class="jumbotron">
        <h3>
            <strong>Comunicaciones</strong>
        </h3>
        <button class="btn btn-outline-secondary" @click="activarContactos">Contactos</button>
        <button class="btn btn-outline-secondary" @click="activarGrupos">Grupos</button>
        <button class="btn btn-outline-secondary" @click="activarPeticiones">Peticiones</button>
        <button class="btn btn-outline-secondary" @click="activarConversaciones">Acceder Conversacion</button>
    </header>
    <usuarioslist v-if="mostrarContactos"/>
    <peticioneslist v-if="mostrarPeticiones"/>
    <gruposlist v-if="mostrarGrupos" />
    <conversacioneslist v-if="mostrarConversaciones" />
  </div>
</template>

<script>
import usuarioslist from '../components/Contactos.vue';
import peticioneslist from '../components/Peticiones.vue';
import gruposlist from '../components/Grupos.vue';
import conversacioneslist from '../components/Conversaciones.vue';

export default {
    components: {
        usuarioslist,
        peticioneslist,
        gruposlist,
        conversacioneslist,
    },
    data() {
        return {
            mostrarContactos: true,
            mostrarPeticiones: false,
            mostrarGrupos: false,
            mostrarConversaciones : false,
        }
    },
    methods: {
        activarContactos() {
            this.mostrarContactos = true;
            this.mostrarPeticiones = false;
            this.mostrarGrupos = false;
            this.mostrarConversaciones = false;
        },
        activarPeticiones() {
            this.mostrarContactos = false;
            this.mostrarPeticiones = true;
            this.mostrarGrupos = false;
            this.mostrarConversaciones = false;
        },
        activarGrupos() {
            this.mostrarContactos = false;
            this.mostrarPeticiones = false;
            this.mostrarGrupos = true;
            this.mostrarConversaciones = false;
        },
        activarConversaciones() {
            this.mostrarContactos = false;
            this.mostrarPeticiones = false;
            this.mostrarGrupos = false;
            this.mostrarConversaciones = true;
        },
    }
}
</script>

<style>

</style>