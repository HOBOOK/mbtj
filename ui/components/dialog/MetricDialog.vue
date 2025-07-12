<template>
  <Dialog
    v-bind="$attrs"
    v-on="$listeners"
    ref="metricDialog"
    @change="(e) => {
      dialog = e
      $emit('change', dialog)
    }"
    noGutters
    closeButton
    hideDefaultButton
  >
    <template v-for="(slot, key) in $scopedSlots" v-slot:[key]="scope">
      <slot :name="key" v-bind="scope" />
    </template>

    <template v-slot:content>
      <v-row no-gutters class="px-3" >
        <v-spacer />

        <metric-range :range="range" @close="$refs.metricDialog.dialog = false" @input="(f,t,r) => {
          loadMetric(f, t, r)
        }"/>

        <v-btn class="mx-2" outlined @click="loadMetric(from, to, range)" :loading="loading">
          <v-icon left dense>mdi-reload</v-icon>
          Refresh
        </v-btn>

        <v-menu offset-y left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon tile outlined v-on="on" v-bind="attrs">
              <v-icon dense>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>

          <v-list dense class="small">
            <v-list-item @click="$emit('download:csv')" v-if="$listeners['download:csv']">
              <v-list-item-icon>
                <v-icon>mdi-file-excel</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                액셀(.csv) 다운로드
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>


      </v-row>

      <div :style="`height: ${$attrs.height}px; max-height: ${$attrs.height}px;` ">
        <slot name="content" v-bind="{ from, to, loading }"></slot>
      </div>

    </template>
  </Dialog>
</template>

<script>
export default {
  name: "MetricDialog",
  props: {
    range: {
      type: String,
      default: 'Last 5 minutes'
    }
  },
  data: () => ({
    loading: false,
    dialog: false,
    rangeMenu: false,
    from: "",
    to: "",
    ranges: [
      "Last 5 minutes",
      "Last 15 minutes",
      "Last 30 minutes",
      "Last 1 hours",
      "Last 3 hours",
      "Last 6 hours",
      "Last 12 hours",
      "Last 24 hours",
      "Last 2 days",
      "Last 7 days",
      "Last 30 days",
      "Last 90 days",
      "Last 1 year",
      "Last 2 year",
      "Last 5 years",
      "Today",
      "This week",
      "This month",
      "This year",
    ],
  }),
  watch: {
    dialog() {
      this.$emit("change", this.dialog);
      this.$refs.metricDialog.dialog = this.dialog;
      if (this.dialog) {
        this.init()
      } else {
        this.$emit("click-no", this.dialog);
        this.$emit("close", this.dialog);
      }
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (!this.$store.state.metric) {
        this.$store.state.metric = {
          range: this.ranges[0],
        };
      }
    },
    async loadMetric(from, to, range) {
      if(this.loading || !this.dialog) return

      this.from = from
      this.to = to

      this.loading = true;
      this.$emit("load", {
        from: from, 
        to: to, 
        range: range ? range : this.range
      });

      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
  },
  destroyed() {},
};
</script>
<style lang="scss"></style>
