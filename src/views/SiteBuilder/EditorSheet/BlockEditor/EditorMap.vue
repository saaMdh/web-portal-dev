<template>
  <div>
    <div class="px-4 mt-4">
      <p class="text-white">
        <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
          >mdi-map-marker-plus</v-icon
        >
        {{ $t("components.mapsBlock.props.storeLocation") }}
      </p>
      <store-location-prop
        v-model="blockAttrs.storeLocation"
        @update:modelValue="setAttrValue('storeLocation', blockAttrs.storeLocation)"
      ></store-location-prop>
      <v-divider class="ma-2"></v-divider>
      <hide-on-prop
        v-if="editor.selected.block.type === 'Grid'"
        v-model="blockAttrs.hideOn"
        @update:modelValue="setAttrValue('hideOn', blockAttrs.hideOn)"
      ></hide-on-prop>
    </div>
  </div>
</template>

<script>
import StoreLocationProp from "@/components/SiteBuilder/Props/StoreLocationProp.vue";
import HideOnProp from "@/components/SiteBuilder/Props/HideOnProp.vue";

import BlockEditorMixin from "@/views/SiteBuilder/EditorSheet/BlockEditor/BlockEditorCommon/BlockEditorMixin";

export default {
  components: { StoreLocationProp, HideOnProp },
  mixins: [BlockEditorMixin],
  data() {
    return {};
  }
};
</script>

<style lang="scss"></style>
