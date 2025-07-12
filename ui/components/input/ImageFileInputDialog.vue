<template>
    <Dialog v-bind="$attrs" v-on="$listeners" ref="metricDialog" @change="(e) => {
        dialog = e
        $emit('change', dialog)
    }" noGutters closeButton hideDefaultButton>
        <template v-for="(slot, key) in $scopedSlots" v-slot:[key]="scope">
            <slot :name="key" v-bind="scope" />
        </template>

        <template v-slot:content>
            <v-col cols="12">
                <v-row no-gutters align="center" justify="center">
                    <v-hover v-slot="{ hover }">
                        <v-sheet outlined :width="width" :height="height" class="image-file-container"
                            @click="$refs.thumbnailInput.open()">
                            <v-img :src="preview" contain :width="width" :height="height"></v-img>

                            <v-overlay v-if="hover" absolute :opacity="0.3">
                                {{ $t('change') }}
                            </v-overlay>
                        </v-sheet>
                    </v-hover>

                </v-row>

                <data-file-input ref="thumbnailInput" hide-input icon="mdi-file" accept=".png, .jpg" v-model="file"
                    @input="inputFile">

                </data-file-input>
                <v-row no-gutters align="center" justify="center" class="py-3">
                    <v-btn color="primary" @click="uploadFile()">{{ $t('save') }}</v-btn>
                </v-row>

            </v-col>
        </template>
    </Dialog>
</template>

<script>
export default {
    name: "ImageFileInputDialog",
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
            if(this.src) {
                this.preview = this.src
            }
        }, 
        async inputFile() {
            if (this.file) {
                this.preview = URL.createObjectURL(this.file)
                this.$emit('input', this.preview)
            }
        },
        async uploadFile() {
            if (this.file) {
                const response = await this.$fileUtils.upload(this.$axios, this.file, this.path)
                if(response) {
                    this.$emit('upload', this.path)
                    this.dialog = false
                }
            }
        }
    },
    destroyed() { },
};
</script>
<style lang="scss">
.image-file-container {
    position: relative;
    cursor: pointer;
    background-color: black !important;
    border-radius: 1rem;
}
</style>