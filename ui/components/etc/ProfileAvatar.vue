<template>
  <div
    @click="routeToUser()"
    :style="clickable ? 'cursor:pointer;' : ''"
    style="display: inline-block"
  >
    <v-tooltip
      bottom
      transition="slide-y-transition"
      color="transparent"
      :close-delay="100"
      :open-delay="100"
    >
      <template v-slot:activator="{ on, attrs }">
        <span v-on="on" v-bind="attrs">
          <v-avatar
            v-if="showAvatar"
            :size="size"
            :color="$colors.getRandomColorByEmail(email)"
            :tile="tile"
            :class="rounded"
          >
            <img
              v-if="(profileImage && profileImage !== '') || imageURL"
              :src="profileImageURL"
              :width="size"
              :height="size"
            />
            <div
              v-else
              class="d-flex justify-center align-center font-weight bold white--text"
              style="width: 100%; height: 100%"
              :style="'font-size:' + size * 0.5 + 'px;'"
            >
              {{ nameFirst }}
            </div>
          </v-avatar>
          <span v-if="showName" class="ml-1">{{ name }}</span>
          <span v-if="showEmail" class="text-caption grey--text"
            ><v-icon small>mdi-circle-small</v-icon>{{ email }}</span
          >
          <span v-if="showAdmin">
            <!-- {{$t('ADMIN')}} -->
            <v-icon small>mdi-shield-account</v-icon>
          </span>
        </span>
      </template>

      <template v-slot:default>
        <v-card class="text-caption pa-3 pl-0 pr-1" v-show="showTooltip">
          <v-card-text>
            <v-row no-gutters align="center">
              <v-avatar
                class="mr-2"
                :size="36"
                :color="$colors.getRandomColorByEmail(email)"
                :tile="tile"
                :class="rounded"
              >
                <img
                  v-if="(profileImage && profileImage !== '') || imageURL"
                  :src="profileImageURL"
                  :width="size"
                  :height="size"
                />
                <div
                  v-else
                  class="d-flex justify-center align-center font-weight bold white--text"
                  style="width: 100%; height: 100%"
                  :style="'font-size:' + size * 0.5 + 'px;'"
                >
                  {{ nameFirst }}
                </div>
              </v-avatar>
              <v-col>
                <v-row no-gutters align="center">
                  <span>{{ name }}</span>
                </v-row>
                <v-row no-gutters align="center">
                  <span class="grey--text">{{ email }}</span>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </template>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: "ProfileAvatar",
  props: {
    size: {
      type: Number,
      default: 40,
    },
    emailLoad: {
      type: String,
      default: "",
    },
    user: {
      type: Object,
      default: () => ({
        email: "user@example.com",
        name: "user",
        profileImage: "",
        role: "USER",
      }),
    },
    showName: {
      type: Boolean,
      default: false,
    },
    showEmail: {
      type: Boolean,
      default: false,
    },
    showAdmin: {
      type: Boolean,
      default: false,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    tile: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: String,
      default: "",
    },
    showTooltip: {
      type: Boolean,
      default: false,
    },
    imageURL: {
      type: String,
      default: "",
    },
    showAvatar: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    name: "",
    profileImage: "",
    email: "",
    role: "",
    profileImageURL: "",
  }),

  computed: {
    nameFirst() {
      return this.name && this.name.length > 0 ? this.name.substring(0, 1) : "";
    },
  },

  methods: {
    routeToUser() {
      if (this.clickable) {
        this.$router.push("/user/" + this.email);
      }
    },
    async getUserByEmail(email) {
      await this.$axios
        .get("/auth/email/" + email)
        .then((res) => {
          let userModel = res.data;
          this.userSetting(userModel);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getProfileImage() {
      if (this.profileImage) {
        const key = this.profileImage;
        const image =
          this.$axios.defaults.baseURL + "/auth/user/profileImage/" + key;
        this.profileImageURL = image;
        return;
      }
    },
    userSetting(user) {
      this.name = user.name || "";
      this.email = user.email || "";
      this.role = user.role || "";
      this.profileImage = user.profileImage || "";
      this.getProfileImage();
    },
  },
  mounted() {
    if (this.emailLoad?.length > 0) {
      this.getUserByEmail(this.emailLoad);
    } else {
      if (this.user) {
        this.userSetting(this.user);
      }
      if (this.imageURL.length != 0) {
        this.profileImageURL = this.imageURL;
      } else {
        this.getProfileImage();
      }
    }
  },
  watch: {
    user() {
      if (this.user) {
        this.userSetting(this.user);
      }
    },
    emailLoad(val) {
      this.getUserByEmail(val);
    },
    imageURL() {
      this.profileImageURL = this.imageURL;
    },
  },
};
</script>
