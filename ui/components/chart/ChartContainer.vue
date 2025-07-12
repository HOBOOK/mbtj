<template>
  <v-card
    no-gutters
    class="chart-container"
    :style="maxWidth ? 'max-width:' + maxWidth + 'px !important;' : ''"
    v-bind="$attrs"
    :class="{
      ambient: ambient,
      transparent: transparent,
      hideBorder: hideBorder,
      hideHoverEffect: hideHoverEffect,
    }"
    :max-height="maxHeight"
    :height="height"
    :max-width="maxWidth"
  >
    <div class="loading-bar">
      <v-progress-linear indeterminate :height="1" v-if="loading"></v-progress-linear>
    </div>
    <v-card-title class="item-title" cols="12" v-if="!hideDefaultTitle && title">
      <v-row no-gutters align="center">
        {{ title }}
        <v-spacer />

        <slot name="header-append" />
      </v-row>
    </v-card-title>

    <v-card-text
      cols="12"
      :class="{ noTitle: hideDefaultTitle || !title, 'px-0': noGutters }"
    >
      <slot name="content" />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "chart",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hideDefaultTitle: {
      type: Boolean,
      default: false,
    },
    height: {
      type: [Number, String],
      default: "100%",
    },
    maxHeight: {
      type: [Number, String],
      default: "100%",
    },
    ambient: {
      type: Boolean,
      default: false,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: [Number],
      default: 0,
    },

    hideHoverEffect: Boolean,
    hideBorder: Boolean,
    noGutters: Boolean
  },
  components: {},
  data() {
    return {};
  },
  computed: {},
};
</script>

<style lang="scss">
.chart-container {
  max-width: 100% !important;
  border: 1px solid $default-card-border-color;
  transition: all 0.2s ease-in-out;
  backdrop-filter: blur(12px);
  will-change: filter;
  min-height: 100px;
  height: 100%;
  position: relative;

  .loading-bar {
    position: absolute;
    top:0;
    height: 1px;
    width:100%;
  }

  .theme--light & {
    box-shadow: none !important;
    background-color: #fff !important;
  }
  .theme--dark & {
    border: 1px solid transparent;
  }

  &.ambient {
    .theme--dark & {
      box-shadow: 0 0 60px rgba(48, 96, 180, 0.01), 0 0 80px rgba(48, 96, 200, 0.03),
        0 0 160px rgba(48, 96, 200, 0.04), 0 0 200px rgba(48, 96, 200, 0.06),
        0 0 300px rgba(48, 96, 200, 0.07) !important;
    }
  }

  &.transparent {
    background-color: transparent !important;
    border: 1px solid $default-card-border-color !important;
  }

  &.hideBorder {
    border: 1px solid transparent !important;
  }

  &:hover {
    filter: brightness(1.05);
    .theme--dark & {
      box-shadow: 0 0 120px rgba(48, 96, 180, 0.02), 0 0 200px rgba(48, 96, 200, 0.03),
        0 0 300px rgba(48, 96, 200, 0.05), 0 0 400px rgba(48, 96, 200, 0.07),
        0 0 500px rgba(48, 96, 200, 0.08) !important;
    }
  }

  &.hideHoverEffect {
    backdrop-filter: none !important;
    &:hover {
      filter: none !important;
      box-shadow: none !important;
    }
  }

  .v-card__title {
    &.item-title {
      text-shadow: 0px 0px 32px #ffffff20, 0px 0px 8px #ffffff60;
      font-size: 0.938rem !important;
      position: relative;
      padding-left: 24px;
      padding-bottom: 4px !important;
      padding-top: 4px !important;
      padding-right: 4px !important;

      .row {
        flex-wrap: nowrap !important;
        white-space: nowrap;
      }

      &::after {
        content: "";
        position: absolute;
        left: 6px;
        top: 50%;
        transform: translateY(-50%);
        height: 6px;
        width: 6px;
        border-radius: 100%;
        background-color: rgba(silver, 0.5);
      }
    }
  }

  .v-card__text {
    max-height: calc(100% - 40px) !important;
    height: calc(100% - 40px) !important;
    width: 100%;

    &.noTitle {
      max-height: calc(100% - 0px) !important;
      height: calc(100% - 0px) !important;
    }

    .chart-data {
      height: calc(100% - 0px);
      max-height: calc(100% - 0px);
      overflow: hidden;
      width: 100%;

      canvas {
        width: 100%;
        height: 100%;
        min-height: 100% !important;
      }
    }
  }
}
</style>
