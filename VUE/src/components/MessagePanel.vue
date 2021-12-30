<template>
  <div>
    <ul v-if="mensajes" class="messages">
      <li
        v-for="(message, index) in mensajes"
        :key="index"
        class="message"
      >
        <div v-if="message.emisor === usuarioLogueado" class="message propio">
          <strong  class="message">Yo</strong>
          <br>
          <span class="message">{{ message.mensaje }}</span>
        </div>
        <div v-else class="message integrante">
          <strong class="message">{{ message.emisor }}</strong>
          <br>
          <span class="message">{{ message.mensaje }}</span>
        </div>
        
      </li>
    </ul>

    <form @submit.prevent="onSubmit" class="form">
      <textarea v-model="input" placeholder="Your message..." class="input" />
      <button :disabled="!isValid" class="send-button">Send</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "MessagePanel",

  props: {
    mensajes: Array,
  },
  data() {
    return {
      input: "",
    };
  },
  methods: {
    onSubmit() {
      this.$emit("input", this.input);
      this.input = "";
    },
  },
  computed: {
    isValid() {
      return this.input.length > 0;
    },
    usuarioLogueado() {
      return this.$store.state.auth.user.username;
    },
  },
};

</script>

<style scoped>
.header {
  line-height: 40px;
  padding: 10px 20px;
  border-bottom: 1px solid #dddddd;
}
.messages {
  margin: 0;
  padding: 20px;
  background-color: #eff7ff;
}
.message {
  list-style: none;
  margin-bottom: 10px;
}
.propio {
  margin-left: 30%;
  background-color: #cde3f8;
}
.integrante {
  margin-right: 30%;
  background-color: #9badbd;
}
.sender {
  font-weight: bold;
  margin-top: 5px;
}
.form {
    bottom: 0%;
    left: 50%;
  padding: 10px;
}
.input {
  width: 80%;
  resize: none;
  padding: 10px;
  line-height: 1.5;
  border-radius: 5px;
  border: 1px solid #000;
}
.send-button {
  vertical-align: top;
}
</style>