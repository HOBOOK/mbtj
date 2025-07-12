<template>
  <div v-if="!items || items.length === 0">
    <empty :subtext="$t('no_event_message')" icon="mdi-check"/>
  </div>

  <v-list
    v-else
    color="transparent"
    :style="height === 0 ? 'height:100% !important;' : 'height: ' + height + 'px;'"
    style="max-height: 100%; overflow-y: auto"
    dense
    class="py-1"
    v-on:scroll.native="scrollEvent"
  >
    <v-list-item v-for="(item, idx) in filteredItems" :key="'ett-' + idx" class="px-2">
      <v-hover v-slot="{ hover }">
        <v-col
          class="pa-0 fade_down_animation"
        >
          <!-- <v-row no-gutters align="center">
            <v-icon small color="grey"> mdi-circle-medium </v-icon>
            <span class="ml-1 grey--text text-caption">
              {{ $time.formatTimestamp(item[timeAttributeName]) }}
            </span>
            <v-divider />
          </v-row> -->

          <v-row no-gutters align="start">
            <v-col cols="12">
              <v-hover v-slot="{ hover }">
                <v-list-item two-line class="px-2 message-item">
                  <v-icon dense class="px-1" left v-if="icon" :color="color">{{ icon }}</v-icon>

                  <v-list-item-content>
                    <v-list-item-title>
                      <v-row no-gutters align="center">
                        <span
                          class="opacity-5 text-caption"
                          v-if="headerKey && item[headerKey]"
                        >
                          {{ item[headerKey] }}
                        </span>

                        <v-spacer />
                        <span class="opacity-5 text-caption" v-if="item[timeAttributeName]">
                          {{ $time.formatTimestamp(item[timeAttributeName]) }}
                        </span>
                      </v-row>
                    </v-list-item-title>
                    <v-list-item-title :class="color + '--text'">
                      <v-row no-gutters align="center" style="height:24px;">
                        <span v-if="typeof item === 'string' || typeof item === 'number'">
                          {{ item }}
                        </span>
                        <span v-else>
                          {{ $utils.getNestedValue(item, descriptionKey) }}
                        </span>
                        <v-spacer />
                        <span v-if="hover">
                          <v-btn x-small icon tile @click.stop="$emit('check', item)">
                            <v-icon small>mdi-check</v-icon>
                          </v-btn>
                        </span>
                      </v-row>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-hover>
            </v-col>
          </v-row>
        </v-col>
      </v-hover>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "EventTimelineTable",
  inheritAttrs: false,
  props: {
    items: Array,
    height: {
      type: Number,
      default: 200,
    },
    icon: {
      type: String,
      default: "mdi-alert-rhombus-outline",
    },
    descriptionKey: {
      type: String,
      default: "metadata",
    },
    timeAttributeName: {
      type: String,
      default: "timestamp",
    },
    color: {
      type: String,
      default: "yellow",
    },
    sortDesc: {
      type: Boolean,
    },
    headerKey: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      limit: 10,
    };
  },
  computed: {
    filteredItems() {
      return this.items.slice(0, this.limit);
    },
  },
  mounted() {},
  methods: {
    scrollEvent(e) {
      const { scrollTop, clientHeight, scrollHeight } = e.target;

      if (scrollTop + clientHeight >= scrollHeight) {
        this.limit += 5;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.message-item {
  background-color: rgba(0, 0, 0, 0.1);
  margin: 4px 0;
  border-radius: 1rem;
  .theme--light & {
    background: $dark-primary-light-background-color;
    border-radius: 1.2rem;
    display: inline-flex !important;
  }
}
</style>
