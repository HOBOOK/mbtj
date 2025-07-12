<template>
  <v-app-bar dense color="transparent" class="bar-container px-0" height="50px">
    <v-row no-gutters align="center" justify="center">
      <span>
        <v-row no-gutters align="center" justify="center">
          <v-btn
            icon
            small
            class="mx-1"
            @click="goToPrevious"
            :disabled="currentIndex <= 0"
          >
            <v-icon small>mdi-arrow-left</v-icon>
          </v-btn>
          <v-btn
            icon
            small
            class="mx-1"
            @click="goToNext"
            :disabled="currentIndex >= history.length - 1"
          >
            <v-icon small>mdi-arrow-right</v-icon>
          </v-btn>
          <v-btn
            icon
            small
            class="mx-1"
            @click="goToParent"
            :disabled="items.length === 1"
          >
            <v-icon small>mdi-arrow-up</v-icon>
          </v-btn>
          <v-btn icon small class="mx-1" @click="refresh">
            <v-icon small>mdi-refresh</v-icon>
          </v-btn>
        </v-row>
      </span>

      <v-card
        label
        :class="{ 'no-action': !navigateActive }"
        class="breadcrumbs-container mx-2"
        style="display: flex; flex-grow: 1; min-height: 36px"
      >
        <v-breadcrumbs :items="items" class="px-4 py-2">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :href="item.href" @click="item.action()">
              <span class="breadcrumbs-text">
                <v-icon
                  v-if="item.icon"
                  small
                  class="breadcrumbs-icon"
                  :class="item.text ? 'right' : ''"
                  >{{ item.icon }}</v-icon
                >
                {{ item.text }}
              </span>
            </v-breadcrumbs-item>
          </template>
          <template v-slot:divider>
            <v-icon class="px-0 mx-0">mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-card>

      <v-card>
        <v-text-field
          v-model="keyword"
          hide-details
          prepend-inner-icon="mdi-magnify"
          solo
          :placeholder="$t('search')"
          @keydown.enter.prevent="search"
          :maxlength="50"
          ref="searchField"
          @input="search"
          clearable
          dense
          style="max-height: 36px; width: 300px"
        />
      </v-card>
    </v-row>
  </v-app-bar>
</template>

<script>
export default {
  name: "FileNavigaitionBar",
  props: {
    path: String,
    navigateActive: {
      type: Boolean,
      default: true,
    },
    startIndex: Number
  },
  data() {
    return {
      items: [],
      keyword: "",
      history: [],
      currentIndex: -1,
    };
  },
  computed: {},
  watch: {
    path(newPath) {
      if (this.currentIndex === -1) {
        this.history = [newPath];
        this.currentIndex = 0;
        this.init();
        return;
      }

      if (this.history[this.currentIndex] === newPath) {
        return;
      }

      this.history = this.history.slice(0, this.currentIndex + 1);

      // 새 경로 push
      this.history.push(newPath);
      this.currentIndex++;

      this.init(); // 새 경로 초기화
    },

    currentIndex() {
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const paths = this.path?.split(/[\\/]+/).filter(Boolean) || [];
      let pathArray = paths
      if(paths.length > this.startIndex) {
        pathArray = paths.slice(this.startIndex + 1)
      }
      this.items = [
        {
          text: pathArray?.length > 0 ? "" : "Home",
          href: "",
          icon: "mdi-home",
          action: () => {
            const itemPath = `${paths.slice(0, this.startIndex + 1).join("/")}`;
            this.navigate(itemPath);
          },
        },
        ...pathArray.map((text, index) => {
          const itemPath = `${paths.slice(0, (this.startIndex + 1) + (index + 1)).join("/")}`;

          return {
            text,
            action: () => {

              this.navigate(itemPath);
            },
          };
        }),
      ];
    },

    navigate(path) {
      this.$emit("update:path", path);
    },

    goToPrevious() {
      this.currentIndex--;
      this.$emit("update:path", this.history[this.currentIndex]);
    },

    goToNext() {
      this.currentIndex++;
      this.$emit("update:path", this.history[this.currentIndex]);
    },

    goToParent() {
      const parentPath = this.path
        .split("/")
        .filter(Boolean)
        .slice(0, -1)
        .join("/");
      this.$emit("update:path", parentPath || "");
    },

    refresh() {
      this.$emit("update:path", this.path);
    },

    search() {
      this.$emit("search", this.keyword);
    },
  },
};
</script>

<style lang="scss">
.bar-container {
  .breadcrumbs-container {
    .breadcrumbs-text {
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.87);
      display: flex;
      justify-content: center;
      align-items: center;
      .theme--light & {
        color: rgba(0, 0, 0, 0.87);
      }
      .theme--dark & {
        color: #fff;
      }
      .breadcrumbs-icon {
        &.right {
          margin-right: 5px;
        }
      }
      &:hover {
        color: #1e88e5;
        cursor: pointer;
        .breadcrumbs-icon {
          color: #1e88e5;
        }
      }
    }

    &.transparent {
      background-color: transparent !important;
    }
  }

  .v-breadcrumbs li:nth-child(even) {
    padding: 0 6px;
  }

  .no-action {
    pointer-events: none !important;
  }
  .v-toolbar__content {
    padding: 4px 8px;
  }
}
</style>
