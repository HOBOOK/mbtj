<template>
  <chart-container :title="title" :loading="loading"  :max-height="maxHeight" :height="height" v-bind="$attrs"  v-on="$listeners">


    <template v-slot:content>
      <div class="chart-cover">
        <DoughnutChart
          class="chart-data"
          :chartData="chartData"
          :options="options"
          :plugins="plugins"
          :key="'data-chart' + chartKey"
          ref="chart"
        />

        <div class="information" :class="color ? color + '--text' : 'primary-gradient'">
          <div class="unit " :style="'font-size:' + Math.max((labelSize / 2.5), 0.8) + 'rem !important;'">
            {{ unit }}
          </div>
          <span  class="label" :style="'font-size:' + labelSize + 'rem !important;'">
            {{ value }}
          </span>

        </div>
      </div>
     
      
    </template>
  </chart-container>
</template>
  
<script>
  import DoughnutChart from '../chart/DoughnutChart.vue'
  import ChartContainer from '../chart/ChartContainer.vue'

  export default {
    name: 'DataChart',
    components:{
      DoughnutChart, ChartContainer
    },
    data() {
      return {
        chartKey:0,
        chartData:{},
        label:'',
        options: {
          cutoutPercentage:85,
          maintainAspectRatio: false,
          circumference: (Math.PI * 1.2), // 절반만 표시
          rotation: (-Math.PI * 1.1), // 상단에서 시작
          legend: {
            display:false,
            labels: {
              filter: function(item, chart) { 
                return item.text !== 'None'; // 빈 항목을 범례에서 제거.
              }
            }
          },

          hover:{
            mode:'single',
            animationDuration: 400,
            onHover: (e, elements) => {
            }
          },

          animation: {
            duration: 300,
            onComplete: (chart) => {
            }
          },

          


          
        },
        plugins: [{
            beforeDraw: (chart) => {
              // var width = chart.chartArea.right;
              // var height = chart.chartArea.bottom;
              // var ctx = chart.ctx;
              // ctx.restore();
              // var fontSize = (height / 200).toFixed(2);
              // ctx.font = fontSize + "em sans-serif";
              // ctx.textBaseline = "top";
              // var text = chart.data.datasets[0].data.reduce((a, b) => a + b, 0), // 전체 값 합계
              //     textX = Math.round((width - ctx.measureText(text).width) / 2),
              //     textY = height / 2;
              // ctx.fillText(text, textX, textY); // 전체 값 표시

              // // 바늘 그리기
              // var angle = 0, count = 0, rotationAngle = (Math.PI / 180) * chart.options.rotation;
              // var circumference = chart.data.datasets[0].circumference || Math.PI * 2; // circumference 값 가져오기

              // chart.data.datasets.forEach(function (dataset, i) {
              //     dataset.data.forEach(function (value, j) {
              //         if(value === Math.max.apply(Math, dataset.data)) {
              //             angle = ((circumference) * (count / dataset.data.length)) + ((circumference) * (dataset.data[j] / dataset.data.reduce((a,b) => a+b, 0)) / 2) - (circumference / 2) + rotationAngle;
              //         }
              //         count += 1;
              //     });
              // });

              // ctx.beginPath();
              // ctx.moveTo(width / 2, height / 2);
              // ctx.lineTo(width / 2 + Math.cos(angle) * height / 2.5, height / 2 + Math.sin(angle) * height / 2.5);
              // ctx.lineWidth = height / 50;
              // ctx.strokeStyle = '#000000';
              // ctx.stroke();
            }
          }],
        gradient: null,
        
        renderInterval: null
      }
    },
    watch:{
      value() {
        this.render()
      },
    },
    mounted(){

      if(!this.renderInterval) {
        this.renderInterval = setInterval(() => {
          this.render()
        }, 1000)

        setTimeout(() => {
          this.options.animation.duration  = 0
        }, 1000)
      }
      window.addEventListener('resize', this.onWindowResize)
    },
    beforeDestroy() {
      if(this.renderInterval) {
        clearInterval(this.renderInterval)
        this.renderInterval = null
      }
      window.removeEventListener('resize', this.onWindowResize)
    },
    methods:{
      render() {
        let backgroundColor = '#3949ABf0'


        const canvas = this.$refs.chart?.$el?.getElementsByTagName('canvas')[0]

        if(canvas) {
          let ctx = canvas.getContext('2d')
          backgroundColor = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight);
          backgroundColor.addColorStop(0, '#3949ABff');   
          backgroundColor.addColorStop(1, '#3949AB00');
        }
        

        this.chartData = {
          labels: [this.title, 'None'],
          datasets: [{
            data: [this.value, (Math.max(this.max, this.value) - this.value)],
            backgroundColor: [backgroundColor, '#3949AB10'],
            borderColor: 'transparent',
            borderWidth: 2
          }]
        }

        this.chartKey++

      },
      onWindowResize() {
        this.chartKey++
      }
    },
    props:{
      color: String,
      subColor:String,
        value:{
          type:[Number, String],
          default: 10
        },
        max:{
          type: Number,
          default:100
        },
        title:{
          type:String,
          default:''
        },
        unit:{
          type:String,
          default:''
        },
        loading: {
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
        },
        labelSize:{
          type: Number,
          default: 2.5
        }
    },
  }
  </script>

<style lang="scss">
.chart-cover{

  position: relative;
  max-height: calc(100% - 12px);
  height: calc(100% - 12px);
  min-height: calc(100% - 12px);
  overflow: hidden;

  .information{
    justify-items: center;
    align-items: center;
    display:flex;
    flex-direction: column;
    position: absolute;
    top:calc(50% - 1rem);
    left:50%;
    transform:translateX(-50%);

    .unit{
      text-shadow: 0px 0px 32px  #ffffff20, 0px 0px 8px  #ffffff60;
      font-size:1rem;
    }
    .label{
      font-family: Pretendard-Bold !important;
      text-shadow: 0px 0px 32px  #64B5F620, 0px 0px 8px  #64B5F660;
      font-size: 2.5rem;
      padding:1rem;

      &.large{
        font-size: 5rem;
      }
    }
  }


}
</style>