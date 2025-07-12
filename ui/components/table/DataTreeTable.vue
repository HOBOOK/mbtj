<template>
<div  class="data-tree-table">
    <div
        v-if="depth===0"
        no-gutters
        class="header-row"
    >
        <div
            v-if="depth === 0"
            v-for="(header, idx) in headers"
            :key="'dtt-h-' + idx"
            class="header-col"
            :id="'header-' + idx"
        >
            {{header.text}}
        </div>
    </div>

    <div
        v-for="(item,idx) in items"
        :key="'dtt-' + idx + depth + key"
    >
        <div class="item-row"
          @click.stop="onClickItem(item)"
          :class="selectedItem === item ? 'selected' : ''"
          style="cursor:default;"
        >
            <div
                v-for="(header, hidx) in headers"
                :key="'dttd-' + hidx + depth + key"
                class="item-col"
                :style="getColWidth(header, hidx)"
            >
                <span
                  v-if="hidx === 0" 
                  class="item-cell" 
                  :style="'padding-left:' + (depth * 1.7) +'rem;'"
                >
                    <v-btn small tile icon @click.stop="item.active = !item.active, key++" v-if="item[childrenAttrs]?.length > 0 && depth < maxDepth - 1">
                      <v-icon :color="item.active ? '' : 'grey'">
                        mdi-chevron-{{ item.active ? 'down' : 'right'}}
                      </v-icon>
                    </v-btn>
                   
                    <v-icon v-else small color="grey">
                      {{item[iconAttrs] ? item[iconAttrs] : 'mdi-square-medium'}}
                    </v-icon>
                    
                    <span class="ml-2">
                      {{ getItemValue(item, header.value) || '-' }} 
                    </span>
                </span>

                <span v-else  class="item-cell" >
                  
                  {{ getItemValue(item, header.value) || '-' }} 
                </span>
            </div>
        </div>

        <slot name="append" v-bind="{item, depth}"/>

        <data-tree-table
            :depth="depth + 1"
            :headers="headers"
            :items="item[childrenAttrs]"
            v-if="item[childrenAttrs] && item.active && depth < maxDepth - 1"
            @click:item="onClickItem"
            :children-attrs="grandChildrenAttrs ? grandChildrenAttrs : childrenAttrs"
            :selectedItem="selectedItem"
            :max-depth="maxDepth"
            v-bind="$attrs"
            v-on="$listeners"
        >
        
          <template v-for="(slot, key) in $scopedSlots" v-slot:[key]="scope">
            <slot :name="key" v-bind="scope" />
          </template>
        </data-tree-table>

    </div>
</div>
  </template>
  
  <script>
  export default {
    name: "DataTreeTable",
    props: {
      items: Array,
      headers:Array,
      depth: {
        type: Number,
        default: 0,
      },
      maxDepth: {
        type: [Number, String],
        default: 5
      },
      childrenAttrs:{
        type: String,
        default: 'children'
      },
      grandChildrenAttrs:{
        type: String,
        default: ''
      },
      selectedItem:Object,
      iconAttrs:{
        type:String,
        default: 'icon'
      }
    },
    data() {
      return {
        key: 0,
      };
    },
    watch:{
      items(){
        this.init()
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init(){
        if(this.items?.length > 0) {
          this.items[0].active = true
          this.key++
        }
      },

      onClickItem(item) {
        if (!item.eventIdleTime) {
          item.eventIdleTime = 300
          setTimeout(() => {
            item.eventIdleTime = 0;
          }, 300);
          this.$emit('click:item', item)
        }
      },

      getColWidth(header, hidx) {
        const hElement = document.getElementById('header-' + hidx)
        if(hElement) {
          return 'max-height:' + hElement.clientWidth + 'px !important; overflow:hidden;'
        }
      },

      getItemValue(target, attr){
        const keys = attr.split('.');
        return keys.reduce((accumulator, currentKey) => {
          return accumulator ? accumulator[currentKey] : undefined;
        }, target);
      },
    },
  };
  </script>
  
  <style lang="scss">
  .data-tree-table {
    width:100% !important;
    .header-row{
        display:flex;
        flex-direction: row;
        flex:1;
        width:100%;
        border-top: thinsolid $default-border-color;
        border-bottom: thin solid $default-border-color;
        text-align: center;
        font-size: 0.8rem;
        user-select: none;
    }
    .header-col {
      &:not(:last-child) {
        border-right: thin solid $default-border-color;
      }
      padding:0px 16px;
      display:flex;
      flex:1;
      flex-direction: column;
      min-height:40px;
      line-height: 40px;
    }
    .item-row{
        display:flex;
        flex-direction: row;
        flex:1;
        width:100%;
        border-bottom: thin solid $default-border-color;
        position:relative;

        &.selected{
          font-weight: bold;
          
          &::after{
            content:'';
            position:absolute;
            left:3px;
            top:3px;
            z-index:0;
            border:2px solid $primary-border-color;
            background-color: #1E88E505;
            width:calc(100% - 6px);
            height:calc(100% - 6px);
            border-radius:0.25rem;
            pointer-events:none;
          }
        }
        &:hover{
          font-weight: bold;
        }

    }
    .item-col{
        &:not(:last-child) {
          border-right: thin solid $default-border-color;
        }
        padding:0px 16px;
        min-height:42px;
        line-height: 42px;
        display:flex;
        flex-direction: column;
        flex:1;
    }
    .item-cell{
      display:flex;
      flex-direction: row;
      flex:1;
      align-items: center;
      width:100%;
    }
  }
  </style>
  