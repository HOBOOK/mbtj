<template>
  <v-container >
      <v-row>
        <v-col cols="12">
          <v-card width="100%" height="240" color="#70707030">
            <v-row align="center" justify="center" class="fill-height">
              <v-col cols="12">
                <h1>20 Days</h1>
                <v-btn x-large @click="" color="indigo" class="white--text text-h5">Check!</v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card width="100%" height="240">
            dd
          </v-card>

        </v-col>
        <v-col cols="6">
          <v-card width="100%" height="240">
            dd

          </v-card>

        </v-col>
      </v-row>
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
