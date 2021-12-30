<template>
  <div class="container">
    <header class="jumbotron">
        <h3>
            <strong>Chat</strong>
        </h3>
    </header>
    <div>
        <div class="left-panel">
            <h3>Conectados:</h3>
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
        getSala(idSala) {
            ChatService.getConversacion(idSala)
            .then(response => {
                console.log(response);
                this.users = response.data.users;
                // formateado de mensajes
                response.data.conversation.forEach(element => {
                    const msg = {
                        emisor: element.origen.username,
                        mensaje: element.contenido,    
                    }
                    this.mensajes.push(msg);
                });
            })
            .catch(error => {
                console.log(error);
                //this.$router.go(-1);
            })
        },
        onMessage(content) {
            if (typeof content == "string") {
                const mensaje = {contenido: content}
                socket.emit("enviarMensaje", {
                mensaje: content,
                sala: this.salaId,
                });
                MensajeService.introducirMensaje(this.salaId, mensaje)
                .then(response => { 
                    if (response.data.success) {
                        console.log("mensaje guardado");
                    }
                    else{
                        console.log("error en el servidor, mensaje no guardado");
                    }
                });
            }
        },
        actualizarUsuarios() {
            ChatService.getConversacion(this.salaId)
            .then(response => {
                this.users = response.data.users;
            });
        }
    },

    mounted() {
        socket.connect();
        socket.emit('join', {sala: this.salaId, usuarioId: this.$store.state.auth.user});
        socket.emit('identity', this.$store.state.auth.user);
        this.getSala(this.salaId);
        socket.on('emitirMensaje', (response) => {
            this.mensajes.push({
                mensaje: response.mensaje,
                emisor: response.emisor});
        });
        this.actualizarUsuarios();
        
    },

    unmounted() {
        ChatService.salirConversacion(this.salaId);
        socket.emit('salirChat');
        socket.off("connect");
        socket.off("disconnect");
    },
}
</script>

<style>
    .left-panel {
        float: left;
        width: 23%;
        height: 100%;
        overflow-x: visible;
        background-color: #3e636d;
        color: white;
    }
    .right-panel {
        margin-left: 260px;
    }
</style>