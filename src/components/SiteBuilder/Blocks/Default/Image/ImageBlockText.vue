<template>
  <v-container fluid class="s-image-block pa-0">
    <media-editor
      v-model="config.media"
      size="regular"
      hide-size-switch
      @update="update"
    >
      <v-img
        :src="media.image.full"
        :lazy-src="media.image.thumb"
        :contain="media.contain"
        width="100%"
        height="100%"
        class="mx-auto"
        style="align-items: center; justify-content: center;"
      >
      </v-img>
    </media-editor>
    <v-container
      class="ma-0 fill-width image-text"
      :style="
        config.theme && config.theme === 'dark'
          ? 'background-color: #0000004f;'
          : 'background-color: #FFFFFF2C'
      "
    >
      <text-content
        v-model="config.text"
        class="mx-4"
        @update:modelValue="update"
      ></text-content>
    </v-container>
  </v-container>
</template>

<script>
import TextContent from "@/components/SiteBuilder/Blocks/Common/TextContent.vue";
import MediaEditor from "@/components/SiteBuilder/Editors/MediaEditor.vue";
import TextContentMixin from "@/components/SiteBuilder/Blocks/Common/TextContentMixin";

import ColorPickerPropVue from "@/components/SiteBuilder/Props/ColorPickerProp.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import get from "lodash/get";

export default {
  components: {
    MediaEditor,
    TextContent
  },

  mixins: [BlocksHelperMixin, TextContentMixin],
  editableProps: [
    {
      icon: "mdi-format-color-fill",
      key: "text.textColor",
      label: "components.headingBlock.props.textColor",
      field: ColorPickerPropVue
    }
  ],

  data() {
    return {
      config: {
        media: null,
        showCaption: false,
        text: {
          title: {
            fr: "Le titre",
            ar: "العنوان الرئيسي",
            en: "The title"
          },
          subtitle: {
            fr: "Le sous-titre",
            ar: "العنوان الثانوي",
            en: "The subtitle"
          },
          content: {
            fr: "Le contenu en text",
            ar: "المحتوى",
            en: "Text content"
          },
          fontSize: 5,
          textAlign: null,
          textColor: null,
          buttons: [],
          buttonCount: 0
        }
      }
    };
  },

  computed: {
    media() {
      return this.$isDesktop
        ? get(this.config.media, "desktop", this.config.media)
        : get(this.config.media, "mobile", this.config.media);
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive";

.s-image-block {
  @include isMobile {
    > .__text {
      margin-bottom: 4px * 8;
    }
  }
  .image-text {
    position: absolute;
    backdrop-filter: blur(5px);
    top: 70%;
    transform: translateY(-50%);
  }
}
</style>
