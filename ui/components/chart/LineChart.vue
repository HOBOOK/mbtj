<script>
  import { Line } from 'vue-chartjs'

//const {reactiveProps} = mixins
  export default {
    extends: Line,
    //props:['chartdata', 'options', 'chartKey'],
    name:'LineChart',
    
    props:{
      chartdata:{
        type:Object,
        default:null
      },
      options:{
        type:Object,
        default:null
      }
    },
    mounted () {
      this.renderChart(this.chartdata, this.options)
    },
    methods: {
      get() {
        return this
      }
    }
  }
</script>
