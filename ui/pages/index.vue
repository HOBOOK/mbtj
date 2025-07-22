<template>
  <v-container >
      <v-row>
        <v-col cols="12">
          <v-card width="100%" height="240" color="#70707010">
            <v-row align="center" justify="center" class="fill-height pa-8">
              <v-spacer/>
                <h1 class="mx-3">20 Days</h1>
                <v-btn rounded x-large @click="" color="indigo" class="white--text text-h5">Check!</v-btn>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card width="100%" height="420" color="transparent">
            <v-card>
              <v-row no-gutters align="center" class="pa-6 text-h6">
                랭킹
              </v-row>              

            </v-card>
          </v-card>

        </v-col>
        <v-col cols="6">
          <v-card width="100%" height="420" color="transparent">
            <v-card>
              <v-row no-gutters align="center" class="pa-6 text-h6">
                내 포인트
              </v-row>              

            </v-card>
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
