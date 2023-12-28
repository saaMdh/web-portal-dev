<template>
  <div>
    <div class="px-4 mt-4">
      <p class="text-white">
        <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
          >mdi-link</v-icon
        >
        {{ $t("components.videoBlock.props.url") }}
      </p>
      <url-prop
        v-model="blockAttrs.videoUrl"
        @update:modelValue="setAttrValue('videoUrl', blockAttrs.videoUrl)"
      ></url-prop>
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
import UrlProp from "@/components/SiteBuilder/Props/UrlProp.vue";
import HideOnProp from "@/components/SiteBuilder/Props/HideOnProp.vue";

import BlockEditorMixin from "@/views/SiteBuilder/EditorSheet/BlockEditor/BlockEditorCommon/BlockEditorMixin";

export default {
  components: { UrlProp, HideOnProp },
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
