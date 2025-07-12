<template>
  <v-col cols="12" justify="center" class="data-editor-template">
    <slot/>
  </v-col>
</template>

<script>
export default {
  name: "DataEditorTemplate",
  props: {},
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.data-editor-template {
  max-width: 720px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
</style>
