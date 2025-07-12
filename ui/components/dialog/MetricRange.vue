<template>


  <v-menu offset-y left :close-on-content-click="false" v-model="rangeMenu">
    <template v-slot:activator="{ on, attrs }">
      <v-btn outlined v-on="on" v-bind="attrs" :disabled="loading">
        <v-icon left dense>mdi-clock</v-icon>
        {{ range }}
        <v-icon right dense>mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-card width="400" height="280">
      <v-card-title>
        {{ $t("setting_metric_time_range") }}
      </v-card-title>
      <v-divider />
      <v-card-text style="height: 170px">
        <v-row no-gutters class="fill-height">
          <v-col cols="7" style="max-height: 100%; overflow-y: auto">
            <data-container title="from" class="pr-2">
              <data-input v-model="fromText">
                <template v-slot:append>
                  <v-btn icon small tile><v-icon>mdi-calendar</v-icon></v-btn>
                </template>
              </data-input>
            </data-container>
            <data-container title="to" class="pr-2">
              <data-input v-model="toText">
                <template v-slot:append>
                  <v-btn icon small tile><v-icon>mdi-calendar</v-icon></v-btn>
                </template>
              </data-input>
            </data-container>
          </v-col>
          <v-divider vertical />
          <v-col cols="5" style="max-height: 100%; overflow-y: auto">
            <v-list dense class="small" nav>
              <v-list-item @click="setRange(item)" v-for="(item, idx) in ranges" :key="'range-' + idx">
                {{ item }}
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />
      <v-card-actions>
        <span class="grey--text text-caption mr-2">
          {{ Intl.DateTimeFormat().resolvedOptions().timeZone }}
        </span>
        <v-chip small label outlined class="px-1">
          UTC {{ $time.formatTimezoneOffset(new Date().getTimezoneOffset() / -60) }}
        </v-chip>

        <v-spacer />
        <v-btn small @click="$emit('close')">{{
          $t("close")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>


</template>

<script>
export default {
  name: "MetricRange",
  props: {
    range: {
      type: String,
      default: 'Last 5 minutes'
    },
    loading: Boolean
  },
  data: () => ({
    rangeMenu: false,
    fromText: '',
    toText: '',
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
   
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.setRange(this.range);
    },
    async setRange(parentRange) {
      if (!parentRange) return;

      const range = JSON.parse(JSON.stringify(parentRange))

      let to = Date.now()
      let from = Date.now()
      if (range.includes("Last")) {
        let splitRange = range.split(" ");
        this.toText = "now";
        to = Date.now()

        this.fromText = "now-" + splitRange[1] + splitRange[2][0];
        let value = 0

        switch (splitRange[2][0]) {
          case 'm':
            value = parseInt(splitRange[1]) * 60 * 1000
            break
          case 'h':
            value = parseInt(splitRange[1]) * 60 * 60 * 1000
            break
          case 'd':
            value = parseInt(splitRange[1]) * 24 * 60 * 60 * 1000
            break
          case 'y':
            value = parseInt(splitRange[1]) * 365 * 24 * 60 * 60 * 1000
            break
        }
        from = Date.now() - value

      } else if (range.includes("This")) {
        let splitRange = range.split(" ");
        let t = splitRange[1][0];
        t = t === "m" ? "M" : t;
        this.toText = "now/" + t;
        to = Date.now()
        this.fromText = "now/" + t;

        switch (t) {
          case 'w':
            from = Date.now() - (new Date().getDay() * 24 * 60 * 60 * 1000)
            break
          case 'M':
            from = Date.now() - (new Date().getDate() * 24 * 60 * 60 * 1000)
            break
          case 'y':
            let today = new Date()
            let startOfYear = new Date(today.getFullYear(), 0, 1)
            from = Date.now() - (today - startOfYear)

            break
          default:
            break
        }

      } else if (range === "Today") {
        let today = new Date()
        this.toText = "now/d";
        to = today.getTime()
        this.fromText = "now/d";
        let startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        from = Date.now() - (today - startOfDay)
      }
      this.rangeMenu = false;
      this.$emit('input', from, to, range)
    },
  },
  destroyed() { },
};
</script>
<style lang="scss"></style>
