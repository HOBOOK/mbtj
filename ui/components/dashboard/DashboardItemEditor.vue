<template>
  <Dialog ref="dashboardItemEditorDialog" v-bind="$attrs" v-on="$listeners" @change="(e) => {
    dialog = e
    $emit('change', dialog)
  }" :title="$t('dashboard') + ' ' + $t('configuration')" :clickYesBtn="$t('save')"
    @click-yes="saveDashboardMetricConfiguration(item)">

    <template v-for="(slot, key) in $scopedSlots" v-slot:[key]="scope">
      <slot :name="key" v-bind="scope" />
    </template>

    <template v-slot:content>
      <v-subheader class="px-0">
        {{ $t('title') }}
      </v-subheader>
      <data-input disabled v-model="item.title" />

      <v-divider class="mt-3" />

      <v-subheader class="px-0">
        Items

      </v-subheader>

      <v-list class="small" dense>
        <!--
                          label: String, // 메트릭 표시 라벨
                          unit: String, // 메트릭 값 단위
                          showLatestData: Boolean, // 가장 마지막값 표시 여부
                          accumulate: Boolean, // 현재 그래프값 합계 표시 여부
                          icon: String,
                          type: String,
                          nodeIds: [String], 
                          metrics: [String],
                          groupBy: String
                        -->
        <v-sheet outlined v-if="dashboardEditMode === 1">
          <v-col cols="12" v-if="targetMetric">
            <data-select title="type" v-model="targetMetric.type" item-text="type" item-value="type"
              :items="chartTypes">
              <template v-slot:selection="{ item }">
                <v-icon small left>{{ item.icon }}</v-icon>
                {{ item.type }}
              </template>
              <template v-slot:item="{ item }">
                <v-icon small left>{{ item.icon }}</v-icon>
                {{ item.type }}
              </template>

            </data-select>

            <data-input title="label" v-model="targetMetric.label" />
            <data-input title="unit" v-model="targetMetric.unit" />
            <data-select title="icon" v-model="targetMetric.icon" :items="icons">
              <template v-slot:selection="{ item }">
                <v-icon small>{{ item }}</v-icon>
              </template>
              <template v-slot:item="{ item }">
                <v-icon small>{{ item }}</v-icon>
              </template>
            </data-select>
            <data-container title="half" description="size of panel">
              <v-checkbox dense hide-details v-model="targetMetric.half" />
            </data-container>
            <data-container v-if="['line', 'bar'].includes(targetMetric.type)" title="showLatestData">
              <v-checkbox dense hide-details v-model="targetMetric.showLatestData" />
            </data-container>
            <data-container v-if="['line', 'bar'].includes(targetMetric.type)" title="accumulate">
              <v-checkbox dense hide-details v-model="targetMetric.accumulate" />
            </data-container>
            <data-select title="Data Source (OPC Node)" multiple v-model="targetMetric.nodeIds" :items="nodeIdList"
              @change="targetMetric.metrics = new Array(targetMetric.nodeIds.length)" search/>


            <v-list class="py-3" dense v-if="targetMetric.nodeIds?.length > 0">
              <v-list-item v-for="(nId, index) in targetMetric.nodeIds" :key="index">
                <v-list-item-content>
                  {{ nId }}
                </v-list-item-content>
                <v-list-item-content>
                  <data-select class="small" v-model="targetMetric.metrics[index]"
                    :items="['sum', 'avg', 'min', 'max', 'count']" />
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <data-select title="groupBy" v-model="targetMetric.groupBy"
              :items="['second', 'minute', 'hour', 'day', 'month', 'year']" />

            <!-- guage type -->
            <data-input v-if="targetMetric.type === 'guage'" type="number" title="max" v-model="targetMetric.max" />

            <v-row class="my-2">
              <v-col cols="6">
                <v-btn block @click="dashboardEditMode = 0"> {{ $t('cancel') }}</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn color="primary" block @click="update(targetMetric)">
                  {{ isEdit ? $t('save') : $t('add') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>

        </v-sheet>

        <div v-else>
          <v-sheet class="my-2 pointer" outlined
            @click="targetMetric = JSON.parse(JSON.stringify(newMetric)), dashboardEditMode = 1, isEdit = false">
            <v-list-item>
              <v-list-item-content class="grey--text">
                <v-row no-gutters align="center" justify="center">
                  <v-icon small left>mdi-plus</v-icon>
                  {{ $t('add') }}
                </v-row>
              </v-list-item-content>

            </v-list-item>

          </v-sheet>

          <draggable v-model="item.items" tag="div" group="shared" @end="onDragEnd">

            <v-sheet class="my-2" outlined v-for="(metricItem, mi) in item.items" :key="mi">
              <v-list-item>
                <v-icon small left>
                  {{ metricItem.icon }}
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-row no-gutters align="center">

                      {{ metricItem.label }}

                      <span class="grey--text ml-3">
                        (
                        <v-icon color="grey" x-small>
                          {{chartTypes.find(e => e.type === metricItem.type)?.icon}}
                        </v-icon>
                        {{ metricItem.type }}
                        )
                      </span>
                    </v-row>

                  </v-list-item-title>

                </v-list-item-content>
                <v-btn class="mr-1" tile x-small icon
                  @click="targetMetric = JSON.parse(JSON.stringify(metricItem)), dashboardEditMode = 1, isEdit = true">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>

                <check-dialog :text="$t('selected_item_delete_message')"
                  @click:yes="item.items.splice(mi, 1), saveDashboardMetricConfiguration(item)" yesColor="red">
                  <template v-slot:button="{ on, attrs }">
                    <v-btn v-on="on" v-bind="attrs" tile x-small icon>
                      <v-icon small color="red">mdi-trash-can-outline</v-icon>
                    </v-btn>

                  </template>
                </check-dialog>

              </v-list-item>

            </v-sheet>

          </draggable>
        </div>



      </v-list>

    </template>
  </Dialog>
</template>

<script>

export default {
  name: "DashboardItemEditor",
  props: {
    item: Object,
    factory: Object,
  },
  data: () => ({
    loading: false,
    dialog: false,
    isEdit: false,
    dashboardEditMode: 0,
    newMetric: {
      label: '',
      type: '',
      icon: '',
      unit: '',
      showLatestData: false,
      accumulate: false,
      nodeIds: [],
      metrics: [],
      groupBy: '',
      max: 0,
      half: false
    },
    nodeIdList: [],
    targetMetric: null,
    icons: ['mdi-pulse', 'mdi-clock-outline', 'mdi-fire', 'mdi-chart-line', 'mdi-account', 'mdi-shield-outline', 'mdi-autorenew', 'mdi-weather-sunny', 'mdi-water-outline', 'mdi-speedometer', 'mdi-thermometer'],
    chartTypes: [{ type: 'line', icon: 'mdi-chart-line' }, { type: 'bar', icon: 'mdi-chart-bar' }, { type: 'guage', icon: 'mdi-chart-donut' }]
  }),
  watch: {
    dialog() {
      this.$emit("change", this.dialog);
      this.$refs.dashboardItemEditorDialog.dialog = this.dialog;
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
      this.dashboardEditMode = 0
      this.isEdit = false
      this.targetMetric = null

      if (this.factory) {
        this.$axios.get(`/v1/factories/${this.factory._id}/nodes`, {
          params: {
            endpoint: this.factory?.configuration?.repeaterServerHost ?? ''
          }
        }).then(res => {
          if (res.data) {
            this.nodeIdList = res.data.map((e) => e.nId)
          }
        }).catch(err => {
          console.log(err)
        })
      }

    },

    update(newItem) {
      if (this.isEdit) {
        const targetItem = this.item.items.find((e) => e._id === newItem._id)
        if (targetItem) {
          for (let k of Object.keys(newItem)) {
            targetItem[k] = newItem[k]
          }
        }
      } else {
        this.item.items.push(this.targetMetric)
      }

      this.dashboardEditMode = 0
    },

    saveDashboardMetricConfiguration(item) {
      this.$axios.put('/v1/factories', {
        _id: this.$store.state.factory,
        'configuration.metricsConfiguration': [item]
      }).then(res => {
      }).catch(err => {
        console.log(err)
      })
    },

    onDragEnd() {
    }
  },
  destroyed() { },
};
</script>
<style lang="scss"></style>
