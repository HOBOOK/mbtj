<template>
    <div 
        class="data-input"
        :class="{small: small}"
    >
        <v-list-item-content v-if="title">
            <v-list-item-title>
                {{ title }}

                <span v-if="description" class="grey--text text-caption mx-1">{{ description }}</span>
            </v-list-item-title>
        </v-list-item-content>
        <v-text-field
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
        </v-text-field>
    </div>
</template>

<script>
export default{
    name: 'DataInput',
    inheritAttrs:false,
    props:{
        title:String,
        description:String,
        small:Boolean
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

.data-input{
    max-width:100%;

    &.small{
        .v-input{
            font-size: 12px !important;
        }
        .v-input__slot{
            min-height: 28px !important;
            input{
                padding: 4px 0 4px !important;
                max-height: 24px !important;
            }
        }

       
    }
}
</style>