<template>
  <v-card
    class="px-4 mt-4"
    style="background-color: #1e1e1e !important; color: #ffffff !important"
  >
    <v-card-title>
      <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
        >mdi-video</v-icon
      >
      {{ $t("components.mediaEditor.uploadVideo") }}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="ma-1 pa-1">
      <video-prop
        v-model="blockAttrs.media"
        size="regular "
        @update:modelValue="setAttrValue('desktop.image', blockAttrs.media)"
      ></video-prop>
    </v-card-text>

    <v-card-text class="ma-1 pa-1">
      <boolean-prop
        v-model="blockAttrs.autoplay"
        :label="$t('components.editorCustomVideo.autoplay')"
      >
      </boolean-prop>
    </v-card-text>
  </v-card>
</template>

<script>
import VideoProp from "@/components/SiteBuilder/Props/VideoProp.vue";
import BooleanProp from "@/components/SiteBuilder/Props/BooleanProp.vue";

import BlockEditorMixin from "@/views/SiteBuilder/EditorSheet/BlockEditor/BlockEditorCommon/BlockEditorMixin";
export default {
  components: { VideoProp, BooleanProp },
  mixins: [BlockEditorMixin]
};
</script>

<style lang="scss"></style>
