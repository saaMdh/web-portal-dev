<template>
  <v-container fluid class="s-video-block">
    <dual-layout :first-only="!config.withText" :reverse="config.reverse">
      <template #first>
        <v-card class="line-height-0">
          <iframe
            width="100%"
            height="100%"
            :src="videoId"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </v-card>
      </template>

      <template #second>
        <div>
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
import DualLayout from "@/components/SiteBuilder/Blocks/Common/DualLayout.vue";
import TextContent from "@/components/SiteBuilder/Blocks/Common/TextContent.vue";

import UrlPropVue from "@/components/SiteBuilder/Props/UrlProp.vue";
import BooleanPropVue from "@/components/SiteBuilder/Props/BooleanProp.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import TextContentMixin from "@/components/SiteBuilder/Blocks/Common/TextContentMixin";

export default {
  components: { TextContent, DualLayout },
  mixins: [BlocksHelperMixin, TextContentMixin],

  editableProps: [
    {
      key: "reverse",
      icon: "mdi-undo-variant",
      label: "components.videoBlock.props.layout",
      field: BooleanPropVue
    },
    {
      key: "withText",
      icon: "mdi-text",
      label: "components.videoBlock.props.withText",
      field: BooleanPropVue
    },
    {
      key: "videoUrl",
      icon: "mdi-link",
      label: "components.videoBlock.props.url",
      field: UrlPropVue
    }
  ],

  data() {
    return {
      loading: true,
      config: {
        videoUrl: null,
        withText: false,
        reverse: false,
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

          fontSize: 5,
          textAlign: null,
          buttons: [],
          buttonCount: 0
        }
      }
    };
  },

  computed: {
    videoId() {
      if (this.config.videoUrl) return this.config.videoUrl;
      return null;
    }
  }
};
</script>

<style></style>
