<template>
<v-row no-gutters class="page-title" :class="static ? 'static' : ''" align="center" :style="background ? 'background:' + background + ' !important;' : ''">
  <v-btn icon tile v-if="back" @click="$router.push(back)" class="mr-2" small>
    <v-icon>mdi-chevron-left</v-icon>
  </v-btn>
  
  <span class="title">
    <slot name="title">
    </slot>

    <span v-if="!$slots.title">{{title}}</span>

  </span>


  <slot name="subtitle">
  </slot>
  <h4 class="text-subtitle-2 mx-2" v-if="!$slots.subtitle">{{subtitle}}</h4>

  <v-breadcrumbs class="py-0" :items="breadcrumbsItems" v-if="breadcrumbs"></v-breadcrumbs>

  <v-spacer/>
  <slot name="right">

  </slot>
</v-row>

</template>

<script>
export default {
  name:'HeaderPageTitle',
  props:{
    title:{
      type: String,
    },
    subtitle:{
      type: String,
    },
    background:{
      type: String,
      default:''
    },
    breadcrumbs:Boolean,
    back: String,
    static: Boolean,
  },
  data:()=>({
    breadcrumbsItems:[]
  }),
  methods:{
    generateBreadcrumbs(){
      if(this.breadcrumbs) {
        const pathArray = this.$route.path.split('/');
        pathArray.shift();
        this.breadcrumbsItems = [];
        pathArray.forEach((path, index) => {
          let to = '/' + pathArray.slice(0, index+1).join('/');
          this.breadcrumbsItems.push({ text: path, href: to, disabled: index === pathArray.length - 1 });
        });
      }
    }
  },
  mounted() {
    this.generateBreadcrumbs()
  },
  

}
</script>
<style lang="scss">
.page-title {
  min-width: 320px;
  padding:0px 16px;
  height: 48px !important;
  border-bottom: 1px solid $default-border-color;
  position: sticky;
  z-index:1;
  top:0px;
  .theme--dark & {
    background-color: $dark-primary-deep-background-color !important;
  }

  &.static{
    position: static !important;
  }
  .title{
    *{
      font-weight:400 !important;
      font-size: 1.16rem !important;
      font-family: Pretendard-Bold !important;
    }

  }

  h4{
    margin:0;
    opacity: 0.7;
    @media (max-width: 767px){
      display: none;
    }
  }

  
}
</style>