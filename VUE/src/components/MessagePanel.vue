<template>
  <div>
    <ul v-if="mensajes" class="messages">
      <li
        v-for="(message, index) in mensajes"
        :key="index"
        class="message"
      >
        <strong class="message">{{ message.emisor }}</strong>
        <br>
        <span class="message">{{ message.mensaje }}</span>
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
    displaySender(message, index) {
      return (
        index === 0 ||
        this.sala.messages[index - 1].fromSelf !==
          this.sala.messages[index].fromSelf
      );
    },
  },
  computed: {
    isValid() {
      return this.input.length > 0;
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
  background-color: aliceblue;
}
.message {
  list-style: none;
}
.sender {
  font-weight: bold;
  margin-top: 5px;
}
.form {
    position: fixed;
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