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
        v-model="blockAttrs.link"
        @update:modelValue="setAttrValue('link', blockAttrs.link)"
      ></link-field>

      <v-divider class="mb-2"></v-divider>
      <p class="text-white">
        <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
          >mdi-image-multiple</v-icon
        >
        {{ $t("components.mediaEditor.uploadImage") }}
      </p>

      <v-card
        class="pa-2"
        style="background-color: #1e1e1e !important; color: #ffffff !important"
      >
        <v-toolbar-items class="mb-n4">
          <p>
            {{ $t("components.mediaEditor.chooseImageDesktop") }}
          </p>
          <v-spacer></v-spacer>

          <v-switch
            v-model="blockAttrs.media.desktop.contain"
            :label="$t('components.mediaEditor.resize')"
            class="ma-0"
            @change="
              setAttrValue('desktop.contain', blockAttrs.media.desktop.contain)
            "
          ></v-switch>
        </v-toolbar-items>

        <picture-prop
          v-model="blockAttrs.media.desktop.image"
          size="regular "
          @update:modelValue="
            setAttrValue('desktop.image', blockAttrs.media.desktop.image)
          "
        ></picture-prop>
      </v-card>
      <v-divider class="ma-2"></v-divider>
      <v-card
        class="pa-2"
        style="background-color: #1e1e1e !important; color: #ffffff !important"
      >
        <v-toolbar-items class="mb-n4">
          <p>
            {{ $t("components.mediaEditor.chooseImageMobile") }}
          </p>
          <v-spacer></v-spacer>
          <v-switch
            v-model="blockAttrs.media.mobile.contain"
            :label="$t('components.mediaEditor.resize')"
            class="ma-0"
            @change="
              setAttrValue('mobile.contain', blockAttrs.media.mobile.contain)
            "
          ></v-switch>
        </v-toolbar-items>

        <picture-prop
          v-model="blockAttrs.media.mobile.image"
          size="regular"
          @update:modelValue="
            setAttrValue('mobile.image', blockAttrs.media.mobile.image)
          "
        ></picture-prop>
      </v-card>
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

import PictureProp from "@/components/SiteBuilder/Props/PictureProp.vue";
import HideOnProp from "@/components/SiteBuilder/Props/HideOnProp.vue";

import BlockEditorMixin from "@/views/SiteBuilder/EditorSheet/BlockEditor/BlockEditorCommon/BlockEditorMixin";
import get from "lodash/get";
export default {
  components: { PictureProp, LinkField, HideOnProp },
  mixins: [BlockEditorMixin],
  watch: {
    "blockAttrs.media.desktop.image": {
      handler(v) {
        const ImgThumbMobile = get(
          this.blockAttrs.media,
          "mobile.image.thumb",
          ""
        );
        if (
          v &&
          v.thumb &&
          !v.thumb.includes("default-no-image") &&
          ImgThumbMobile.includes("default-no-image")
        ) {
          this.blockAttrs.media.mobile.image =
            this.blockAttrs.media.desktop.image;
          this.setAttrValue(
            "mobile.image",
            this.blockAttrs.media.desktop.image
          );
        }
      }
    },
    "blockAttrs.media.mobile.image": {
      handler(v) {
        const ImgThumbDesktop = get(
          this.blockAttrs.media,
          "desktop.image.thumb",
          ""
        );
        if (
          v &&
          v.thumb &&
          !v.thumb.includes("default-no-image") &&
          ImgThumbDesktop.includes("default-no-image")
        ) {
          this.blockAttrs.media.desktop.image =
            this.blockAttrs.media.mobile.image;
          this.setAttrValue("mobile.image", this.blockAttrs.media.mobile.image);
        }
      }
    }
  }
};
</script>

<style lang="scss"></style>
