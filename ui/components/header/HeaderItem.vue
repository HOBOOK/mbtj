<template>
<div>
    <v-menu offset-y origin="top right" left nudge-top="-16" content-class="header-item-menu">
        <template v-slot:activator="{on, attrs}">
            <slot name="activator"  v-bind="{on, attrs}"></slot>
            <v-btn icon small tile v-if="!activator" class="pa-1" v-on="on" v-bind="attrs" @click="onClick()">
                <v-icon >{{ icon }}</v-icon>
            </v-btn>
                
        </template>


        <div class="header-item-content">
            <slot name="content">
            </slot>
        </div>
    </v-menu>
</div>

</template>

<script>

export default{
    props:{
        icon:{
            type: String,
            default:'mdi-chevron-down'
        },
        activator:{
            type:Boolean,
            default:false
        }
    },
    methods:{
        onClick(){
            this.$emit('click')
        }
    },
    mounted(){
    }
}
</script>

<style lang="scss">
.header-item-menu{
    &.v-menu__content{
        animation: activeT 0.25s ease-in-out !important;
        transform-origin: right top;
        transition: all .25s ease-in-out !important;
        @keyframes activeT {
            0%{
                transform: scale(1);
                opacity: 0;
            }

            50%{
                transform: scale(1.05);
            }
            100%{
                opacity: 1;
                transform: scale(1.00);
            }
        }
    }
    .header-item-content{
        position:relative;
        transition: all .25s ease-in-out !important;
        
    }
}

</style>