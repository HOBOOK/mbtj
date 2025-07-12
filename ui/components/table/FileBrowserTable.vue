<template>
  <div>
    <data-table :items="filteredItems" :headers="headers" hide-default-top @click:item="onClickItem"
      @dblclick:item="onDoubleClickItem" :hide-default-header="false" :items-per-page="-1" fixedHeader dense>
      <template v-slot:item.modified="{ item }">
        {{ item.modified ? $time.formatTimestamp(item.modified) : "" }}
      </template>
      <template v-slot:item.name="{ item }">
        <v-row no-gutters align="center" style="flex-wrap: nowrap; position: relative">
          <v-icon class="mr-2" style="font-size: 20px" :color="getColorByType(item.type)">
            {{ getIconByType(item.type) }}
          </v-icon>
          <span style="
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 500px;
            " v-html="item.displayName">
          </span>
        </v-row>
      </template>
      <template v-slot:item.size="{ item }">
        {{
          item.size && typeof item.size === "number"
            ? convertByteToString(item.size)
            : item.size
        }}
      </template>

      <template v-slot:contextItem="{ item }">
        <v-list-item v-if="item.type === 'file' || item.type === 'directory'" @click="download(item)" justify="center">
          <v-list-item-icon>
            <v-icon dense>mdi-download</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            {{ $t("download") }}
          </v-list-item-content>
        </v-list-item>
      </template>
    </data-table>

    <v-overlay absolute :opacity="0.3" no-gutters align="center" v-if="loadingAction">
      <v-progress-linear style="width: 60px" rounded :indeterminate="downloadProgress === -1" :value="downloadProgress"
        color="primary" :height="6"></v-progress-linear>
      <div class="ml-2 text-caption primary--text" v-if="downloadProgress > 0">
        {{ downloadProgress || 0 }}%
      </div>
    </v-overlay>

    <div ref="preview" class="file-preview-container" :class="{ active: previewImage }">
      <v-row style="position:absolute; left:0; width:100%; top:0; z-index:10; padding:12px; color:#fff;" no-gutters>


        {{ selectedItem?.name }}

        <v-spacer />
        <v-btn icon tile class="mr-1" @click="prevPreview()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn icon tile class="mr-1" @click="nextPreview()">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
        <v-btn @click="previewImage = null" icon tile><v-icon>mdi-close</v-icon></v-btn>
      </v-row>
      <div class="image-container" v-if="previewImage">
        <img :src="previewImage" />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "FileBrowserTable",
  inheritAttrs: true,
  props: {
    path: String,
    keyword: String,
    items: Array,
  },
  data() {
    return {
      headers: [
        {
          text: this.$t("name"),
          value: "name",
        },
        {
          text: this.$t("type"),
          value: "ext",
          width: 150,
        },
        {
          text: this.$t("size"),
          value: "size",
          width: 150,
        },
        {
          text: this.$t("updatedAt"),
          value: "modified",
          width: 200,
        },
      ],
      iconType: {
        file: {
          icon: "mdi-file-outline",
          color: "",
        },
        directory: {
          icon: "mdi-folder",
          color: "primary",
        },
        image: {
          icon: "mdi-image-area",
          color: "green",
        },
        text: {
          icon: "mdi-file-document-outline",
          color: "",
        },
        video: {
          icon: "mdi-play-circle",
          color: "",
        },
        audio: {
          icon: "mdi-play-circle",
          color: "",
        },
        compressed: {
          icon: "mdi-folder-zip",
          color: "amber",
        },
        pdf: {
          icon: "mdi-file-pdf-box",
          color: "red",
        },
        excel: {
          icon: "mdi-microsoft-excel",
          color: "#2E7D32",
        },
        word: {
          icon: "mdi-microsoft-word",
          color: "blue",
        },
        source: {
          icon: "mdi-file-code-outline",
          color: "",
        },
      },
      downloadProgress: null,
      loadingAction: false,
      previewImage: "",
      previewIndex: 0,
      selectedItem: null,
      el: null,
    };
  },

  computed: {
    filteredItems() {
      if (!this.items) return [];
      const items = this.items;
      if (!this.keyword) {
        return items.map((item) => ({
          ...item,
          displayName: item.name,
        }));
      }

      const text = this.keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${text})`, "gi");
      return items
        .filter((item) => item.name.toLowerCase().includes(this.keyword.toLowerCase()))
        .map((item) => ({
          ...item,
          displayName: item.name.replace(regex, '<span class="highlight-text">$1</span>'),
        }));
    },

    filteredPreviewItems() {
      return this.filteredItems.filter((e) => ['png', 'jpg', 'jpeg', 'bmp', 'gif'].includes(e.ext))

    }
  },

  methods: {
    onClickItem(item) {
      if (!item) return;
      this.$emit("click:item", item);
    },

    async onDoubleClickItem(item) {
      if (!item) return;

      this.selectedItem = item;
      const imageExt = ["png", "jpg", "jpeg", "webp", "bmp", "gif"];
      if (imageExt.includes(item.ext)) {
        const response = await this.$axios.get(
          `/v1/factories/${this.$store.state.factory}/files/${item.name}`,
          {
            params: {
              path: item.path,
            },
            responseType: "blob",
          }
        );


        this.previewImage = window.URL.createObjectURL(new Blob([response.data]));
        this.previewIndex = this.filteredPreviewItems.indexOf(item)

        if (this.previewImage) {
          if (!this.el) {
            this.el = this.$refs.preview;
          }
          const appRoot = document.getElementById("app");

          if (appRoot) {
            const elements = appRoot.querySelectorAll(".file-preview-container");
            elements.forEach(element => { 
              if(element !== this.el) { 
                element.remove()
              }
            });
          }

          if (this.el && appRoot && this.el.nodeType === Node.ELEMENT_NODE) {
            appRoot.appendChild(this.el);
          }
        }
      } else if (item?.type === "directory") {
        this.$emit("update:path", item.path);
      }
    },

    nextPreview() {
      const items = this.filteredPreviewItems
      if (items.length > 0) {
        this.onDoubleClickItem(this.filteredPreviewItems[(this.previewIndex + 1) % this.filteredPreviewItems.length])
      }
    },

    prevPreview() {
      const items = this.filteredPreviewItems
      if (items.length > 0) {
        this.onDoubleClickItem(this.filteredPreviewItems[(this.previewIndex + 1) % this.filteredPreviewItems.length])
      }
    },

    getFileType(extension) {
      if (!extension) return "directory";
      extension = extension.toLowerCase();
      if (extension.includes(".")) {
        extension = extension.split(".").pop();
      }
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "ico", "svg"];
      const textExtensions = ["txt", "md", "json", "xml", "conf", "yml", "yaml"];
      const videoExtensions = ["mp4", "avi", "mov", "wmv", "webm"];
      const audioExtensions = ["mp3", "wav", "aac", "flac"];
      const compressedExtensions = ["zip", "rar"];
      const wordExtension = "docx";
      const pdfExtension = "pdf";
      const hwpExtension = "hwp";
      const excelExtension = "xlsx";
      const weburlExtension = "weburl";
      const sourceExtensions = [
        "java",
        "vue",
        "html",
        "css",
        "js",
        "py",
        "cpp",
        "js",
        "rb",
        "php",
        "sql",
        "ts",
        "sh",
      ];

      if (imageExtensions.includes(extension)) {
        return "image";
      } else if (textExtensions.includes(extension)) {
        return "text";
      } else if (videoExtensions.includes(extension)) {
        return "video";
      } else if (audioExtensions.includes(extension)) {
        return "audio";
      } else if (compressedExtensions.includes(extension)) {
        return "compressed";
      } else if (sourceExtensions.includes(extension)) {
        return "source";
      } else if (extension === wordExtension) {
        return "word";
      } else if (extension === pdfExtension) {
        return "pdf";
      } else if (extension === hwpExtension) {
        return "hwp";
      } else if (extension === excelExtension) {
        return "excel";
      } else if (extension === weburlExtension) {
        return "url";
      } else {
        return "file";
      }
    },

    getIconByType(type) {
      if (type && this.iconType[type]?.icon) {
        return this.iconType[type].icon;
      }
      return "mdi-file-outline";
    },

    getColorByType(type) {
      if (type && this.iconType[type]?.color) {
        return this.iconType[type].color;
      }
      return "";
    },

    convertByteToString(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },

    async download(item) {
      if (this.loadingAction) return;
      try {
        this.loadingAction = true;
        this.downloadProgress = null;
        const response = await this.$axios.get(
          `/v1/factories/${this.$store.state.factory}/files/${item.name}`,
          {
            params: {
              path: item.path,
            },
            responseType: "blob",
            onDownloadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const total = progressEvent.total || 1; // Fallback if total is not provided
                const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
                this.downloadProgress = percentCompleted;
              } else {
                this.downloadProgress = -1;
              }
            },
          }
        );

        this.downloadProgress = null;
        let filename = item.name;
        if (item.type === "directory") {
          filename += ".zip";
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (err) {
        console.error("파일 다운로드 실패:", err);
      }

      this.loadingAction = false;
    },
  },
};
</script>

<style lang="scss">
.highlight-text {
  background-color: yellow !important;
  color: black;
}

.file-preview-container {
  left: 0;
  top: 0;
  position: fixed;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  z-index: 100000;
  pointer-events: none;
  opacity: 0;
  display: none;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(3px);

  }

  &.active {
    pointer-events: auto;
    display: block;
    opacity: 1;
  }

  .image-container {
    width: 100%;
    height: 100%;

    img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
