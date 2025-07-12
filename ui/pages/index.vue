<template>
  <v-container fluid>
    <v-col cols="12">
      d

    </v-col>
  </v-container>
</template>

<script>
import { Multipane, MultipaneResizer } from "vue-multipane";

export default {
  components: {

    Multipane,
    MultipaneResizer,

  },
  data() {
    return {


    };
  },

  async asyncData({ $axios, $socket }) {

  },

  mounted() {
    this.$socket.on('opcua', (data) => {
    })

  },


  methods: {
  }

};
</script>

<style lang="scss"></style>
