<template>
  <div>
    <div class="px-4 mt-4">
      <hide-on-prop
        v-if="editor.selected.block.type === 'Grid'"
        v-model="blockAttrs.hideOn"
        @update:modelValue="setAttrValue('hideOn', blockAttrs.hideOn)"
      ></hide-on-prop>
    </div>
  </div>
</template>

<script>
import HideOnProp from "@/components/SiteBuilder/Props/HideOnProp.vue";

import BlockEditorMixin from "@/views/SiteBuilder/EditorSheet/BlockEditor/BlockEditorCommon/BlockEditorMixin";
export default {
  components: { HideOnProp },
  mixins: [BlockEditorMixin],
  data() {}
};
</script>

<style lang="scss"></style>
