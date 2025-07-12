<template>
    <div 
        class="data-container"
        :style="maxWidth ? `max-width: ${maxWidth}px;` : ''"
    >
        <v-list-item-content v-if="title">
            <v-list-item-title>
                {{ title }}
                <span v-if="required">
                *
                </span>

                <span v-if="description" class="grey--text text-caption mx-1">- {{ description }}</span>
            </v-list-item-title>
        </v-list-item-content>
        <slot></slot>
    </div>
</template>

<script>
export default{
    name: 'DataContainer',
    inheritAttrs:false,
    props:{
        title:String,
        description:String,
        required: Boolean,
        maxWidth: {
            type: [Number, String],
            default: 0
        }
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

.data-container{
    max-width:100%;
}
</style>