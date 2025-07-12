<template>
  <v-card class="dashboard-item"
    :class="{ ambient: ambient, transparent: transparent, hideBorder: hideBorder, large: large, 'x-large': xLarge, mini: mini, half: half }"
    v-bind="$attrs" :style="{
      pointerEvents: disableEvent ? 'none' : '',
      aspectRatio: aspect
    }">
    <div class="dashboard-item-content" :class="{ loading: loading }" @click="$emit('click')">
      <slot />
    </div>
    <v-overlay v-if="loading" absolute class="loading" :opacity="0.1">
      <div style="width:80px; height:6px;">
        <v-progress-linear rounded indeterminate :width="80" :height="6"></v-progress-linear>
      </div>
    </v-overlay>
  </v-card>

</template>

<script>

export default {
  name: 'DashboardItem',
  props: {
    loading: {
      type: Boolean,
      default: false
    },

    height: {
      type: [Number, String],
      default: ''
    },

    ambient: {
      type: Boolean,
      default: false
    },
    transparent: {
      type: Boolean,
      default: false
    },
    hideBorder: Boolean,
    disableEvent: Boolean,
    large: Boolean,
    xLarge: Boolean,
    mini: Boolean,
    half: Boolean,
    aspect: {
      type: [Number, String],
      default: 2
    }
  },
  components: {
  },
  data() {
    return {

    }
  },
  computed: {
  },

}
</script>

<style lang="scss">
.dashboard-item {
  min-width: 120px !important;
  overflow: hidden;
  border-top: 1px solid rgba(142, 156, 180, 0.3) !important;
  border-left: 1px solid rgba(142, 156, 180, 0.2) !important;
  border-radius: 1.25rem !important;
  background-color: transparent !important;
  background: transparent !important;
  background: linear-gradient(150deg, rgba($dark-primary-deep-background-color, 0.7), rgba($dark-primary-background-color, 0.7), rgba($dark-primary-deep-background-color, 0.3)) !important;
  box-shadow: 3px 6px 8px rgba(0, 0, 0, 0.3) !important;

  .theme--light & {
    border-top: 1px solid rgba(127, 142, 168, 0.1) !important;
    border-left: 1px solid rgba(127, 142, 168, 0.1) !important;
    background: linear-gradient(150deg, $light-primary-background-color, rgba($light-primary-background-color, 0)) !important;
  }

  position: relative;
  z-index: 1;
  flex-grow:1;
  display: flex;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
  pointer-events: all;
  padding-bottom:0px;
  aspect-ratio: 2;


  min-width: min(160px, 100%) !important;
  max-width: 30vw !important;
  width:100%;
  min-height: max(10vh, 120px) !important;
  height:100%;


  &.half {
    aspect-ratio: 1 !important;
  }


  @media (max-width: 1264px),
  (max-height: 800px) {
    max-width: 100% !important;

    &.half {
      max-width: calc(100%) !important;
    }


    &.three {
      max-width: calc(100%) !important;
    }
  }

  &::before {
    content: '';
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;

    .theme--dark & {
      background: rgba($dark-primary-deep-background-color, 0.75);
    }

    .theme--light & {
      background: rgba($light-primary-deep-background-color, 0.75);
    }
    transition: none !important;

    will-change: filter;
    backdrop-filter: blur(32px);
    z-index: -1;
  }

  &::after {
    content: '';
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    position: absolute;
    transition: all .2s ease-in-out;
    background: radial-gradient(circle at 0% 0%,
        rgba(160, 180, 200, 0.12),
        transparent 45%);
    z-index: 10;
  }


  &.transparent {
    box-shadow: none !important;

    &::before {
      opacity: 0;
    }

    &::after {
      opacity: 0;
    }
  }


  // &:hover {
  //   box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.5) !important;


  //   &::after {
  //     transition: all .2s ease-in-out;
  //     background: radial-gradient(circle at 0% 0%,
  //         rgba(160, 180, 200, 0.12),
  //         transparent 80%);
  //   }

  // }

  .loading {
    will-change: filter;
    backdrop-filter: blur(4px);
    transition: all .2s ease-in-out;
  }


  .dashboard-item-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: calc(100% - 0px) !important;
    height: calc(100% - 0px) !important;

    .chart-container {
      border: none !important;
    }

    .v-card__title {

      &.item-title {
        // text-shadow: 0px 0px 32px  #ffffff30, 0px 0px 8px  #ffffff80;
        text-shadow:
          0px 0px 32px #ffffff20,
          0px 0px 8px #ffffff80,
          1px 1px 2px #00000080;
        font-size: 0.938rem !important;
        position: relative;
        padding-left: 24px;
        padding-top: 4px !important;
        padding-bottom: 4px !important;
        padding-right: 4px !important;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;

        // background: rgba(0, 0, 0, 0.8);
        background: linear-gradient(90deg, rgba(teal, 0.25) 60%, transparent) !important;

        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        &.large {
          font-size: 1.2rem !important;
          padding-top: 12px !important;
          padding-left: 16px !important;
          padding-right: 16px !important;

          &::after {
            display: none !important;
          }
        }

        .row {
          flex-wrap: nowrap !important;
        }

        &::after {
          content: '';
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          height: 6px;
          width: 6px;
          border-radius: 100%;
          background-color: rgba(silver, 0.5);
        }
      }

    }


  }


}
</style>