<template>
  <ul
    class="item-tree"
    :class="{ root: depth === 0, 'no-gutters': noGutters }"
    @dragleave="onDragLeave"
  >
    <li
      v-for="(item, idx) in items"
      :key="item[idAttr] + key + idx + depth"
      no-action
    >
      <v-hover v-slot="{ hover }">
        <div
          class="item-tree-item"
          :class="{
            selected: selectedItems.includes(item[idAttr]),
            drop:
              depth === 0
                ? dropTargetRootKey === item[idAttr]
                : dropTargetKey === item[idAttr],
            dragging: draggedTargetRootKey === item[idAttr],
          }"
          @dragstart="onDragStart($event, item)"
          @drop.prevent="onDrop($event, item)"
          @dragover.prevent="onDragOver($event, item)"
          @dragend="onDragEnd"
          :draggable="draggable"
          @click.stop="onClickItem($event, item)"

          @contextmenu.prevent="onContextItem($event, item, idx, depth)"
        >
          <span class="item-children-icon">
            <v-icon
              small
              @click.stop="onClickActiveItem($event, item)"
              v-if="item[childrenAttr]?.length > 0 && checkValid(item)"
              >mdi-chevron-{{
                activeItems.includes(item[idAttr]) ? "down" : "right"
              }}</v-icon
            >
          </span>

          <span class="item-content" :class="{ hover: hover }">
            <v-icon
              v-if="iconOption"
              small
              tile
              style="margin:0 2px"
              :color="getColorByType(getNestedProperty(item, typeAttr), item.type)"
            >
              {{ getIconByType(getNestedProperty(item, typeAttr), item.type) }}
            </v-icon>

            {{ item[nameAttr] ? item[nameAttr] : item.type }}

            <slot name="item-content-append" v-bind="{ item }"></slot>
          </span>

          <v-row
            no-gutters
            v-if="hover || selectedItems.includes(item[idAttr])"
            class="actions"
          >
            <v-btn
              x-small
              icon
              tile
              @click.stop="onClickVisible(item)"
              v-if="hideOption && item.visible !== undefined"
            >
              <v-icon x-small>mdi-eye{{ item.visible ? "" : "-off" }}</v-icon>
            </v-btn>

            <v-btn
              class="mr-1"
              x-small
              icon
              tile
              @click.stop="onClickLock(item)"
              v-if="lockOption"
            >
              <v-icon x-small
                >mdi-lock-{{
                  item.unselectable ? "outline" : "open-variant-outline"
                }}</v-icon
              >
            </v-btn>

            <slot name="actions" v-bind="{ item }"></slot>
          </v-row>
        </div>
      </v-hover>

      <item-tree
        :depth="depth + 1"
        :eventBus="eventBus"
        :items="item[childrenAttr]"
        :activeItems="activeItems"
        @click:item="onClickItem"
        @click:active="onClickActiveItem"
        @click:visible="onClickVisible"
        @click:lock="onClickLock"
        @context:item="onContextItem"
        v-if="
          checkValid(item) && item[childrenAttr] && activeItems.includes(item[idAttr])
        "
        :hideOption="hideOption"
        :iconOption="iconOption"
        :lockOption="lockOption"
        :idAttr="idAttr"
        :nameAttr="nameAttr"
        :typeAttr="typeAttr"
        :childrenAttr="childrenAttr"
        :selectedItems="selectedItems"
        :eventIdleTime="eventIdleTime"
        :draggable="draggable"
        :openTree="openTree"
        @drag:start="onDragStart"
        @drop:start="onDragOver"
        @drop:end="onDrop"
        @drag:end="onDragEnd"
        :dropTargetKey="dropTargetRootKey"
        :valid="valid"
        :indexMap="indexMap"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <template v-for="(slot, key) in $scopedSlots" v-slot:[key]="scope">
          <slot :name="key" v-bind="scope" />
        </template>
      </item-tree>
    </li>
  </ul>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "ItemTree",
  props: {
    items: Array,
    selectedItems: {
      type: Array,
      default: () => {
        return [];
      },
    },
    hideOption: Boolean,
    iconOption: Boolean,
    lockOption: Boolean,
    eventBus: Number,
    draggable: Boolean,
    valid: Array,
    depth: {
      type: Number,
      default: 0,
    },
    depthActive: {
      type: Number,
      default: 3,
    },
    idAttr: {
      type: String,
      default: "id",
    },
    nameAttr: {
      type: String,
      default: "name",
    },
    typeAttr: {
      type: String,
      default: "type",
    },
    childrenAttr: {
      type: String,
      default: "children",
    },
    parentAttr: {
      type: String,
      default: "parent",
    },
    eventIdleTime: {
      type: Number,
      default: 200,
    },
    activeItems: {
      type: Array,
      default: () => {
        return [];
      },
    },
    drop: Boolean,
    dropTargetKey: [String, Number],
    draggedTargetKey: [String, Number],
    openTree: Boolean,
    indexMap: {
      type: Map,
      default: () => {
        return new Map();
      },
    },
    noGutters: Boolean,
  },
  watch: {
    // selectedItem() {
    //   if (this.selectedItem) {
    //     for(let item of this.items) {
    //       let parentItems = this.findParentTree(item, this.selectedItem[this.idAttr])
    //       if(parentItems?.length) {
    //         for(let p of parentItems) {
    //           this.addActiveItem(p[this.idAttr])
    //         }
    //       }
    //     }
    //   }
    // },
    items() {
      this.generateItemMap();
    },
  },
  mounted() {
    this.generateItemMap();

    window.addEventListener("keydown", this.keyEvent);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keyEvent);
  },
  data() {
    return {
      key: 0,
      draggedIndex: null,
      draggedItem: null,
      hoveredElement: null,
      itemMapTemp: null,

      dropTarget: null,
      dropTargetRootKey: "",
      draggedTargetRootKey: "",
      hoveredItem: null,
    };
  },
  methods: {
    keyEvent(e) {
      this.$emit("keydown", e, this.selectedItems);
    },
    checkValid(item) {
      if (this.valid) {
        for (let v of this.valid) {
          return v(item);
        }
      }
      return true;
    },
    generateItemMap() {
      if (this.depth === 0) {
        let index = 0;
        const generateMap = (item, depth) => {
          if (!item) return;

          item.index = index++;
          item.depth = depth;
          this.indexMap.set(item[this.idAttr], item.index);

          if (item[this.childrenAttr]?.length > 0) {
            for (let child of item[this.childrenAttr]) {
              generateMap(child, depth + 1);
            }
          }
        };

        for (let item of this.items) {
          generateMap(item, 0);
        }
      }
    },

    openItemTree(target) {
      if (target) {
        for (let item of this.items) {
          let parentItems = this.findParentTree(item, target[this.idAttr]);
          if (parentItems?.length) {
            for (let p of parentItems) {
              this.addActiveItem(p[this.idAttr]);
            }
          }
        }
      }
    },

    openItemTreeTopDown(target) {
      if (target) {
        const findItem = (item, id) => {
          if (item[this.idAttr] === id) {
            this.openItemTree(item);
            return;
          }

          if (item.children?.length > 0) {
            for (let c of item.children) {
              findItem(c, id);
            }
          }
        };

        for (let item of this.items) {
          if (typeof target === "object") {
            findItem(item, target[this.idAttr]);
          } else {
            findItem(item, target);
          }
        }
      }
    },

    onClickActiveItem(e, item) {
      if (!item.eventIdleTime) {
        if (item[this.childrenAttr]?.length > 0) {
          item.eventIdleTime = this.eventIdleTime;

          let index = this.activeItems.indexOf(item[this.idAttr]);
          if (index !== -1) {
            this.removeActiveItem(item[this.idAttr]);
          } else {
            this.addActiveItem(item[this.idAttr]);
          }
          this.key++;

          setTimeout(() => {
            item.eventIdleTime = 0;
          }, this.eventIdleTime);
        }
      }

      let parent = this;
      while (parent.$parent) {
        if (parent.depth === 0) {
          parent.$emit("click:active", e, item);
          break;
        }
        parent = parent.$parent;
      }
    },

    onClickItem(e, item) {
      if (!item.eventIdleTime) {
        item.eventIdleTime = this.eventIdleTime;
        if (item[this.childrenAttr]?.length > 0) {
          if (this.openTree) {
            this.openItemTree(item);
          }
          this.key++;
        }

        setTimeout(() => {
          item.eventIdleTime = 0;
        }, this.eventIdleTime);
      }

      let parent = this;
      while (parent.$parent) {
        if (parent.depth === 0) {
          parent.$emit("click:item", e, item, this.indexMap);
          break;
        }
        parent = parent.$parent;
      }
    },

    onContextItem(e, item) {
      if (!item.eventIdleTime) {
        if (item[this.childrenAttr]?.length > 0) {
          item.eventIdleTime = this.eventIdleTime;
        }
        setTimeout(() => {
          item.eventIdleTime = 0;
        }, this.eventIdleTime);
      }

      let parent = this;
      while (parent.$parent) {
        if (parent.depth === 0) {
          parent.$emit("context:item", e, item);
          break;
        }
        parent = parent.$parent;
      }
    },

    findParentTree(data, targetId, parentTree = []) {
      if (data[this.idAttr] === targetId) {
        return [...parentTree, data];
      }

      if (data.children) {
        for (const child of data.children) {
          const result = this.findParentTree(child, targetId, [...parentTree, data]);
          if (result) {
            return result;
          }
        }
      }

      return null;
    },

    getNestedProperty(obj, path) {
      return path.split(".").reduce((acc, key) => acc && acc[key], obj);
    },

    removeActiveItem(item) {
      let index = this.activeItems.indexOf(item);
      if (index !== -1) {
        this.activeItems.splice(index, 1);
      }
    },

    addActiveItem(item) {
      let index = this.activeItems.indexOf(item);
      if (index !== -1) {
        this.activeItems.splice(index, 1);
      }
      this.activeItems.push(item);
    },

    onClickVisible(item) {
      if (!item.eventIdleTime) {
        item.eventIdleTime = this.eventIdleTime;

        item.visible = !item.visible;
        setTimeout(() => {
          item.eventIdleTime = 0;
        }, this.eventIdleTime);
      }

      let parent = this;
      while (parent.$parent) {
        if (parent.depth === 0) {
          parent.$emit("click:visible", item);
          break;
        }
        parent = parent.$parent;
      }
    },

    onClickLock(item) {
      if (!item.eventIdleTime) {
        item.eventIdleTime = this.eventIdleTime;

        item.unselectable = !item.unselectable;
        setTimeout(() => {
          item.eventIdleTime = 0;
        }, this.eventIdleTime);
      }
      let parent = this;
      while (parent.$parent) {
        if (parent.depth === 0) {
          parent.$emit("click:lock", item);
          break;
        }
        parent = parent.$parent;
      }
    },

    getIconByType(type, defaultValue) {
      if (type) {
        type = type.toLowerCase();
        return this.$iconPack.getIcon(type);
      } else if (defaultValue) {
        defaultValue = defaultValue.toLowerCase();
        return this.$iconPack.getIcon(defaultValue);
      }

      return "mdi-file-outline";
    },

    getColorByType(type, defaultValue) {
      if (type) {
        type = type.toLowerCase();
        return this.$iconPack.getColor(type);
      } else if (defaultValue) {
        defaultValue = defaultValue.toLowerCase();
        return this.$iconPack.getColor(defaultValue);
      }
      return "";
    },

    onDragStart(e, item) {
      let parent = this;
      while (parent.$parent) {
        if (parent.depth === 0) {
          parent.$emit("drag:start", e, item);
          break;
        }
        parent = parent.$parent;
      }
      this.draggedTargetRootKey = item[this.idAttr];
    },

    onDragEnd() {
      let parent = this;
      while (parent.$parent) {
        if (parent.depth === 0) {
          parent.$emit("drag:end");
          break;
        }
        parent = parent.$parent;
      }
      this.draggedTargetRootKey = "";
      this.dropTargetRootKey = "";
    },

    onDragOver(e, item) {
      this.dropTarget = item;
      this.dropTargetRootKey = item[this.idAttr];
      e.dataTransfer.dropEffect = "move";

      let parent = this;
      while (parent.$parent) {
        if (parent.depth === 0) {
          parent.$emit("drop:start", e, item);
          break;
        }
        parent = parent.$parent;
      }
    },

    onDrop(e, item) {
      let parent = this;
      while (parent.$parent) {
        if (parent.depth === 0) {
          parent.$emit("drop:end", e, item);
          break;
        }
        parent = parent.$parent;
      }
      this.dropTarget = null;
      this.dropTargetRootKey = "";
    },

    onDragLeave(e) {
      const root = e.currentTarget;
      if (!root.contains(e.relatedTarget)) {
        this.dropTarget = null;
        this.dropTargetRootKey = "";
      }
    },
  },
});
</script>

<style lang="scss">
.item-tree {
  list-style: none;
  margin: 0;
  padding: 0;
  padding-left: 16px !important;
  width: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &.root {
    padding: 8px 0px 8px 8px !important;

    &.no-gutters {
      padding: 0 !important;
    }
  }

  li {
    margin: 0;
    padding: 0;
    position: relative;
    width: 100%;

    .item-tree-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      min-width: calc(100% - 6px);
      width: calc(100% - 6px);
      max-width: unset !important;
      position: relative;
      cursor: pointer;
      padding-top: 3px;
      padding-bottom: 3px;
      opacity: 0.8;
      border-top: 1px solid transparent;

      &:hover {
        opacity: 1;
      }

      &.selected {
        opacity: 1 !important;

        &::after {
          position: absolute;
          content: "";
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 0.25rem;
          pointer-events: none;

          // .theme--light & {
          //   background-color: #cccccc30;
          // }
          .theme--dark & {
            background-color: #99999930;
          }

          z-index: -1;
        }
      }

      &.drop {
        &::after {
          content: "";
          width: calc(100%);
          position: absolute;
          left: -5px;
          top: 5px;
          height: 21px;
          border: 1px dashed #1e88e5;
          background-color: #1e88e50a;
          border-radius: 0.75rem;
        }
      }

      &.dragging {
        opacity: 0.5;
      }

      .item-content {
        max-width: 100%;
        width: 100%;
        min-height: 21px;
        height: 21px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        /* 말줄임 적용 */
        margin: 0;
        padding: 0;

        &.selected {
          font-weight: bold;
          // width: calc(100% - 56px) !important;
        }
      }

      .item-children-icon {
        width: 16px;
      }

      .actions {
        flex-wrap: nowrap;
        height: 21px;
        width: 52px;
        position: absolute;
        right: 0;
      }
    }

    .item-children {
      position: absolute;
      width: 1px;
      left: 7px;
      top: 33px;
      height: calc(100% - 38px);
      background: $default-border-color;
    }
  }
}
</style>
