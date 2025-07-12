<template>
    <div 
        class="data-select"
    >
        <v-list-item-content v-if="title">
            <v-list-item-title>
                {{ title }}
            </v-list-item-title>
        </v-list-item-content>
        <v-file-input
            :key="key"
            v-bind="$attrs"
            v-on="$listeners"
            hide-details
            outlined
            dense
            prepend-icon=""
            :loading="loading"
             :value="value" 
             @change="changeValue($event)"
             ref="fileInput"
        >
            <template v-slot:prepend-inner>
                <v-icon v-if="icon" small left class="mt-1">
                    {{ icon }}
                </v-icon>
                
            </template>
            <template v-slot:progress>
                <v-icon class="mdi-spin rotating">mdi-loading</v-icon>
            </template>
        </v-file-input>
    </div>
</template>

<script>
export default{
    name: 'DataInput',
    inheritAttrs:false,
    props:{
        title:String,
        icon:{type:String, default:"mdi-spin"},
        value: Object,
        loading: Boolean
    },
    data() { return {
       file: null,
       key: this.$utils.generateUUID('dfi')
    }},
    watch:{
        file(){
            this.$emit('input', this.file)
        }
    },
    mounted(){
    },
    methods:{
        changeValue(val) {
            this.$emit('input', val);
        },

        open() {
            this.$refs.fileInput.$el.querySelector('input[type="file"]').click();
        }
    }
}
</script>

<style lang="scss">

.data-select{
    max-width:100%;
}
</style>