<template>
    <div 
        class="page-body" 
        :class="{'no-gutters' : noGutters}"
        :style="'max-width:' + maxWidth + 'px;'"
    >
        <h2 class="mt-4" v-if="pageBodyTitle">
            {{ pageBodyTitle }}
        </h2>

        <p class="grey--text mb-4" v-if="pageBodySubtitle">
            {{ pageBodySubtitle }}
        </p>
        <slot/>
    </div>
</template>

<script>
export default{
    name:'PageBody',
    props:{
        noGutters:{
            type:Boolean,
            default:false
        },
        pageBodyTitle: String,
        pageBodySubtitle: String,
        maxWidth: [String, Number]
    },
    methods:{
        
    }
}
</script>

<style lang="scss">
.page-body{
    padding:0px 18px;

    &.no-gutters{
        padding:0px;
    }

    @media screen and (max-width: 760px) {
        padding: 0px 3px;
    }
}
</style>