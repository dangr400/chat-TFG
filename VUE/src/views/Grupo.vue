<template>
    <div class="container">
    <header class="jumbotron">
      <h3><strong>Detalles del grupo</strong></h3>
    </header>
    <div class="container">
        <header class="jumbotron">
            <h3><strong>Creador</strong></h3>
            <h4><p>{{creador}}</p></h4>
        </header>
        

        <header class="jumbotron">
            <h3><strong>Moderadores</strong></h3>
            <span><button class="btn btn-outline-secondary">Añadir Moderador</button></span>
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
            <span><button class="btn btn-outline-secondary">Añadir Usuario</button></span>
            <ul class="list-group">
                <li class="list-group-item"
                :class="{ active: index == currentIndex }"
                v-for="(integrante, index) in integrantes"
                :key="index"
                >
                    {{ integrante.username }}
                </li>
        </ul>
        </header>
        
    </div>
  </div>
</template>

<script>
import GrupoService from "../services/grupos.service"

export default {
    data() {
        return {
            // grupos
            grupo: null,
            integrantes: [],
            moderadores: [],
            creador: null,
            nombre: null,
            contactos: null,
            // para formularios nuevos moderadores e integrantes
            verNuevoModerador: false,
            verNuevoIntegrante: false,
        };
    },

    methods: {
        getGrupo() {
            const idGrupo = this.$route.params.id;
            GrupoService.getGrupoPorId(idGrupo)
            .then(response => {
                this.grupo = response.data.grupo;
                this.integrantes = response.data.grupo.integrantes;
                this.moderadores = response.data.grupo.moderadores;
                this.creador = response.data.grupo.creador.username;
                this.nombre = response.data.grupo.nombre;

            })
            .catch(err => {
                console.log(err);
            });
        },

        
    },

    mounted() {
        this.getGrupo();
    }
}
</script>

<style>

</style>