<template>
  <div class="data-select" :class="{small: small}">
    <v-list-item-content v-if="title">
      <v-list-item-title>
        {{ title }}
      </v-list-item-title>
    </v-list-item-content>
    <v-select
      v-bind="$attrs"
      v-on="$listeners"
      hide-details
      outlined
      dense
      :items="filtertedItems"
      :menu-props="{ bottom: true, offsetY: true }"
    >
      <template v-for="(slot, key) in $scopedSlots" v-slot:[key]="scope">
        <slot :name="key" v-bind="scope" />
      </template>
      <template v-slot:append>
          <slot name="append"/>
      </template>
      <template v-slot:append-item>
          <slot name="append-item"/>
      </template>
      <template v-slot:append-outer>
          <slot name="append-outer"/>
      </template>
      <template v-slot:prepend>
          <slot name="prepend"/>
      </template>
      <template v-slot:prepend-inner>
          <slot name="prepend-inner"/>
      </template>
      <template v-slot:prepend-item>
        <v-text-field
          v-model="searchInput"
          v-if="search"
          :placeholder="$t('search') + '...'"
          prepend-inner-icon="mdi-magnify"
          dense
          hide-details
          solo
          clearable
        ></v-text-field>
        <v-divider></v-divider>
          <slot name="prepend-item"/>
      </template>
    </v-select>
  </div>
</template>

<script>
export default {
  name: "DataInput",
  inheritAttrs: false,
  props: {
    title: String,
    small: Boolean,
    search: Boolean,
  },
  computed:{
    filtertedItems() {
      if(this.search && this.searchInput) {
        return this.$attrs.items.filter((e)=> {
          return String(e[this.$attrs['item-text'] || 'name'])?.toLowerCase().includes(String(this.searchInput).toLowerCase()) || String(e).toLowerCase().includes(this.searchInput.toLowerCase())
        })
      } else {
        return this.$attrs.items
      }
    }
  },
  data() {
    return {
      searchInput: ''
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss">
.data-select {
  max-width: 100%;

  &.small {
    height:32px !important;

    .v-input {
      font-size:0.875rem !important;
      .v-input__slot{
        min-height: 24px !important;

        .v-select__selections{
          padding:0px !important;
        }
        
        .v-input__append-inner{
          margin-top: 6px !important;

          .v-input__icon{
            width:20px !important;
            min-width: 20px !important;
            height:20px !important;
            i{
              font-size:20px !important;
            }
          }
        }

        
      }
    }
  }




}
</style>
