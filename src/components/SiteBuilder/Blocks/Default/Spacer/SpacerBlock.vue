<template>
  <div class="s-social-block"></div>
</template>

<script>
import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import SpaceStepPropVue from "@/components/SiteBuilder/Props/SpaceStepProp.vue";

export default {
  mixins: [BlocksHelperMixin],
  editableProps: [
    {
      icon: "mdi-arrow-expand-vertical",
      key: "padding",
      label: "editorPropsDefault.padding",
      field: SpaceStepPropVue,
      bind: {
        min: 1,
        max: 9
      }
    }
  ]
};
</script>

<style></style>
