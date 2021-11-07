<template>
  <div class="container">
    <header class="jumbotron">
        <h3>
            <strong>Chat</strong>
        </h3>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
    name: "chat",
    data() {
        return {
            hola: "mundo"
        };
    },

    methods: {

    }
}
</script>

<style>

</style>