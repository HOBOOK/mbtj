<template>
  <v-container fluid>
    <v-col cols="12">
      <v-row>
        <v-col class="split-container" cols="6">
          <v-row class="request-container" align="center" justify="center">
            <h1 class="header-title">
              투입구 (IN)
            </h1>
            <v-col cols="12" class="text-center">

              <div style="position: relative; width: 480px; height:40vh; margin:0 auto;">
                <div class="image-container" :class="currentIn ? 'animation-1' : ''"
                  style="z-index:2; right:0; transform: translateY(80px); ">
                  <div class="image-container" style="z-index:3; left:64px; top:32px;">
                    <img
                      :src="require(`~/assets/image/rug/${currentIn ? rugMap.get(currentIn.rug)?.name + '.png' : 'undefined.png'}`)"
                      width="128" height="128" contain />
                  </div>
                  <img :src="require('~/assets/image/pallet.png')" width="256" height="256" contain />
                  <div class="image-container" style="z-index:-1; left:152px; top:64px;">
                    <img :src="require('~/assets/image/forklift.png')" width="256" height="256" contain />
                  </div>
                </div>
                <div class="image-container" style="z-index:1">
                  <img :src="require('~/assets/image/off.png')" width="256" height="256" contain />
                </div>
              </div>

              <div
                style="position: absolute; top:50%; transform:translateY(-50%); width:100%; height: 30vh; background-color:rgba(0,0,0,0.5); z-index:10;">
                <v-row class="fill-height" align="center" justify="center">
                  <h1 class=" display-1 font-weight-bold text--darken-3" style="font-size:5vh !important;">

                    <span v-if="currentIn" class="flashing yellow--text">
                      <span v-if="currentIn.status === 'PENDING'">
                        ⚠️ {{ currentIn.to }}: {{ rugMap.get(currentIn.rug)?.name }} 투입 요청
                      </span>
                      <span v-else-if="currentIn.status === 'IN_PROGRESS'">
                        🔎 투입 일치 여부 확인중
                      </span>
                      <span v-else-if="currentIn.status === 'DONE'">
                        ✔️ 정상적으로 투입 완료
                      </span>
                      <span v-else-if="currentIn.status === 'ERROR'">
                        ⚠️ {{ rugMap.get(currentIn.rug)?.name }} 타입 불일치!
                      </span>
                    </span>
                    <span v-else>
                      🛑 작업 대기 (WAIT)
                    </span>
                  </h1>
                </v-row>
              </div>

              <h3 style="height:2vh;">📋 다음 대기 중 요청</h3>
            </v-col>
          </v-row>

          <v-col cols="12" class="request-list-container">
            <v-list two-line color="transparent">
              <v-card v-for="(item, index) in inqueue.slice(0, 3)" :key="item.id" class="mb-3"
                :class="'opacity-' + (10 - (index * 4))" @click="currentIn = item">

                <v-list-item>
                  <v-icon left color="grey">mdi-check</v-icon>
                  <v-list-item-content>
                    <v-list-item-title style="font-size:1.5vh !important;">
                      {{ index + 1 }}. {{ rugMap.get(item.rug)?.name }} 팔렛트 투입
                    </v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action class="grey--text">

                    {{ new Date(item.requestedAt).toLocaleString("ko-KR") }} 요청됨
                  </v-list-item-action>
                </v-list-item>
              </v-card>



            </v-list>

            <v-row no-gutters align="center" justify="center" v-if="inqueue.length > 3" class="grey--text">
              총 {{ inqueue.length }}개의 요청 대기중
            </v-row>
          </v-col>
        </v-col>

        <v-col class="split-container" cols="6">
          <v-row class="request-container" align="center" justify="center">
            <h1 class="header-title">
              배출구 (OUT)
            </h1>

            <v-col cols="12" class="text-center">

              <div style="position: relative;  width: 480px; height:40vh; margin:0 auto;">
                <div class="image-container" style="z-index:2; right:0;  transform: translateY(80px);"
                  :class="currentOut ? 'animation-2' : ''" :style="!currentOut ? 'left:50% !important;' : ''">
                  <div v-if="currentOut" class="image-container" style="z-index:3; left:64px; top:32px;">
                    <img
                      :src="require(`~/assets/image/rug/${currentOut ? rugMap.get(currentOut.rug)?.name + '.png' : 'undefined.png'}`)"
                      width="128" height="128" contain />
                  </div>
                  <img v-if="currentOut" :src="require('~/assets/image/pallet.png')" width="256" height="256" contain />
                  <div class="image-container" style="z-index:-1; left:152px; top:64px;">
                    <img :src="require('~/assets/image/forklift.png')" width="256" height="256" contain />
                  </div>
                </div>
                <div class="image-container" style="z-index:1">
                  <img :src="require('~/assets/image/off.png')" width="256" height="256" contain />
                </div>
              </div>

              <div
                style="position: absolute; top:50%; transform:translateY(-50%); width:100%; height: 30vh; background-color:rgba(0,0,0,0.5); z-index:10;">
                <v-row class="fill-height" align="center" justify="center">
                  <h1 class=" display-1 font-weight-bold text--darken-3" style="font-size:5vh !important;">

                    <span v-if="currentOut" class="flashing yellow--text">
                      ⚠️ {{ rugMap.get(currentOut.rug)?.name }} 팔렛트를 배출해주세요
                    </span>
                    <span v-else>
                      🛑 작업 대기 (WAIT)
                    </span>
                  </h1>
                </v-row>
              </div>

              <h3 style="height:2vh;">📋 다음 대기 중 요청</h3>
            </v-col>
          </v-row>

          <v-col cols="12" class="request-list-container">
            <v-list two-line color="transparent">
              <v-card v-for="(item, index) in outqueue.slice(0, 3)" :key="item.id" class="mb-3"
                :class="'opacity-' + (10 - (index * 4))" @click="currentOut = item">
                <v-list-item>
                  <v-icon left color="grey">mdi-check</v-icon>
                  <v-list-item-content>
                    <v-list-item-title style="font-size:1.5vh !important;">
                      {{ index + 1 }}. {{ rugMap.get(item.rug)?.name }} 팔렛트 배출
                    </v-list-item-title>

                  </v-list-item-content>
                  <v-list-item-action class="grey--text">
                    {{ new Date(item.requestedAt).toLocaleString("ko-KR") }} 요청됨
                  </v-list-item-action>
                </v-list-item>
              </v-card>
            </v-list>


            <v-row no-gutters align="center" justify="center" v-if="outqueue.length > 3" class="grey--text">
              총 {{ outqueue.length }}개의 요청 대기중
            </v-row>
          </v-col>
        </v-col>

        <v-row no-gutters align="center" style="font-size:1.7vh; height:6vh; bottom:1vh; position:absolute; width:100%;"
          class="yellow--text">
          <v-col cols="6" align="center">
            투입방법<br />
            1. 투입 요청 및 파트 확인 → 2. 지게차 팔렛트 투입 → 3. 클램프 버튼 누름 → 4. 투입검사 결과 확인 → 완료
          </v-col>
          <v-col cols="6" align="center">
            배출방법<br />
            1. 배출 요청 확인 → 2. 지게차로 팔렛트 배출 → 3. 배출 완료 버튼 누름 → 완료
          </v-col>
        </v-row>
      </v-row>
    </v-col>

  </v-container>
</template>

<script>
import { processStationData, checkRequestUpdated } from "../plugins/opcua";

export default {
  components: {

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

    const stationMap = new Map()
    for (let s of stations) {
      stationMap.set(s.id, s)
    }

    const stationRes = await $axios.get('/stations')
    for (const sr of stationRes.data) {
      processStationData(sr, stationMap)
    }

    return {
      stations,
      stationMap,
      rugs,
      rugMap
    }
  },
  data() {
    return {
      currentIn: null,
      currentOut: null,
      inqueue: [{
        requestId: 'req_1',
        from: '',
        to: 'W3',
        rug: 0,
        requestedAt: '2025-07-08T12:41:32Z',
        completedAt: '',
        deadline: '2025-07-09T12:30:00Z',
        type: 'IN',
        status: 'PENDING', // PENDING, IN_PROGRESS, DONE, ERROR,
        retryCount: 0,
      }],
      outqueue: [{
        requestId: 'req_2',
        from: 'W4',
        to: '',
        rug: 1,
        requestedAt: '2025-07-08T12:41:32Z',
        completedAt: '',
        deadline: '2025-07-09T12:30:00Z',
        type: 'IN',
        status: 'PENDING', // IN_PROGRESS, DONE, ERROR,
        retryCount: 0,
      },]
    };
  },

  mounted() {
    this.$socket.on('opcua', (data) => {
      const isUpdated = checkRequestUpdated(data, this.stationMap)
      if (isUpdated) {
        console.log('[최신 상태 patch 이벤트 받음]')
      }
    })
  },


  methods: {

  }

};
</script>

<style lang="scss">
.header-title {
  font-size: 5vh !important;
  border: 2px solid red;
  font-weight: bold;
  background: black;
  padding: 1vh 4vh;
  margin: 2vh 0;
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
    filter: brightness(50%);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
  }
}

.split-container {
  height: 100%;

  &:first-child {
    border-right: 1px solid #90909060;

  }
}

.request-container {
  height: 65vh;
  max-height: 65vh;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.request-list-container {
  height: calc(35vh - 80px);
  max-height: calc(35vh - 80px);
  overflow-y: auto;
  max-width: 800px !important;
  margin: 0 auto;
}

.image-container {

  position: absolute;

  &.animation-1 {
    animation: movePlateIn 3s ease-in-out infinite;
  }

  &.animation-2 {
    animation: movePlateOut 3s ease-in-out infinite;
  }

  @keyframes movePlateIn {
    0% {
      transform: translateX(0);
      transform: translateY(80px);
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    100% {
      transform: translateY(0px);
      right: calc(100% - 256px);
      opacity: 1;
    }
  }

  @keyframes movePlateOut {
    0% {

      opacity: 1;
      transform: translateY(0px);
      right: calc(100% - 256px);
    }

    50% {
      opacity: 1;
    }

    100% {


      transform: translateX(0);
      transform: translateY(80px);
      opacity: 0;
    }
  }
}
</style>
