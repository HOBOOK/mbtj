<template>
  <ul class="folder-tree" :key="treeKey">
    <li v-for="item in items" :key="item.path" no-action sub-group
      :style="depth > 0 ? 'margin-left:' + 1 + 'rem;' : ''">
      <div class="folder-menu-item" @click="onClickItem(item)" :class="{ selected: selectedPath === item.path }">
        <div style="width:24px;">
          <v-btn tile icon x-small color="grey" style="z-index: 10" @click.stop="onExpandClick(item)"
            v-if="item.hasDirectories">
            <v-icon>
              mdi-chevron-{{ !item.expanded ? "right" : "down" }}
            </v-icon>
          </v-btn>
        </div>


        <div class="d-flex" style="position: relative">
          <v-icon style="position: absolute; left: 10px; bottom: 0" small v-if="item.lock"
            color="yellow darken-2">mdi-lock</v-icon>

          <v-icon small left v-if="depth === 0 && rootIcon">
            {{ rootIcon }}
          </v-icon>
          <img v-else class="mr-1" :src="item.expanded
            ? require('~/assets/image/icon/folder-open.svg')
            : require('~/assets/image/icon/folder.svg')
            " width="24" height="24" contain />
          <v-list-item-title>
            <span v-if="depth === 0 && rootName">
              {{ rootName }}
            </span>
            <span v-else>
              {{ item.name }}
            </span>
          </v-list-item-title>
        </div>
      </div>

      <folder-tree v-if="item.expanded && item.hasDirectories" :selectedPath="selectedPath" :depth="depth + 1"
        :path="item.path" :items="item.children" @click:item="onClickItem" :expandOnClick="expandOnClick" />
    </li>
  </ul>
</template>

<script>
export default {
  name: "FolderTree",
  props: {
    selectedPath: String,
    path: String,
    items: Array,
    depth: { type: Number, default: 0 },
    expandOnClick: Boolean,
    rootName: String,
    rootIcon: String
  },

  data() {
    return {
      treeKey: 0,
    };
  },

  mounted() {
  },
  methods: {
    async getFolders(path) {
      // 실제 디렉토리 조회 API 호출

      const response = await this.$axios.get(`/v1/factories/${this.$store.state.factory}/files`, {
        params: {
          type: 'directory',
          dir: path
        }
      }).catch(err => { console.log(err) })
      if (response?.data) {
        return response.data.items
      }
    },

    async onClickItem(item) {
      if (!item.eventIdleTime) {
        item.eventIdleTime = 200;
        if (item.hasDirectories) {
          if (!item.children) {
            try {
              const children = await this.getFolders(item.path);
              item.children = children;

            } catch (err) {
              console.log(err);
            } try {
              const children = await this.getFolders(item.path);
              item.children = children;

            } catch (err) {
              console.log(err);
            }
          }

          if (this.expandOnClick) {
            item.expanded = true
            setTimeout(() => {
              this.treeKey++
            }, 10);
          }

        }


        setTimeout(() => {
          item.eventIdleTime = 0;
        }, 200);
      }

      let parent = this;
      while (parent.$parent) {
        if (parent.depth === 0) {
          parent.$emit("click:item", item);
          if (this.path !== item.path) {
            parent.$emit("update:path", item.path);
          }
          break;
        }
        parent = parent.$parent;
      }
    },



    async onExpandClick(item) {
      if (!item.eventIdleTime) {
        item.eventIdleTime = 200;
        if (item.hasDirectories && !item.children) {
          try {
            const children = await this.getFolders(item.path);
            item.children = children;

          } catch (err) {
            console.log(err);
          }
        }
        item.expanded = !item.expanded

        setTimeout(() => {
          item.eventIdleTime = 0;
          this.treeKey++
        }, 10);
      }
    },
  },
};
</script>

<style lang="scss">
.folder-tree {
  list-style: none;
  margin: 0;
  padding: 0 !important;
  width: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &.root {
    position: relative;
    padding: 0 12px !important;
  }

  .folder-menu-item {
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
    margin: 3px 0;
    height: 30px;

    &.selected {
      opacity: 1 !important;
      // color: #1e88e5 !important;
      color: #fff !important;

      &::after {
        content: "";
        width: calc(100%);
        position: absolute;
        left: 0px;
        margin-top: 6px;
        height: 30px;
        background-color: #1e88e550 !important;
        border-radius: 0.75rem;
        transform: translateY(-3px);
        z-index: -1;
      }
    }

    &.drop {
      &::after {
        content: "";
        width: calc(100%);
        position: absolute;
        left: 0px;
        margin-top: 6px;
        height: 30px;
        border: 2px dashed #1e88e5;
        background-color: #1e88e50a;
        border-radius: 0.75rem;
        transform: translateY(-3px);
      }
    }

    &.dragging {
      opacity: 0.5;
    }

    &:hover {
      &::after {
        content: "";
        position: absolute;
        width: calc(100%);
        margin-top: 6px;
        left: 0px;
        height: 30px;
        background-color: #1e88e50a;
        border-radius: 0.75rem;
      }
    }
  }
}
</style>
