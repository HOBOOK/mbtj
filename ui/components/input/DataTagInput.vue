<template>
    <v-col cols="12">
        <v-row no-gutters align="center">
            <v-spacer/>
            <v-btn class="mx-2" text @click="addTagItem()">
                {{ $t('add_tag') }}
            </v-btn>

            <v-btn  @click="saveTag()" :disabled="!isSaveEnable">{{ $t('save') }}</v-btn>
        </v-row>

        <v-row no-gutters>
            <v-col>
                <div
                    v-for="(tag, idx) in tagItems"
                    :key="'child-' + idx"
                    class="mt-6 mb-12"
                >
                    <v-row no-gutters>
                        {{ $t('tag') +  ' #' + (idx + 1) }}
                        <v-spacer/>
                        <v-btn text small @click="removeTag(idx)"><v-icon small left>mdi-minus</v-icon>{{ $t('remove') }}</v-btn>
                    </v-row>
                    <v-divider class="my-2"/>
                    <v-row>

                        <v-col cols="12" lg="6">
                        <data-input :title="$t('key')" v-model="tag.key" @input="inputTag"/>
                        </v-col>

                        <v-col cols="12" lg="6">
                        <data-input :title="$t('value')" v-model="tag.value" @input="inputTag"/>
                        </v-col>
                        
                    </v-row>

                </div>

                <empty v-if="tagItems?.length === 0" :subtext="$t('no_data')"/>
            </v-col>
        </v-row>
    </v-col>

</template>

<script>

export default{
    name: 'DataTagInput',
    props:{
        item: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() { return {
        tags: {

        },
        tagItems:[],
        tagDefaultModel: {
            key:'',
            value:''
        },
    }},
    mounted(){
        this.initTag()
    },
    watch:{
        item(){
            this.initTag()
        }
    },
    computed:{
        isSaveEnable() {
            return Object.values(this.tags).every(value => !!value)
        }
    },
    methods:{
        initTag(){
            if(this.item && this.item.tags) {
                this.tags = this.item.tags
                for(let k of Object.keys(this.item.tags)) {
                    this.tagItems.push({
                        key: k,
                        value: this.item.tags[k]
                    })
                }
            }
        },
        addTagItem(){
            let tagDefaultModel = JSON.parse(JSON.stringify(this.tagDefaultModel))
            this.tagItems.push(tagDefaultModel)
        },
        
        inputTag() {
            this.tags = {}
            for(let tag of this.tagItems) {
                if(!tag.key) continue 

                if(this.tags[tag.key] || Object.keys(this.item).includes(tag.key)) {
                    this.$snotify.error(this.$t('error_tag_key_exist'))
                    tag.key = ''
                } else {
                    this.tags[tag.key] = tag.value
                }
            }
            this.item.tags = this.tags

            this.$emit('input', this.tags)
        },

        saveTag() {
            this.$emit('save', this.tags)
        },

        removeTag(idx) {
            this.tagItems.splice(idx, 1)
            this.inputTag()
        }
    }
}

</script>