<template>
<div class="d-flex align-center" :class="centered ? 'justify-center' : ''"  style="height:100%;" @click="$emit('click')"> 
  <v-col no-gutters align="center" justify="center">
    <v-row no-gutters align="center" justify="center" class="opacity-7 my-6">
      <v-icon x-large :color="iconColor">{{ icon }}</v-icon>
    </v-row>
    <v-row no-gutters align="center" justify="center" class="opacity-7" v-if="text">
      <h2>{{ text }}</h2>
    </v-row>
    <v-row no-gutters align="center" justify="center" class="opacity-5 mb-6" v-if="subtext">
      {{ subtext }}
    </v-row>
    <slot></slot>
    <v-row no-gutters align="center" justify="center" class="mb-6" v-if="$slots.append">
      <slot name="append"></slot>
    </v-row>
  </v-col>
  
</div>
</template>

<script>
export default {
  name:'Empty',
  props:{
    icon:{
      type:String,
      default: 'mdi-database-off-outline'
    },
    iconColor:{
      type:String,
      default:'grey'
    },
    text:{
      type: String,
      default: '',
    },
    subtext:{
      type: String,
      default:''
    },
    centered:{
      type:Boolean,
      default:false
    }
  },
  data:()=>({
  }),
  mounted() {

  },
  
}
</script>