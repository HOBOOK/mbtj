<template>
  <chart-container :title="title" :loading="loading" v-bind="$attrs" v-on="$listeners" class="" no-gutters>

    <template v-slot:content>
      <div class="chart-overlap">
        <v-card-title class=" py-2" v-if="!hideLatestData">
          <v-row no-gutters align="end" style="flex-wrap: nowrap !important; white-space: nowrap;">
            <span style="font-size:2rem;" :class="color ? color + '--text' : ''">
              <v-icon small v-if="icon" :color="color ? color : ''">{{ icon }}</v-icon>

              {{ latestData }}
            </span>
            <span class="mx-2">{{ unit }}</span>
          </v-row>
        </v-card-title>
        <div
          :style="hideLatestData ? 'height: calc(100%); max-height: calc(100%);' : 'height: calc(100% - 36px); max-height: calc(100% - 36px);'"
          style="width:calc(100% + 10px); margin-left:-10px;">
          <v-row no-gutters class="fill-height" align="center" justify="center" v-if="chartData?.data?.length === 0">
            <v-icon color="red" class="opacity-5" large>mdi-signal-off</v-icon>
          </v-row>
          <line-chart v-if="chartType === 'line'" class="chart-data" :chartdata="cumulativeChartData"
            :options="chartOptions" ref="chart" :key="'l-' + chartKey" />

          <bar-chart v-else-if="chartType === 'bar'" class="chart-data" :chartData="dailyChartData"
            :options="chartOptions" ref="chart" :key="'b-' + chartKey" />
        </div>
      </div>


    </template>
  </chart-container>
</template>

<script>
import LineChart from '../chart/LineChart.vue'
import BarChart from '../chart/BarChart.vue'
import DoughnutChart from '../chart/DoughnutChart.vue'
import ChartContainer from '../chart/ChartContainer.vue'

export default {
  components: {
    LineChart, BarChart, DoughnutChart, ChartContainer
  },
  data() {
    return {
      chartKey: 0,

      chartOptions: {
        hover: {
          mode: "dataset",
          intersect: true,
        },
        tooltips: {
          mode: "index",
          intersect: false,
          enabled: true,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                display: false,
                fontFamily: "Noto Sans",
                beginAtZero: false,
                maxTicksLimit: 1,
              },
              gridLines: {
                display: false,
                drawOnChartArea: true,
                borderDash: [4, 2],
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
                drawOnChartArea: false,
                borderDash: [8, 4],
                borderDashOffset: [0],
              },
              ticks: {
                display: false,
                fontFamily: "Noto Sans",
                autoSkip: true,
                source: 'auto',
                maxRotation: 0,
                minRotation: 0,
                maxTicksLimit: 10,
              },
            },
          ],
        },
        legend: {
          display: this.legend,
          labels: {
            usePointStyle: true,
            boxWidth: 6
          },
        },

        maintainAspectRatio: false,

        animation: {
          onComplete: () => {
          }
        }
      },

      barChartData: {
        labels: [],
        datasets: []
      },

      barChartOptions: {
        backgroundColor: '#3949AB',
        borderColor: '#3949AB',
        borderWidth: 1,
        barPercentage: 0.3
      },

      lineChartData: {
        labels: [],
        datasets: []
      },

      lineChartOptions: {
        borderColor: '#3949AB',
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointRadius: 1,
        pointHoverRadius: 3,
        lineTension: 0.2,
      },

      dailyChartData: {
        labels: [],
        datasets: [{
          data: [],
          label: '',
          backgroundColor: '#3949AB',
          borderColor: '#3949AB',
          borderWidth: 1,
          barPercentage: 0.3
        }]
      },
      cumulativeChartData: {
        labels: [],
        datasets: [{
          data: [],
          label: '',
          borderColor: '#3949AB',
          backgroundColor: 'transparent',
          borderWidth: 3,
          pointRadius: 1,
          pointHoverRadius: 3,
          lineTension: 0.2,
        }]
      },

      latestData: 0,
      renderInterval: null
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return null
      }
    },
    color: String,
    title: {
      type: String,
      default: ''
    },
    legend: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    labels: {
      type: Array,
      default: () => {
        return []
      }
    },
    chartData: {
      type: Object,
      default: () => {
        return {
          title: '',
          labels: [],
          data: []
        }
      }
    },
    predictChartData: {
      type: Object,
      default: () => {
        return {
          labels: [],
          data: []
        }
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    height: {
      type: [Number, String],
      default: '100%'
    },
    maxHeight: {
      type: [Number, String],
      default: '100%'
    },
    accumulate: Boolean,
    hideLatestData: Boolean,
    unit: String,
    limit: {
      type: Number,
      default: 10
    },
    hideOptions: Boolean,
    chartType: {
      type: String,
      default: 'line'
    }
  },
  watch: {
    chartData() {
      this.setChartData()
    },

  },
  methods: {
    setChartData() {

      while (this.chartData?.labels?.length > this.limit) {
        this.chartData.labels.shift()
      }
      while (this.chartData?.data?.length > this.limit) {
        this.chartData.data.shift()
      }

      if (this.chartData) {
        if (this.chartData?.data) {
          if (this.accumulate) {
            this.latestData = this.chartData.data.reduce((a, c) => a + c, 0)
          } else {
            this.latestData = this.chartData.data[this.chartData.data.length - 1]
          }
        }

        setTimeout(() => {
          if (!this.$refs.chart) return
          const canvas = this.$refs.chart.$el.getElementsByTagName('canvas')[0]
          let ctx = canvas.getContext('2d')

          let gradient = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight);
          gradient.addColorStop(0, '#3949ABff');
          gradient.addColorStop(1, '#3949AB00');

          this.dailyChartData = {
            labels: this.chartData.labels,
            datasets: [{
              data: this.chartData.data,
              label: this.chartData.title,
              backgroundColor: gradient,
              borderColor: '#3949AB20',
              borderWidth: 1,
              barPercentage: 0.3
            }]
          }



          this.cumulativeChartData = {
            labels: this.chartData.labels,
            datasets: [{
              data: this.chartData.data,
              label: this.chartData.title,
              backgroundColor: gradient,
              borderWidth: 3.5,
              borderColor: (context) => {
                let index = context.dataIndex
                if (index === this.chartData.data.length - 1) {
                  return '#3949ABf0'
                } else {
                  return '#3949ABf0'
                }
              },
              pointRadius: (context) => {
                let index = context.dataIndex
                if (index === this.chartData.data.length - 1) {
                  return 3
                } else {
                  return 0
                }
              },
              pointHoverRadius: 3,
              lineTension: 0.3,
            }]
          }

          if (this.predictChartData && this.predictChartData.data.length > 0) {



            this.dailyChartData.labels = [...this.chartData.labels, ...this.predictChartData.labels]
            this.dailyChartData.datasets.push({
              data: this.predictChartData.data,
              label: this.predictChartData.title,
              backgroundColor: 'indigo',
              borderColor: 'indigo',
              borderWidth: 1,
              barPercentage: 0.3
            })

            this.cumulativeChartData.labels = [...this.chartData.labels, ...this.predictChartData.labels]
            this.cumulativeChartData.datasets.push({
              data: this.predictChartData.data,
              label: this.predictChartData.title,
              borderColor: 'indigo',
              backgroundColor: 'transparent',
              borderWidth: 3.5,
              pointRadius: 0,
              lineTension: 0.2,
            })
          }

          this.renderChart()
        }, 500)

      }
    },
    renderChart() {
      this.chartOptions.animation.duration = 0
      this.chartKey++
    },

    async load() {
      const today = new Date()

      this.activitiesYear = today.getFullYear()
      this.activitiesMonth = (today.getMonth() + 1)

      if (!this.renderInterval) {
        this.renderInterval = setInterval(() => {
          this.setChartData()
        }, 1000)
      }
    },

    onWindowResize() {
      this.chartKey++
    }
  },

  mounted() {
    this.load()
    window.addEventListener('resize', this.onWindowResize)

  },

  beforeDestroy() {
    if (this.renderInterval) {
      clearInterval(this.renderInterval)
      this.renderInterval = null
    }
    window.removeEventListener('resize', this.onWindowResize)
  },

}
</script>

<style lang="scss">
canvas {
  height: 100% !important;
  max-height: 100% !important;
  min-height: 100% !important;
}

.chart-overlap {
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>