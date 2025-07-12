<template>
  <Dialog title="" hideDefaultButton v-bind="$attrs" v-on="$listeners" ref="checkDialog" noGutters
    @change="onChangeDialog">

    <template v-slot:button="{ on, attrs }">
      <slot name="button" v-on="on" v-bind="{ on, attrs }" />
    </template>

    <template v-slot:content>
      <v-row no-gutters align="center">
        <v-col cols="12">
          <v-row no-gutters align="center" justify="center" class="check-dialog-content">
            <div v-if="!$slots.default">
              <v-icon :color="color" left v-if="icon">{{ icon }}</v-icon>
              {{ text }}
            </div>
            <slot name="default" />

          </v-row>

          <v-row no-gutters align="center" justify="center" v-if="doubleCheck" class="pb-8">
            <v-col cols="12" align="center" justify="center" >
              <div class="grey--text mb-2">
                다음을 입력해주세요
                <span class="yellow--text">{{ randomValidateText }}</span>
              </div>
              <v-row no-gutters align="center" justify="center">
                
                <data-input style="max-width:160px;" v-model="validateText" :placeholder="$t('input_text')"></data-input>
              </v-row>
            
            </v-col>

          </v-row>

          <v-divider />

          <v-row align="center" justify="center" no-gutters>
            <v-col cols="6">
              <v-btn large tile block v-if="!hideNoButton" text @click.stop="clickNo">{{ noText ? noText : $t('cancel')
              }}</v-btn>
            </v-col>
            <v-divider vertical />
            <v-col cols="6">
              <v-btn :disabled="doubleCheck && (randomValidateText !== validateText)" large tile block
                v-if="!hideYesButton" :color="yesColor" text @click.stop="clickYes">
                <v-icon left v-if="yesIcon">{{ yesIcon }}</v-icon>
                {{ yesText ? yesText : $t('okay') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

    </template>

  </Dialog>
</template>

<script>


export default {
  name: 'CheckDialog',
  inheritAttrs: false,

  props: {
    yesText: String,
    noText: String,
    text: String,
    icon: { type: String, default: 'mdi-alert-circle-outline' },
    color: { type: String, default: 'warning' },
    hideNoButton: Boolean,
    hideYesButton: Boolean,
    preventClose: Boolean,
    yesColor: { type: String, default: 'green' },
    yesIcon: { type: String, default: '' },
    doubleCheck: { type: Boolean, default: false }
  },

  data: () => ({
    validateText: '',
    randomValidateText: ''
  }),

  computed: {

  },
  mounted() {
    this.randomValidateText = this.$utils.generateUUID()
  },

  methods: {
    clickNo() {
      this.$emit('click:no')
      this.$refs.checkDialog.dialog = false
      this.$emit('input', this.$refs.checkDialog.dialog)
    },
    clickYes() {
      this.$emit('click:yes')

      if (!this.preventClose)
        this.$refs.checkDialog.dialog = false

      this.$emit('input', this.$refs.checkDialog.dialog)
    },
    open() {
      this.$refs.checkDialog.dialog = true
      this.$emit('input', this.$refs.checkDialog.dialog)
    },
    onChangeDialog(e) {
      if(e) {
        this.randomValidateText = this.$utils.generateUUID()
      }
    }
  }

}
</script>

<style lang="scss">
.check-dialog-content {
  font-size: 18px !important;
  min-height: 160px;
}
</style>