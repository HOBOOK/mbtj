<template>
    <div>

        <v-hover v-slot="{ hover }">
            <div 
                :style="`width: ${width}px; height: ${height}px;`" 
                class="image-file-input-container"
                @click="$refs.thumbnailInput.open()">
                <v-img :src="preview" contain :width="width" :height="height"></v-img>

                <v-overlay v-if="hover" absolute :opacity="0.3">
                    {{ $t('change') }}
                </v-overlay>
            </div>
        </v-hover>


        <data-file-input ref="thumbnailInput" hide-input icon="mdi-file" accept=".png, .jpg" v-model="file"
            @input="inputFile">
        </data-file-input>
    </div>

</template>

<script>
export default {
    name: "ImageFileInput",
    props: {
        path: String,
        width: {
            type: [Number, String],
            default: 320
        },
        height: {
            type: [Number, String],
            default: 240
        },
        src: String,
    },
    data: () => ({
        loading: false,
        dialog: false,
        file: null,
        preview: null
    }),
    watch: {
        dialog() {
            this.$emit("change", this.dialog);
            this.$refs.metricDialog.dialog = this.dialog;
            if (this.dialog) {
                this.init()
            } else {
                this.$emit("click-no", this.dialog);
                this.$emit("close", this.dialog);
            }
        },
        src() {
            this.init()
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            if (this.src) {
                this.preview = this.src
            }
        },
        async inputFile() {
            if (this.file) {
                this.preview = URL.createObjectURL(this.file)
                this.$emit('input', this.preview)
            }
        },
    },
    destroyed() { },
};
</script>
<style lang="scss">
.image-file-input-container {
    overflow: hidden;
    position: relative;
    cursor: pointer;
    background-color: black !important;
    border:thin solid rgba(gray, 0.5) !important;
}
</style>