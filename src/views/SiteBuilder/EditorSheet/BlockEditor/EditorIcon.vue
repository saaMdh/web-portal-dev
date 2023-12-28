<template>
  <div>
    <div class="px-4 mt-4">
      <p class="text-white">
        <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
          >mdi-link</v-icon
        >
        {{ $t("editorBlocks.link") }}
      </p>
      <link-field
        v-model="blockAttrs.icon.link"
        @update:modelValue="setAttrValue('icon.link', blockAttrs.icon.link)"
      ></link-field>

      <v-divider class="mb-4"></v-divider>
      <icon-field
        v-model="blockAttrs.icon.icon"
        @update:modelValue="setAttrValue('icon.icon', blockAttrs.icon.icon)"
      ></icon-field>
      <v-divider class="my-4"></v-divider>
      <p class="text-white mb-0">
        <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
          >mdi-format-size</v-icon
        >
        {{ $t("editorBlocks.size") }}
      </p>
      <space-step-prop
        v-bind="{ min: 6, max: 10 }"
        v-model="blockAttrs.icon.size"
        @update:modelValue="setAttrValue('icon.size', blockAttrs.icon.size)"
      ></space-step-prop>
      <v-divider class="mb-4"></v-divider>
      <p class="text-white mb-0">
        <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
          >mdi-format-color-fill</v-icon
        >
        {{ $t("editorBlocks.color") }}
      </p>
      <color-field
        v-model="blockAttrs.icon.color"
        @update:modelValue="setAttrValue('icon.color', blockAttrs.icon.color)"
      ></color-field>
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
import LinkField from "@/components/SiteBuilder/Fields/LinkField.vue";
import IconField from "@/components/SiteBuilder/Fields/IconField.vue";
import ColorField from "@/components/SiteBuilder/Fields/ColorField.vue";
import SpaceStepProp from "@/components/SiteBuilder/Props/SpaceStepProp.vue";
import HideOnProp from "@/components/SiteBuilder/Props/HideOnProp.vue";

import BlockEditorMixin from "@/views/SiteBuilder/EditorSheet/BlockEditor/BlockEditorCommon/BlockEditorMixin";

export default {
  components: { LinkField, IconField, ColorField, SpaceStepProp, HideOnProp },
  mixins: [BlockEditorMixin]
};
</script>

<style lang="scss"></style>
