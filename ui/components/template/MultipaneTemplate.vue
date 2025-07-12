<template>
  <v-row no-gutters class="multipane-template-container">
    <multipane @paneResizeStart="onPanelResizeStart" @paneResizeStop="onPanelResizeStop" @paneResize="onPanelResize"
      layout="horizontal" class="multipane-container">
      <div :style="!extend ? 'flex-grow:1; max-height:100%;' : 'max-height:calc(100% - 320px);'
        " class="multipane-template-body">
        <slot name="body" />

        <multipane class="multipane-container"
          style="position: absolute; left: 0; top: 0; pointer-events: none; z-index: 10"
          @paneResizeStop="onPanelResizeStop">
          <div style="min-width: 420px; z-index: 5; position: relative" class="menu-container"
            :class="$store.state.ui[id]?.dashboardMenu ? '' : 'right'" :style="'width:calc(100% - ' +
              ($store.state.ui[id]?.dashboardMenuWidth || 0) +
              'px);'
              ">
            <div v-if="$slots.footer" class="footer fade_up_animation delay_300">
              <slot name="footer" />
            </div>
          </div>

          <multipane-resizer style="pointer-events: auto" v-if="!hideMenu">
            <v-btn class="opacity-9 px-0 active-button" large @click="onClickMenu" :elevation="0" tile>
              <v-icon small :class="$store.state.ui[id]?.dashboardMenu ? '' : 'mdi-flip-h'">mdi-play</v-icon>
            </v-btn>
          </multipane-resizer>

          <div v-if="$store.state.ui[id]?.dashboardMenu && !hideMenu" class="menu-container right" id="dashboardMenu"
            style="flex-grow: 1; pointer-events: auto">
            <div style="
                display: flex;
                flex-direction: row;
                position: relative;
                height: 100%;
                max-height: 100%;
              ">
              <div style="
                  position: absolute !important;
                  right: 48px;
                  max-width: calc(100% - 48px);
                  width: calc(100% - 48px) !important;
                  height: calc(100%);
                  max-height: calc(100%);
                  overflow: hidden;
                " class="monitoring-content">
                <v-list-item dense style="height:50px;">
                  <v-list-item-content class="pa-0">
                    <strong>{{ $t(menuItem) }}</strong>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-menu offset-y bottom left v-if="menuItems.filter(
                      (e) => e.title === menuItem
                    )[0]?.actions">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn class="ml-1" small tile icon v-on="on" v-bind="attrs">
                          <v-icon>mdi-dots-horizontal</v-icon>
                        </v-btn>
                      </template>

                      <v-list dense class="small" style="min-width:140px;">

                        <div v-for="(action, idx) in menuItems.filter((e) => e.title === menuItem)[0]?.actions"
                          :key="'action-' + idx">
                          <v-menu v-if="action.subActions?.length > 0" offset-x left close-on-content-click>
                            <template v-slot:activator="{ on, attrs }">
                              <v-list-item v-on="on" v-bind="attrs" @click="">
                                <v-list-item-icon><v-icon>mdi-menu-left</v-icon></v-list-item-icon>
                                <v-list-item-title>
                                  {{ action.text }}
                                </v-list-item-title>
                              </v-list-item>
                            </template>

                            <v-list dense class="small" style="min-width:140px;">

                              <div v-for="(subAction, idx) in action.subActions" :key="'action-' + idx">
                                <v-menu v-if="subAction.subActions?.length > 0" offset-x left open-on-hover>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-list-item v-on="on" v-bind="attrs" @click="">
                                      <v-list-item-icon><v-icon>mdi-menu-left</v-icon></v-list-item-icon>
                                      <v-list-item-title>
                                        {{ subAction.text }}
                                      </v-list-item-title>
                                    </v-list-item>
                                  </template>

                                  <v-list dense class="small" style="min-width:140px;">
                                    <v-list-item @click="subSubAction.event()"
                                      v-for="(subSubAction, idx) in subAction.subActions"
                                      v-if="!subSubAction.hidden || (subSubAction.hidden && !subSubAction.hidden())"
                                      :key="'action-' + idx">
                                      <v-list-item-icon><v-icon>{{ subSubAction.icon }}</v-icon></v-list-item-icon>
                                      <v-list-item-title>
                                        {{ subSubAction.text }}
                                      </v-list-item-title>
                                    </v-list-item>

                                  </v-list>
                                </v-menu>

                                <v-list-item @click="subAction.event()"
                                  v-else-if="!subAction.hidden || (subAction.hidden && !subAction.hidden())">
                                  <v-list-item-icon>
                                    <v-icon>{{ subAction.icon }}</v-icon>

                                  </v-list-item-icon>
                                  <v-list-item-title>
                                    {{ subAction.text }}
                                  </v-list-item-title>
                                </v-list-item>
                              </div>

                            </v-list>
                          </v-menu>

                          <v-list-item @click="action.event()"
                            v-else-if="!action.hidden || (action.hidden && !action.hidden())">
                            <v-list-item-icon><v-icon>{{ action.icon }}</v-icon></v-list-item-icon>
                            <v-list-item-title>
                              {{ action.text }}
                            </v-list-item-title>
                          </v-list-item>
                        </div>


                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </v-list-item>
                <v-divider />

                <div class="menu-item">
                  <slot name="menuItem" v-bind="{ menuItem }" />
                </div>
              </div>

              <v-navigation-drawer clipped right mini-variant :mini-variant-width="48" absolute permanent>
                <v-list color="transparent" dense nav style="height: 100%; padding: 0px !important;" class="standard">
                  <slot name="action-prepend"></slot>

                  <v-list-item v-for="item in menuItems" :key="'menu-item-' + item.title" @click="setMenuItem(item)"
                    v-if="item.hide ? item.hide && !item.hide() : true">
                    <v-list-item-icon>
                      <v-icon :color="item.title === menuItem ? '' : ''"
                        :class="item.title === menuItem ? 'opacity-10' : 'opacity-6'">{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </v-navigation-drawer>
            </div>
          </div>
        </multipane>
      </div>

      <multipane-resizer v-if="extend"></multipane-resizer>

      <div class="multipane-template-extend" v-if="extend">
        <slot name="extend" />
      </div>
    </multipane>

    <slot />
  </v-row>
</template>

<script>
import { Multipane, MultipaneResizer } from "vue-multipane";

export default {
  name: "MultipaneTemplate",
  components: {
    Multipane,
    MultipaneResizer,
  },
  props: {
    menuItems: {
      type: Array,
      default: () => {
        return [];
      },
    },
    id: {
      type: String,
      default: "multipaneTemplate",
    },
    extend: {
      type: Boolean,
    },
    hideMenu: Boolean
  },
  computed: {
    menuItem() {
      return this.$store.state.ui[this.id].menuItem || (this.menuItems[0]?.title || '');
    },
  },
  data() {
    return {
      panelLeftWidth: 0,
    };
  },
  watch: {
    extend() {
      this.$nextTick(() => {
        this.onPanelResizeStop();
      });
    },
    menuItem() {
      if (this.menuItem) {
        if (!this.$store.state.ui[this.id]) {
          this.$store.state.ui[this.id] = {
            dashboardMenu: true,
            dashboardMenuWidth: 240,
            menuItem: this.menuItem,
          };
        }

        this.$store.state.ui[this.id].menuItem = this.menuItem
        this.$store.commit("setUi", this.$store.state.ui);
      }

    }
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (!this.$store.state.ui[this.id]) {
        this.$store.state.ui[this.id] = {
          dashboardMenu: true,
          dashboardMenuWidth: 240,
          menuItem: "",
        };
        this.$store.commit("setUi", this.$store.state.ui);
      }

      this.setMenuItemStore(this.$store.state.ui[this.id].menuItem)
    },

    setMenuItemStore(menuItem) {
      const uiStore = this.$store.state.ui || {}
      if (!uiStore[this.id]) {
        uiStore[this.id] = {
          dashboardMenu: true,
          dashboardMenuWidth: 240,
          menuItem: "",
        };
      }

      uiStore[this.id].menuItem = menuItem
      this.$store.commit("setUi", uiStore);
    },

    setMenuItem(item) {
      this.setMenuItemStore(item.title)

      if (item.initFuction && typeof item.initFuction === "function") {
        item.initFuction();
      }
    },

    onPanelResizeStart(e) {
      this.panelLeftWidth = parseInt(e.clientWidth);
      this.$emit("resizeStart");
    },

    onPanelResizeStop(e) {
      const dashboardMenu = document.getElementById("dashboardMenu");
      if (dashboardMenu) {
        this.$store.state.ui[this.id].dashboardMenuWidth = dashboardMenu.clientWidth;
        this.$store.commit("setUi", this.$store.state.ui);
      }
      this.$emit("resizeStop");
    },

    onPanelResize(e) {
      let targetPanelLeftRatio = parseInt(e.style.width);
      const panelLeftRatio = parseInt(
        (this.panelLeftWidth * 100) / e.parentElement.clientWidth
      );

      if (
        e.classList.contains("menu-container") &&
        targetPanelLeftRatio !== panelLeftRatio
      ) {
        if (targetPanelLeftRatio > 90 && this.$store.state.ui[this.id].dashboardMenu) {
          this.onClickMenu();
        } else if (
          targetPanelLeftRatio < 70 &&
          !this.$store.state.ui[this.id].dashboardMenu
        ) {
          this.onClickMenu();
        }
      }

      this.$emit("resize");
    },

    onClickMenu() {
      let active = this.$store.state.ui[this.id].dashboardMenu ? false : true;
      this.$store.state.ui[this.id].dashboardMenu = active;
      this.$store.commit("setUi", this.$store.state.ui);
    },
  },
};
</script>

<style lang="scss" scoped>
.multipane-template-container {
  width: 100%;
  height: 100%;
  max-height: 100% !important;
  position: relative;
  overflow: hidden;
  border-top: 1px solid $default-border-color;

  .active-button {
    posiiton: absolute !important;
    z-index: 11;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    min-width: 28px !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-top-left-radius: 0.7rem !important;
    border-bottom-left-radius: 0.7rem !important;

    .theme--dark & {
      background-color: $dark-primary-deep-background-color !important;
    }
  }

  .multipane-template-body {
    min-height: 60px;
  }

  .multipane-template-extend {
    flex: 1 !important;
    width: 100%;
    height: 100%;
    min-height: 320px !important;
    position: relative;
    box-shadow: 0px 0px 2px $default-border-color !important;

    .theme--dark & {
      background-color: rgba($dark-primary-deep-background-color, 0.9) !important;
    }
  }

  .menu-container {
    &#dashboardMenu {
      .monitoring-content {
        box-shadow: -2px 0px 12px rgba(0, 0, 0, 0.15) !important;

        .theme--light & {
          background-color: rgba($light-primary-background-color, 0.95);
        }

        .theme--dark & {
          background-color: rgba($dark-primary-deep-background-color, 0.85);
        }

        backdrop-filter: blur(24px);
        will-change: filter;
      }
    }

    .menu-item {
      max-height: calc(100% - 50px);
      height: calc(100% - 50px);
      overflow-y: auto;

      animation: active_in 0.2s ease-in-out;
      transform-origin: center right;

      @keyframes active_in {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }
    }
  }

  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    pointer-events: auto;
    display: flex;
    flex: 1 1;
    padding: 12px;
    width: 100%;
    flex-direction: row;
    align-items: center;
  }
}
</style>
