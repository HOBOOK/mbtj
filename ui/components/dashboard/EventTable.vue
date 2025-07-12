<template>
  <div v-if="!items || items.length === 0">
    <empty :subtext="$t('no_event_message')" icon="mdi-check" />
  </div>

  <v-list v-else color="transparent" :style="height === 0 ? 'height:100% !important;' : 'height: ' + height + 'px;'"
    style="max-height: 100%; overflow-y: auto" dense class="py-1" v-on:scroll.native="scrollEvent">
    <v-list-item v-for="(item, idx) in filteredItems" :key="'ett-' + item._id" class="px-2 py-0">
      <v-hover v-slot="{ hover }">
        <v-col class="pa-0 fade_down_animation">
          <v-row no-gutters align="start">
            <v-col cols="12">
              <v-hover v-slot="{ hover }">
                <v-list-item two-line class="px-3 message-item">
                  <v-list-item-content class="py-0">
                    <v-list-item-title>
                      <v-row no-gutters align="center">
                        <v-icon small left v-if="$severity[item.severity]" :color="$severity[item.severity].color">
                          {{ $severity[item.severity].icon }}
                        </v-icon>

                        <span class="opacity-5 text-caption" v-if="$severity[item.severity]"
                          :class="$severity[item.severity].color + '--text'">
                          {{ $t(item.severity.toLowerCase()) }}
                        </span>

                        <v-chip color="cyan" class="mx-2" small v-if="item.status?.toLowerCase() === 'processing'">
                          {{ $t('processing') }}
                        </v-chip>

                        <v-spacer />
                        <span class="opacity-5 text-caption" v-if="item.timestamp">
                          {{ $time.formatTimestamp(item.timestamp) }}
                        </span>
                      </v-row>
                    </v-list-item-title>
                    <v-list-item-title >
                      <v-row no-gutters align="center" style="height:32px;">
                        <span>
                          {{ item.message }}
                        </span>
                        <v-spacer />
                        <span>
                          <slot name="actions" v-bind="{item}">
                          </slot>
                        
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
  name: "EventTable",
  inheritAttrs: false,
  props: {
    items: Array,
    height: {
      type: Number,
      default: 200,
    },
  },
  computed:{
    filteredItems() {
      return this.items.slice(0, this.limit);
    },
  },
  data() {
    return {
      limit:10,
    }
  },
  mounted() { },
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
  background-color: $dark-primary-light-background-color;
  margin: 4px 0;
  border-radius: 1rem;

  .theme--light & {
    background: $dark-primary-light-background-color;
    border-radius: 1.2rem;
    display: inline-flex !important;
  }
}
</style>
