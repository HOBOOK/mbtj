<template>
  <v-container fluid>
    <v-col cols="12">
      
      <div class="" style="border:1px solid yellow; width:100%; height:240px;">
        <v-list-item>
          <v-list-item-content>

          </v-list-item-content>
        </v-list-item>
        

      </div>

      <div class="">


      </div>

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
