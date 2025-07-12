<template>
  <div class="data-table" :class="$slots.top ? 'top' : ''">
    <slot name="append-top"> </slot>

    <div
      v-if="!$slots.top && !hideDefaultTop"
      class="data-table-default-header"
      :class="fixedHeader ? 'fixed' : ''"
    >
      <span class="font-weight-bold ml-4" v-if="title">
        {{ title ? title : $t("all") }}
      </span>

      <v-spacer />

      <div class="mx-2 align-center d-flex" v-if="itemsLength > 0">
        <span class="font-weight-bold mr-1">
          {{ itemsLength }}
        </span>
        {{ $t("data_suffix") }}
      </div>

      <v-select
        :items="pageArray"
        @input="page = $event"
        v-model="page"
        dense
        hide-details
        solo
        append-icon=""
        :menu-props="{ bottom: true, offsetY: true }"
        class="page-select"
      >
        <template v-slot:selection="{ item }">
          <v-chip class="page-count" label color="transparent">
            {{ item }}
            <span class="text-caption ml-1 grey--text"> / {{ pageCount }}</span>
          </v-chip>
        </template>

        <template v-slot:prepend-item>
          <data-input
            dense
            hide-details
            type="number"
            v-model="itemsPerPageValue"
            :min="5"
            :max="50"
          >
            <template v-slot:prepend-inner>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-on="on" v-bind="attrs" left small class="mt-1"
                    >mdi-information-outline</v-icon
                  >
                </template>

                <span>
                  {{ $t("table_items_per_count") }}
                </span>
              </v-tooltip>
            </template>
          </data-input>
        </template>
      </v-select>

      <v-btn small icon tile @click="page--" :disabled="page === 1">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-btn
        small
        icon
        tile
        @click="page++"
        :disabled="page === pageCount || pageCount === 0"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>

      <Search @search="searched" v-if="!hideSearch">
        <template v-slot:activator="{ on, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="tooltip">
              <v-btn
                small
                icon
                tile
                v-on="on"
                v-bind="attrs"
                v-if="!keyword"
                :disabled="itemsLength === 0"
              >
                <v-icon v-on="tooltip.on" v-bind="tooltip.attrs"
                  >mdi-magnify</v-icon
                >
              </v-btn>

              <v-btn small v-else icon tile @click="keyword = ''">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>
              {{ $t("search") }}
            </span>
          </v-tooltip>
        </template>
      </Search>

      <v-tooltip bottom v-if="!hideRefresh">
        <template v-slot:activator="{ on, attrs }">
          <v-btn small v-on="on" v-bind="attrs" icon tile @click="refresh">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>
          {{ $t("refresh") }}
        </span>
      </v-tooltip>

      <slot name="append-header"/>
    </div>

    <v-data-table
      v-if="!loading"
      v-bind="$attrs"
      v-on="$listeners"
      :search="keyword"
      :hide-default-header="hideDefaultHeader"
      hide-default-footer
      :page.sync="page"
      @page-count="pageCount = $event"
      @pagination="pagination"
      @click:row="onClickRow"
      @dblclick:row="onDoubleClickRow"
      @contextmenu:row="onContextMenu"
      :item-class="itemClass"
    >
      <template v-for="(slot, key) in $scopedSlots" v-slot:[key]="scope">
        <slot :name="key" v-bind="scope" />
      </template>
      <template v-slot:no-data>
        <empty :text="$t('no_data')" :subtext="$t('no_data_message')" />
      </template>

      <template v-slot:no-results>
        <empty
          :text="$t('no_search_result')"
          :subtext="$t('no_search_result_message')"
        />
      </template>
    </v-data-table>

    <loading-data v-else />

    <v-menu
      offset-y
      absolute
      min-width="180"
      max-width="180"
      v-model="contextMenu"
      :position-x="contextMenuPosX"
      :position-y="contextMenuPosY"
      transition="slide-y-transition"
    >
      <v-list
        dense
        v-if="contextItem"
        style="width: 100%; overflow-y: hidden"
        nav
        class="small"
      >
        <v-list-item @click="onClickRow(contextItem)" justify="center">
          <v-list-item-icon>
            <v-icon dense>mdi-cursor-default-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            {{ $t("select") }}
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="onClickRawItem" justify="center">
          <v-list-item-icon>
            <v-icon dense>mdi-code-json</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            {{ $t("view_raw") }}
          </v-list-item-content>
        </v-list-item>

        <slot name="contextItem" v-bind="{ item: contextItem }"></slot>
      </v-list>
    </v-menu>

    <v-dialog v-model="detailDialog" :max-width="600" scrollable>
      <v-card v-if="contextItem">
        <v-card-title>
          <v-row no-gutters align="center" justify="center">
            {{ $t("view_raw") }}
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-treeview dense :items="rawObjectItems"></v-treeview>
        </v-card-text>

        <v-card-actions>
          <v-row no-gutters align="center" justify="center">
            <v-btn color="primary" @click="detailDialog = false">{{
              $t("okay")
            }}</v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "DataTable",
  inheritAttrs: false,
  props: {
    loading: Boolean,
    title: String,
    // itemsPerPage: {
    //     type:[Number, String],
    //     default:20
    // },
    hideSearch: Boolean,
    hideRefresh: Boolean,
    hideDefaultTop: Boolean,
    hideDefaultHeader: {
      type: Boolean,
      default: true
    },
    fixedHeader: Boolean,
  },
  data() {
    return {
      keyword: "",
      page: 1,
      detailDialog: false,
      pageCount: 0,
      itemsLength: 0,
      selectedItem: null,
      contextMenu: false,
      contextItem: null,
      contextMenuPosX: 0,
      contextMenuPosY: 0,
      rawObjectItems: [],
      itemsPerPageValue: this.$store.state.ui.dataTableItemsPerPage || 20,
    };
  },
  computed: {
    pageArray() {
      let array = [];
      for (let i = 0; i < this.pageCount; i++) {
        array.push(i + 1);
      }
      return array;
    },
  },
  watch: {
    itemsPerPageValue() {
      this.$store.state.ui.dataTableItemsPerPage = Math.min(
        Math.max(5, parseInt(this.itemsPerPageValue) || 20),
        50
      );
      this.$store.commit("setUi", this.$store.state.ui);
    },
  },
  methods: {
    searched(keyword) {
      this.keyword = keyword;
    },
    refresh() {
      this.$emit("refresh");
    },
    pagination(pagination) {
      this.itemsLength = pagination.itemsLength;
    },
    onClickRow(item) {
      if (item === this.selectedItem) {
        this.selectedItem = null;
      } else {
        this.selectedItem = item;
      }
      this.$emit("click:item", this.selectedItem);
    },
    onDoubleClickRow(e, row) {
      if (row.item) {
        this.$emit("dblclick:item", row.item);
      }
    },
    itemClass(item) {
      if (this.selectedItem && this.selectedItem === item) {
        return "selected";
      } else {
        if (item.checked) return "checked";
        else return "";
      }
    },
    onContextMenu(e, item) {
      e.preventDefault();
      this.contextItem = item.item;
      this.contextMenuPosX = e.clientX;
      this.contextMenuPosY = e.clientY;
      this.$nextTick(() => {
        this.contextMenu = true;
      });
    },
    onClickRawItem() {
      this.detailDialog = true;
      this.contextMenu = false;

      this.rawObjectItems = this.$utils.jsonToArray(this.contextItem, 4);
    },
  },
};
</script>

<style lang="scss">
.data-table {
  max-width: 100%;
  max-height: 100%;
  height: 100%;
  position: relative;
  // overflow-y: auto;

  .data-table-default-header {
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: auto;
    width: 100%;
    border-bottom: 1px solid $default-border-color;

    &.fixed {
      position: sticky;
      top: 0px;
      z-index: 2;
      .theme--dark & {
        background-color: $dark-primary-deep-background-color;
      }
      .theme--light & {
        background-color: $light-primary-deep-background-color;
      }
    }
  }

  

  .v-data-table {
    max-height: 100%;
    // height: 100%;
  }

  .v-data-table__wrapper {
    max-height: calc(100% - 90px);
    background: transparent !important;

    table {
      position: relative;
      .v-data-table-header {
        z-index: 1;
        position: sticky;
        top: 0px;
        background: transparent !important;
        background-color: transparent !important;
        &::after {
          display: block;
          position: absolute;
          background: transparent !important;
          left: 0;
          top: 0;
          content: "";
          width: 100%;
          z-index: -1;
          height: 100%;
          // backdrop-filter: blur(2px);
          will-change: filter;
        }
        th {
          background: transparent !important;
        }
      }

      max-height: 100%;
      height: 100%;

      tbody {
        max-height: 300px;
      }
    }
  }

  .page-select {
    max-width: 70px !important;
    .v-input__control {
      .v-input__slot {
        padding: 0 !important;
        background-color: transparent !important;
        border: none !important;

        input {
          display: none !important;
        }
      }
    }

    .page-count {
      width: 100%;
      text-align: center;
      max-width: 70px;
      width: 70px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
    }
  }

  .checked {
    opacity: 0.5;
  }

  table {
    border-collapse: collapse !important;

    thead{
      tr{
        th{
          font-size: 1rem !important;
          font-weight: 400 !important;
   
          .theme--dark &{
            // color: #ffffffa0 !important;
          }

        }
      }
    }

    tbody{
      tr{
        &:nth-child(odd) {
        }
        &:nth-child(even){
          background-color: rgba($dark-primary-light-background-color, .5) !important;

        }
      }
    }
  }

  tr {
    &.selected {
      position: relative;
      font-weight: bold !important;
      &::after {
        content: "";
        position: absolute !important;
        left: 3px !important;
        top: 3px !important;
        z-index: 0;
        border: 2px solid $primary-border-color !important;
        background-color: #1e88e505;
        width: calc(100% - 6px) !important;
        height: calc(100% - 6px) !important;
        border-radius: 0.25rem;
        pointer-events: none;
      }
      td {
        z-index: 10 !important;
      }
    }

    td {
      padding: 0px 12px !important;
    }
  }
}
</style>
