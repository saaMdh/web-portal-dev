<template>
  <v-container fluid class="s-image-block pa-0">
    <dual-layout :reverse="config.reverse" :first-only="!config.withText">
      <template #first>
        <media-editor
          v-model="config.media"
          size="regular"
          hide-size-switch
          @update="update"
        >
          <template v-if="media">
            <v-img
              :src="media.image.full"
              :lazy-src="media.image.thumb"
              :contain="media.contain"
              width="100%"
              height="100%"
            ></v-img>
          </template>
          <template v-else>
            <v-img
              src="https://source.unsplash.com/640x450/?tech"
              :lazy-src="require('@/assets/default-no-image.svg')"
              :height="mediaSize"
            ></v-img>
          </template>
        </media-editor>
      </template>
      <template #second>
        <div class="s-image-block__text">
          <text-content
            v-model="config.text"
            @update:modelValue="update"
          ></text-content>
        </div>
      </template>
    </dual-layout>
  </v-container>
</template>

<script>
import TextContent from "@/components/SiteBuilder/Blocks/Common/TextContent.vue";
import MediaEditor from "@/components/SiteBuilder/Editors/MediaEditor.vue";
import DualLayout from "@/components/SiteBuilder/Blocks/Common/DualLayout.vue";

import BooleanProp from "@/components/SiteBuilder/Props/BooleanProp";
import ColorPickerPropVue from "@/components/SiteBuilder/Props/ColorPickerProp.vue";

import TextContentMixin from "@/components/SiteBuilder/Blocks/Common/TextContentMixin";
import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";

import get from "lodash/get";

export default {
  components: {
    MediaEditor,
    TextContent,
    DualLayout
  },

  mixins: [BlocksHelperMixin, TextContentMixin],

  editableProps: [
    {
      key: "reverse",
      icon: "mdi-undo-variant",
      label: "components.imageBlock.props.reverse",
      field: BooleanProp
    },
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
        reverse: false,
        withText: false,
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
    },
    mediaSize() {
      return this.config.media.autoSize
        ? undefined
        : this.$isMobile
        ? 250
        : 500;
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive";

.s-image-block {
  &__text {
    @include isMobile {
      display: flex;
      height: 100%;
      justify-content: center;
      justify-items: center;
      align-content: center;
      margin-bottom: 4px * 1;
      padding-inline: 0px;
    }
    padding-inline: 4px * 4;
  }
}
</style>
