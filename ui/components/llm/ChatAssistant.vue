<template>
  <v-card class="chat-assistant fade_right_animation" :max-width="300" :min-width="300">
    <v-card-title>
      {{ $t("command") }}

      <v-spacer />
      <v-btn icon tile close small @click="$emit('close')"
        ><v-icon>mdi-close</v-icon></v-btn
      >
    </v-card-title>
    <v-hover v-slot="{ hover }">
      <v-card-text
        style="min-height: 400px; height: 400px; max-height: 400px; overflow-y: auto"
        id="commandPanel"
      >
        <empty v-if="commands?.length === 0" centered icon="mdi-robot-confused" />

        <v-btn
          fab
          absolute
          right
          v-if="hover && commands.length > 0"
          small
          @click="commands = []"
        >
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>

        <v-sheet
          v-for="(item, idx) in commands"
          :key="'com-' + idx"
          class="mb-2 pa-3"
          style="font-size: 1rem"
        >
          <h5 class="grey--text">{{ item.speaker }}</h5>

          <span>
            {{ item.text }}
          </span>

          <v-icon
            v-if="idx === commands.length - 1 && loadingCommand"
            color="primary"
            small
            class="rotating"
            >mdi-star-four-points</v-icon
          >
        </v-sheet>
      </v-card-text>
    </v-hover>

    <v-card-actions>
      <v-text-field
        dense
        solo
        autofocus
        hide-details
        block
        :max-length="50"
        v-model="commandText"
        @keydown.enter.prevent="inputCommand()"
        ref="commandTextField"
        :disabled="loadingCommand"
      >
        <template v-slot:append>
          <v-btn
            small
            color="primary"
            icon
            @click="inputCommand()"
            :loading="loadingCommand"
            :disabled="loadingCommand || !commandText"
            ><v-icon>mdi-send</v-icon></v-btn
          >
        </template>
      </v-text-field>
    </v-card-actions>

    <v-card-actions>
      <v-row no-gutters align="center">
        <v-btn
          small
          icon
          @click="commands = []"
          :disabled="commands?.length === 0"
          ><v-icon color="red">mdi-trash-can-outline</v-icon></v-btn
        >
      {{ recognitionText }}
        <v-spacer />
        <v-btn
          small
          :color="isAudioPermission ? 'primary' : 'grey'"
          icon
          @click="isAudioPermission = !isAudioPermission"
          ><v-icon>mdi-microphone{{ isAudioPermission ? "" : "-off" }}</v-icon></v-btn
        >
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ChatAssistant",

  data() {
    return {
      loadingCommand: false,
      commands: [],
      commandText: "",
      isAudioPermission: false,
      recognition:null,
      recognitionText: '',
    };
  },

  watch:{
    isAudioPermission() {
      if(this.isAudioPermission) {
        this.setMic()
      }
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.scrollElementById("commandPanel");
      this.setMic()

    },

    setMic() {
      if(this.isAudioPermission) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
              // 마이크 접근 허용
              this.isAudioPermission = true;
              this.$snotify.error('마이크 장치 접근이 허용되었습니다.')

              if(process.client) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                this.recognition = new SpeechRecognition();
                this.recognition.lang = "ko-KR"; 
                this.recognition.interimResults = false; // 중간 결과 반환 여부

                this.recognition.onresult = (event) => {
                  this.recognizedText = event.results[0][0].transcript; // 인식된 텍스트 업데이트
                };

                this.recognition.onerror = (event) => {
                  console.error("SpeechRecognition error", event);
                };

                this.recognition.start(); 
              }
        
            })
            .catch((err) => {
              // 마이크 접근 거부
              this.isAudioPermission = false;
              console.error("마이크 접근 거부", err);
              this.$snotify.error('마이크 장치가 없거나 접근이 거부되었습니다.')
            });
        } else {
          console.error("브라우저가 getUserMedia를 지원하지 않습니다.");
        }
      }
    },

    inputCommand() {
      // let methods = Object.keys(this.$options.methods)
      // console.log(methods)

      if (this.commandText?.length > 0) {
        this.loadingCommand = true;

        let content = this.commandText;
        this.commandText = "";

        this.commands.push({
          text: content,
          speaker: "You",
        });

        let message = {
          text: "",
          speaker: "AI",
        };
        this.commands.push(message);

        this.scrollElementById("commandPanel");

        const vridgeUrl = "https://api.vridgeai.com/llm";

        const eventSource = new EventSource(
          vridgeUrl +
            "/langchain?userId=" +
            this.$auth.user._id +
            "&content=" +
            content +
            "&promptSetting=" +
            "너의 이름은 VRIDGE RMS 어시스턴트야 잘 기억해둬" +
            "그리고 너를 소개할때 너는 VRIDGE AI에서 학습된 인공지능 모델이며, 로봇 제어를 위한 LLM 모델이라고 소개해줘" +
            "가장 중요한건데 앞으로 내가 입력한 내용중에 로봇 시뮬레이션 관련해서 시작해 달라는 의미의 내용을 주면 '0' 이라는 대답만 해줘" +
            "그리고 추가적으로 몇번 시뮬레이션이라는 의미가 있으면 해당 번호에 대한 대답만 해줘 예를 들어 1번 작업해줘 하면 '1' 이라는 대답만 해줘"
        );
        eventSource.onmessage = (event) => {
          message.text += JSON.parse(event.data);
          this.scrollElementById("commandPanel");
        };
        eventSource.onerror = async (error) => {
          this.$emit("result", message, this.commands);

          this.commandText = "";
          this.$nextTick(() => {
            this.loadingCommand = false;
            this.$refs.commandTextField.focus();
          });

          eventSource.close();
        };
      }
    },

    scrollElementById(id) {
      this.$nextTick(() => {
        const commandPanel = document.getElementById(id);
        if (commandPanel) {
          commandPanel.scrollTop = commandPanel.scrollHeight;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.chat-assistant {
  pointer-events: auto !important;
}
</style>
