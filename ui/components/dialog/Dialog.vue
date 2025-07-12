<template>
  <v-dialog
    v-model="dialog"
    :persistent="persistent"
    scrollable
    :width="width"
    @keydown.enter="enterKeyEvent"
    content-class="vridge-dialog-container"
    @input="$emit('input', dialog)"
    v-bind="$attrs"
    v-on="$listeners"
    :overlay-opacity="0.5"
    overlay-color="black"
    transition="dialog-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="button" v-on="on" v-bind="{ on, attrs }"></slot>
    </template>

    <template v-for="(slot, key) in $scopedSlots" v-slot:[key]="scope">
      <slot :name="key" v-bind="scope" />
    </template>

    <v-card
      class="vridge-dialog"
      :class="[lineTheme ? 'line-theme' : '', noGutters ? 'no-gutters' : '']"
      :tile="tile"
      elevation="0"
      height="100%"
      max-height="100%"
      :min-height="height"
    >
      <v-card-title class="vridge-dialog-title">
        <slot name="title" v-if="$slots.title"> </slot>
        <v-row v-else no-gutters align="center" justify="start">
          <span class="font-weight-bold">
            {{ title }}
          </span>
          <v-spacer />
          <slot name="append-header-button" />
          <v-btn icon tile small  v-if="closeButton" @click="clickNo">
            <v-icon >mdi-close</v-icon>
          </v-btn>
        </v-row>
      </v-card-title>

      <div
        class="vridge-content-container"
        :style="`
          overflow-y: ${overflow}; 
          background:${background}; 
          ${ maxHeight ? `height: ${maxHeight}px;` : ''}
        `"
      >
        <slot name="content" v-bind="{ dialog }"> </slot>
        <slot />
      </div>
      <v-card-actions
        class="vridge_actions"
        v-if="!$slots.actionButton && !hideDefaultButton"
      >
        <v-row no-gutters align="center">
          <v-spacer />

          <v-btn
            elevation="0"
            @click="clickNo"
            :disabled="disabledNo"
            :loading="loading"
            v-if="!closeButton"
            class="ml-2"
            color="transparent"
          >
            <span>{{ $t("close") }}</span>
          </v-btn>

          <v-btn
            v-if="saveBtn"
            @click="clickSave"
            @keydown.enter="clickSave"
            :loading="loading"
            class="ml-2"
            color="primary"
          >
            <span>{{ $t("save") }}</span>
          </v-btn>

         

          <v-btn
            v-if="clickYesBtn"
            color="primary"
            @click="clickYes"
            elevation="0"
            :loading="loading"
            :disabled="disabledYes"
            class="ml-2"
          >
            <span>{{ clickYesBtn }}</span>
          </v-btn>
        </v-row>
      </v-card-actions>
      <v-card-actions v-else-if="$slots.actionButton" class="vridge_actions">
        <slot name="actionButton"> </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    persistent: {
      type: Boolean,
      default: false,
    },
    borderBottom: {
      type: Number,
    },
    borderRadius: {
      type: Number,
    },
    color: {
      type: String,
    },
    colorHeader: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    width: {
      type: [Number, String],
      default: 480,
    },
    height: {
      type: [Number, String],
      default: 120,
    },
    maxHeight: {
      type: [Number, String],
      default: 0,
    },
    padding: {
      type: String,
    },
    overflow: {
      type: String,
      default: "auto",
    },
    background: {
      type: String,
    },
    backgroundHeader: {
      type: String,
    },
    clickYesBtn: {
      type: String,
      default: "",
    },
    mobileFull: {
      type: Boolean,
      default: false,
    },
    enterKeyActive: {
      type: Boolean,
      default: false,
    },
    tile: {
      type: Boolean,
      default: false,
    },
    closeButton: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabledYes: {
      type: Boolean,
      default: false,
    },
    disabledNo: {
      type: Boolean,
      default: false,
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
    lineTheme: {
      type: Boolean,
      default: false,
    },
    noGutters: {
      type: Boolean,
      default: false,
    },
    saveBtn: {
      type: Boolean,
      default: false,
    },
    hideDefaultButton: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    dialog: false,
    format: "YYYY-MM-DD",
    isFullDialog: false,
  }),
  watch: {
    dialog() {
      this.$emit("change", this.dialog);
      if (this.dialog) {
        this.init();
        if (this.mobileFull) {
          this.isFullDialog = window.innerWidth <= 768;
        }
      } else {
        this.$emit("click-no", this.dialog);
        this.$emit("close", this.dialog);
      }
    },
  },
  computed: {
    fullDialog() {
      return this.isFullDialog || this.fullscreen;
    },
  },
  methods: {
    init() {},
    clickYes() {
      if (this.autoClose) this.dialog = false;
      this.$emit("click-yes");
    },
    enterKeyEvent() {
      if (this.enterKeyActive) {
        this.clickYes();
      }
    },
    select(index) {
      this.selectedIndex = index;
    },
    clickNo() {
      this.dialog = false;
      this.$emit("click-no");
    },
    resizeEventHandler(e) {
      if (this.dialog && this.mobileFull) {
        if (e.currentTarget.outerWidth <= 768) {
          this.isFullDialog = true;
        } else {
          this.isFullDialog = false;
        }
      } else {
        this.isFullDialog = false;
      }
    },
    clickSave() {
      this.$emit("saved");
    },
    
    open() {
      this.dialog = true
    }
  },
  mounted() {
    window.addEventListener("resize", this.resizeEventHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeEventHandler);
  },
};
</script>
<style lang="scss">

.dialog-transition-enter-active, .dialog-transition-leave-active{
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1) !important;
  opacity: 0 !important; 
  transform: scale(0.95) translateY(40px) !important; 
}

.dialog-transition-enter-from,
.dialog-transition-leave-to {
  opacity: 0 !important; 
  transform: scale(0.95) translateY(40px) !important; 
}

.dialog-transition-enter-to,
.dialog-transition-leave-from {
  opacity: 1 !important;
  transform: scale(1) translateY(0) !important; 
}

.vridge-dialog-container {
  .theme--light & {
    box-shadow: 0px 12px 36px #00000020 !important;
  }

  .theme--dark & {
    box-shadow: 0px 12px 36px #00000080 !important;
    background-color: $dark-primary-background-color !important;
    border:1px solid rgba($dark-card-border-color, 0.2);
  }
}
.vridge-dialog {
  overflow-x: hidden;
  padding-bottom: 0px !important;
  background: transparent !important;

  > .v-card__title {
    font-size: 1.1rem !important;
    padding: 12px 18px !important;
  }

  .vridge-dialog-title {
    position: relative;
  }

  .vridge-content-container {
    padding: 0px 18px !important;
    overflow-x: hidden;
    font-size: 14px;
  }

  .vridge_actions {
    padding: 16px 18px !important;
    position: relative;
  }

  &.line-theme {
    padding: 0px;
    > .v-card__title {
      padding: 12px 18px !important;
    }

    .vridge-content-container {
      border-top: 1px solid $default-border-color;
      padding: 0px !important;
      border-bottom: 1px solid $default-border-color;

      .theme--dark & {
        //background-color: $dark-primary-background-color !important;
      }
    }

    .vridge_actions {
      padding: 12px 18px !important;
    }
  }

  &.no-gutters {
    .vridge-content-container {
      padding: 2px 0px !important;
    }
  }
}
.create-slot-cover {
  padding: 0;
  margin: 0;
  .search-menu-cover {
    display: flex;
    background-color: transparent;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
  }
  .search-menu-check-cover {
    .v-input--selection-controls {
      padding: 0;
      margin: 0;
    }
    .v-messages {
      display: none !important;
    }
  }
}

.v-dialog--persistent {
  .vdp-datepicker,
  .vdpWithInput {
    height: 38px;
    width: 100%;
    input {
      height: 38px;
      padding-left: 12px;
      width: 100%;
      font-size: 15px;
    }
    .vdp-datepicker__calendar {
      bottom: 40px;
    }
  }
}

.vdpClearInput {
  display: none !important;
}

.dateInput >>> input {
  padding: 8px 0px;
  font-size: 13px;
  font-weight: 500;
  opacity: 0.7;
}

.dateInput >>> button::before {
  display: none !important;
}

.calendarCustom {
  font-size: 20px;
  margin-left: -25px;
  position: relative;
  color: #4159b2;
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* .v-dialog{
  overflow-y: initial;
}*/
.search-menu-cover {
  .vdpHeader {
    background: rgba(0, 0, 0, 0.05) !important;
  }
}


</style>
