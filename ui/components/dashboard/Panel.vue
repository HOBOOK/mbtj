<template>
  <chart-container :title="title" :loading="loading"  :max-height="maxHeight" :height="height">
    <template v-slot:header-append>
      <slot name="header-append"/>
    </template>

    <template v-slot:content>
      <slot/>
    </template>
  </chart-container>
</template>
  
<script>
  import ChartContainer from '../chart/ChartContainer.vue'

  export default {
    components:{
      ChartContainer
    },
    data() {
      return {
        
      }
    },
    props:{
        title:{
          type:String,
          default:'',
        },
        loading: {
          type:Boolean,
          default:false
        },
        hideDefaultTitle: {
          type:Boolean,
          default:false
        },
        height: {
          type: [Number, String],
          default: '100%'
        },
        maxHeight: {
          type: [Number, String],
          default: '100%'
        }
    },
    methods:{
        
    },

  
  }
  </script>

  <style lang="scss">

    .panel-container{
      max-width:100% !important;
      .loading{
        *{
          opacity:0.8 !important;
        }
      }
  
      .v-card__text{
        max-height: calc(100% - 70px) !important;
        height: calc(100% - 70px) !important;
  
        .chart-data {
          height: calc(100% - 0px);
          max-height: 190px !important;
          width: 100%;
  
          canvas{
          }
        }
      }
      
    }
    
    </style>