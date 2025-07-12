<template>
    <div 
        class="data-large-input"
    >
        <v-list-item-content v-if="title">
            <v-list-item-title>
                {{ title }}

                <span v-if="description" class="grey--text text-caption mx-1">{{ description }}</span>
            </v-list-item-title>
        </v-list-item-content>
        <v-textarea
            v-bind="$attrs"
            v-on="$listeners"
            hide-details
            outlined
            dense
        >
       
            <template v-for="(slot, key) in $scopedSlots" v-slot:[key]="scope">
                <slot :name="key" v-bind="scope" />
            </template>

            <template v-slot:append>
                <slot name="append"/>
            </template>
            <template v-slot:prepend>
                <slot name="prepend"/>
            </template>
            <template v-slot:prepend-inner>
                <slot name="prepend-inner"/>
            </template>
        </v-textarea>
    </div>
</template>

<script>
export default{
    name: 'DataLargeInput',
    inheritAttrs:false,
    props:{
        title:String,
        description:String,
    },
    data() { return {
       
    }},
    mounted(){
    },
    methods:{
    }
}
</script>

<style lang="scss">

.data-large-input{
    max-width:100%;
}
</style>