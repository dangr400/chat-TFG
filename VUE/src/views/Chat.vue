<template>
  <div class="container">
    <header class="jumbotron">
        <h3>
            <strong>Chat</strong>
        </h3>
    </header>
    <div>
        <div class="left-panel">
            <ul>
                <li
                    v-for="(user, index) in users"
                    :key="index"
                >
                    <strong> {{user.username}} </strong>
                </li>
            </ul>
        </div>
        <message-panel
        @input="onMessage"
        :mensajes="mensajesR"
        class="right-panel"
        />
    </div>
    
  </div>
 
</template>


<script>
import ChatService from "../services/chat.service";
import socket from "../socket.js";
import MessagePanel from "../components/MessagePanel.vue";
import MensajeService from '../services/mensaje.service';

export default {
    name: "chat",
    data() {
        return {
            selectedUser: null,
            users: new Array,
            salaId: this.$route.params.salaId,
            mensajes: new Array,
        };
    },
    computed: {
        mensajesR() {
            return this.mensajes;
        }
    },
    components: {
        MessagePanel
    },
    methods: {
        onMessage(content) {
            if (typeof content == "string") {
                socket.emit("enviarMensaje", {
                mensaje: content,
                sala: this.salaId,
                });
                MensajeService.introducirMensaje()
                .then(response => { 
                    if (response.success) {
                        console.log("mensaje guardado");
                    }
                    else{
                        console.log("error en el servidor, mensaje no guardado");
                    }
                });
            }
        },
    },
    mounted() {
        socket.connect();
        socket.emit('join', {sala: this.salaId, usuarioId: this.$store.state.auth.user});
        socket.emit('identity', this.$store.state.auth.user);
        ChatService.getConversacion(this.salaId)
        .then(response => {
            this.users = response.data.users;
            this.mensajes.push(response.data.conversation);
        });
        socket.on('emitirMensaje', (response) => {
            this.mensajes.push({
                mensaje: response.mensaje,
                emisor: response.emisor});
        });
        
    },
    unmounted() {
        socket.emit('salirChat');
        socket.off("connect");
        socket.off("disconnect");
    },
}
</script>

<style>
    .left-panel {
        float: left;
        width: 10%;
        height: 100%;
        overflow-x: hidden;
        background-color: #3a3d3b;
        color: white;
    }
    .right-panel {
        margin-left: 260px;
    }
</style>