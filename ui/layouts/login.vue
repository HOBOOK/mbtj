<template>
  <v-app class="default-layout-container">
    <v-app-bar flat fixed clipped-left color="transparent" style="box-shadow: none !important;">
      <v-row no-gutters align="center">
        <v-col cols="4" md="4" align="start" justify="center">
          <div
            @click.stop="$router.push('/')"
            style="
              height: 56px;
              display: flex;
              align-items: center;
              cursor: pointer;
            "
          >
            <v-list-item class="px-0">
              <v-list-item-icon class="ml-0 mr-2">
                <v-img
                  src="/logo/s01.png"
                  :max-height="40"
                  :max-width="40"
                  contain
                />
              </v-list-item-icon>
            </v-list-item>
          </div>
        </v-col>

        <v-col cols="8" md="8" align="end" justify="center">
          <v-row no-gutters align="center" justify="end">
            <v-spacer />

            <!-- <header-item
              :icon="
                $vuetify.theme.dark ? 'mdi-weather-night' : 'mdi-weather-sunny'
              "
              class="mr-3"
              @click="toggleTheme()"
            /> -->

            <header-item icon="mdi-web" class="mr-3">
              <template v-slot:content>
                <v-list :width="160">
                  <v-list-item @click="setLocale('ko')"> 한글 <v-spacer/><v-icon color="primary" v-if="$i18n.locale === 'ko'">mdi-circle-medium</v-icon></v-list-item>
                  <v-divider />
                  <v-list-item @click="setLocale('en')"> English <v-spacer/><v-icon color="primary" v-if="$i18n.locale === 'en'">mdi-circle-medium</v-icon> </v-list-item>
                </v-list>
              </template>
            </header-item>
          </v-row>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-main>
      <Nuxt />
      <client-only>
        <vue-snotify></vue-snotify>
      </client-only>
    </v-main>
  </v-app>
</template>
<script>
const packageJson = require("~/package.json");

export default {
  head() {
    return {
      titleTemplate(title) {
        return `${title} | ${this.$route.meta.title || ""}`;
      },
    };
  },
  data() {
    return {
      version: packageJson.version,
    };
  },
  mounted() {
    this.$vuetify.theme.dark = false;

    this.setTheme(this.$store.state.theme);
    this.setLocale(this.$store.state.locale);
  },
  methods: {
    setLocale(locale) {
      if (this.$i18n.locale) {
        this.$store.commit("setLocale", locale);
        this.$i18n.locale = this.$store.state.locale;
      }
    },

    setTheme(theme) {
      if (this.$vuetify.theme) {
        this.$store.commit("setTheme", theme);

        let darkMode = false;

        if (theme === "system") {
          darkMode =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;
        } else {
          darkMode = theme === "dark";
        }

        this.$vuetify.theme.dark = darkMode;
      }
    },

    toggleTheme() {
      if (this.$vuetify.theme.dark) {
        this.setTheme("light");
      } else {
        this.setTheme("dark");
      }
    },
  },
};
</script>
