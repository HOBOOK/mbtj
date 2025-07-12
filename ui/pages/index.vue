<template>
  <v-container fluid>
    <v-col cols="12">
      <v-container style="height:calc(100vh - 80px);">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" md="6" xl="3" v-for="line, index in lines" :key="index">
            <v-row style="border-right:1px dashed #90909030;">
              <v-col cols="12" align="center">
                <v-chip outlined style="width:200px; padding:20px 0;" class="d-flex justify-center align-center">
                  <h3>{{ line }}</h3>
                </v-chip>
              </v-col>
              <v-col v-for="station in stations.filter((e) => e.line === line)" :key="station.id + station.updated"
                cols="12">
                <v-card dark outlined :min-height="160" :style="station.ea < 1 ? 'border:2px thin #ffff0090;' : ''">
                  <v-list-item>
                    <v-list-item-content class="mr-6" style="max-width:120px !important; position:relative;">
                      <img :src="station.ea > 0
                        ? require('~/assets/image/on.png')
                        : require('~/assets/image/off.png')
                        " width="120" height="120" contain />

                      <div style="position:absolute; left:24px; top:24px;"
                        :style="station.status === 'empty' ? 'opacity:0.2' : ''" :class="station.status === 'requested' ? 'jumping':''">
                        <img :src="require(`~/assets/image/rug/${rugMap.get(station.rug)?.name + '.png'}`)" width="64"
                          height="64" />
                      </div>


                      <v-card-title style="font-size:24px;">
                        <v-row no-gutters align="center" justify="center">
                          {{ station.name }}

                        </v-row>
                      </v-card-title>
                    </v-list-item-content>

                    <v-list-item-content>

                      <v-chip label
                        :color="station.status === 'ok' ? 'transparent' : station.status === 'empty' ? 'red' : 'blue'"
                        no-gutters style="font-size:21px;" class="mb-3"
                        :class="station.status === 'ok' ? 'white--text' : station.status === 'empty' ? 'black--text flashing' : 'black--text'">
                        <span v-if="station.status === 'empty'" class="mr-1">⚠️</span>
                        <span v-if="station.status === 'requested'" class="mr-1">📩</span>
                        <span v-if="station.status === 'ok'" class="mr-1">✔️</span>
                        {{ statusDict[station.status] }}
                      </v-chip>



                      <div class="panel-view" :class="{ empty: station.status === 'empty' }">
                        RUG
                        <h1 class="text-right">

                          {{ rugMap.get(station.rug)?.name ?? '?' }}
                        </h1>
                      </div>


                      <div class="panel-view" :class="{ empty: station.status === 'empty' }">
                        EA<h1 class="text-right">{{ station.ea }}</h1>
                      </div>

                    </v-list-item-content>


                  </v-list-item>

                </v-card>
              </v-col>
            </v-row>
          </v-col>

        </v-row>
      </v-container>

    </v-col>

  </v-container>
</template>

<script>
import { Multipane, MultipaneResizer } from "vue-multipane";
import { processStationData } from "../plugins/opcua";

export default {
  components: {

    Multipane,
    MultipaneResizer,

  },
  data() {
    return {

      alerts: [
        { id: 1, message: 'S2: 러그 A타입 팔렛트를 투입해주세요' },
        { id: 2, message: 'S3: 작업 완료된 팔렛트를 배출해주세요' }
      ],

      statusDict: {
        'ok': '정상',
        'requested': '요청됨',
        'empty': '비어있음'
      }
    };
  },

  async asyncData({ $axios, $socket }) {

    const rugsRes = await $axios.get('/rugs')
    const rugs = rugsRes.data || []
    const rugMap = new Map()
    for (let r of rugs) {
      rugMap.set(r.id, r)
    }

    const stations = [
      { id: '100300', line: '공통', name: '투입', rug: 'A', status: 'ok', ea: 0, updated: new Date(), prevUpdated: new Date() },
      { id: '100400', line: '공통', name: '배출', rug: 'A', status: 'empty', ea: 3, updated: new Date(), prevUpdated: new Date() },
      { id: '100700', line: '공통', name: '버퍼1', rug: 'A', status: 'ok', ea: 0, updated: new Date(), prevUpdated: new Date() },
      { id: '100800', line: '공통', name: '버퍼2', rug: 'A', status: 'ok', ea: 0, updated: new Date(), prevUpdated: new Date() },
      { id: '112500', line: '재생라인', name: 'R1', rug: 'A', status: 'ok', ea: 2, updated: new Date() },
      { id: '112600', line: '재생라인', name: 'R2', rug: 'A', status: 'ok', ea: 0, updated: new Date() },
      { id: '112700', line: '재생라인', name: 'R3', rug: 'A', status: 'ok', ea: 0, updated: new Date() },
      { id: '112800', line: '재생라인', name: 'R4', rug: 'A', status: 'ok', ea: 5, updated: new Date() },
      { id: '125400', line: '용접라인1', name: 'W1', rug: 'A', status: 'requested', ea: 0, updated: new Date() },
      { id: '125500', line: '용접라인1', name: 'W2', rug: 'A', status: 'ok', ea: 0, updated: new Date() },
      { id: '125600', line: '용접라인1', name: 'W3', rug: 'A', status: 'empty', ea: 0, updated: new Date() },
      { id: '125700', line: '용접라인1', name: 'W4', rug: 'A', status: 'empty', ea: 4, updated: new Date() },
      { id: '135400', line: '용접라인2', name: 'W5', rug: 'A', status: 'empty', ea: 0, updated: new Date() },
      { id: '135500', line: '용접라인2', name: 'W6', rug: 'A', status: 'empty', ea: 0, updated: new Date() },
      { id: '135600', line: '용접라인2', name: 'W7', rug: 'A', status: 'empty', ea: 0, updated: new Date() },
      { id: '135700', line: '용접라인2', name: 'W8', rug: 'A', status: 'empty', ea: 0, updated: new Date() }
    ]
    const lines = []

    const stationMap = new Map()
    for (let s of stations) {
      stationMap.set(s.id, s)
      if (!lines.includes(s.line)) {
        lines.push(s.line)
      }
    }

    const stationRes = await $axios.get('/stations')
    for (const sr of stationRes.data) {
      processStationData(sr, stationMap)
    }

    return {
      stations,
      stationMap,
      lines,
      rugs,
      rugMap
    }
  },

  mounted() {
    this.$socket.on('opcua', (data) => {
      processStationData(data, this.stationMap)
    })

  },


  methods: {
  }

};
</script>

<style lang="scss">
.panel-view {
  background: black;
  padding: 12px;
  margin: 6px 0;
  position: relative;
  z-index: 1;
  text-shadow:
    0 0 2px #fff,
    0 0 10px #fff;
  border: 1px solid #ffff0020;
  box-shadow:
    inset 0 0 10px #ffff00c0;

  &::before {
    content: '';
    background-image: url('~@/assets/image/panel.png');

    background-size: cover;
    position: absolute;
    background-repeat: no-repeat;
    background-position: center;
    filter: brightness(30%);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
  }

  &.empty {
    text-shadow: none !important;
    color: grey !important;
    opacity: 0.8;
  }

}
</style>
