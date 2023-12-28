<template>
  <div>
    <div class="px-4 mt-4">
      <v-textarea
        v-for="loc in locales"
        :key="loc"
        v-model="blockAttrs.text[loc]"
        autofocus
        filled
        row="2"
        clearable
        :label="label_locales[loc]"
        height="150px"
        class="mb-n4"
        @update:model-value="setAttrValue(`text[${loc}]`, blockAttrs.text[loc])"
      ></v-textarea>
      <v-divider class="mt-2 mb-4"></v-divider>
      <p class="text-white mb-0">
        <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
          >mdi-format-size</v-icon
        >
        {{ $t("components.textContent.props.fontSize") }}
      </p>

      <space-step-prop
        v-model="blockAttrs.text.fontSize"
        @update:modelValue="
          setAttrValue('text.fontSize', blockAttrs.text.fontSize)
        "
      ></space-step-prop>

      <v-divider class="mb-4"></v-divider>
      <p class="text-white">
        <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
          >mdi-format-align-left</v-icon
        >
        {{ $t("components.textContent.props.textAlign") }}
      </p>
      <align-prop
        v-model="blockAttrs.text.textAlign"
        @update:modelValue="
          setAttrValue('text.textAlign', blockAttrs.text.textAlign)
        "
      ></align-prop>
      <v-divider class="my-4"></v-divider>
      <p class="text-white mb-1">
        <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
          >mdi-format-color-fill</v-icon
        >
        {{ $t("components.headingBlock.props.textColor") }}
      </p>
      <color-field
        v-model="blockAttrs.text.textColor"
        @update:modelValue="
          setAttrValue('text.textColor', blockAttrs.text.textColor)
        "
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
import AlignProp from "@/components/SiteBuilder/Props/AlignProp.vue";
import SpaceStepProp from "@/components/SiteBuilder/Props/SpaceStepProp.vue";
import ColorField from "@/components/SiteBuilder/Fields/ColorField.vue";
import HideOnProp from "@/components/SiteBuilder/Props/HideOnProp.vue";

import BlockEditorMixin from "@/views/SiteBuilder/EditorSheet/BlockEditor/BlockEditorCommon/BlockEditorMixin";

export default {
  components: { AlignProp, SpaceStepProp, ColorField, HideOnProp },
  mixins: [BlockEditorMixin],
  data() {
    return {
      locales: ["fr", "ar", "en"],
      label_locales: { fr: "Français", ar: "عربي", en: "English" }
    };
  }
};
</script>

<style lang="scss"></style>
