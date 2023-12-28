<template>
  <v-container class="features-grid">
    <v-row>
      <v-col
        v-for="(item, i) in config.items"
        :key="i"
        :cols="6"
        class="text-center"
        style="position: relative"
      >
        <feature-editor
          v-model="config.items[i]"
          :show-subtitle="config.showSubtitle"
          @update:modelValue="update"
        >
          <media-editor
            v-if="item.isImage"
            v-model="config.items[i].media"
            style="
               {
                z-index: 2;
              }
            "
            :size="$isDesktop ? '91' : '40'"
            hide-size-switch
            hide-link
            :feature="i"
            @update="updateMedia"
          >
            <v-img
              v-if="item.media"
              :src="
                $isDesktop
                  ? item.media.desktop?.image?.full
                  : item.media.mobile?.image?.full
              "
              :lazy-src="
                $isDesktop
                  ? item.media.desktop?.image?.thumb
                  : item.media.mobile?.image?.thumb
              "
              :contain="
                $isDesktop
                  ? item.media.desktop?.contain
                  : item.media.mobile?.contain
              "
              :height="$isDesktop ? '91' : '40'"
              :width="$isDesktop ? '91' : '40'"
              class="mx-auto"
            ></v-img>
            <v-img
              v-else
              class="mx-auto"
              src="https://source.unsplash.com/640x450/?tech"
              :lazy-src="require('@/assets/default-no-image.svg')"
              :height="$isDesktop ? '91' : '40'"
              :width="$isDesktop ? '91' : '40'"
            ></v-img>
          </media-editor>
          <v-icon
            v-else
            :size="$isDesktop ? '91' : '40'"
            :color="item.color ? item.color : 'primary'"
            >{{ item.icon }}</v-icon
          >

          <p
            class="text-primary font-weight-light"
            :class="$isDesktop ? 'text-h4' : 'text-h6 font-weight-bold'"
            :style="
              (item.titleSize
                ? 'font-size:' +
                  (0.8 + item.titleSize * 0.4) +
                  'rem !important;'
                : '') +
              (color = item.color ? 'color:' + item.color + ' !important' : '')
            "
          >
            {{ item.title }}
          </p>

          <p
            v-if="config.showSubtitle"
            :class="$isDesktop ? 'subtitle-1' : 'caption'"
            :style="
              item.subtitleSize
                ? 'font-size:' +
                  (0.4 + item.subtitleSize * 0.2) +
                  'rem !important;'
                : ''
            "
          >
            {{ item.text }}
          </p>
        </feature-editor>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FeatureEditor from "@/components/SiteBuilder/Editors/FeatureEditor.vue";
import MediaEditor from "@/components/SiteBuilder/Editors/MediaEditor.vue";
import BooleanProp from "@/components/SiteBuilder/Props/BooleanProp.vue";
import NumberProp from "@/components/SiteBuilder/Props/NumberProp.vue";

import BlockHelperMixinGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockHelperMixinGrid";
import { ensureItemsCount } from "@/utils/array";

export default {
  components: { FeatureEditor, MediaEditor },
  mixins: [BlockHelperMixinGrid],
  editableProps: [
    {
      key: "itemsCount",
      icon: "mdi-format-list-numbered",
      label: "components.featureEditor.props.itemsCount",
      field: NumberProp,
      bind: {
        min: 1,
        max: 4
      }
    },
    {
      key: "showSubtitle",
      icon: "mdi-subtitles-outline",
      label: "components.featureEditor.props.showSubtitle",
      field: BooleanProp
    }
  ],

  data() {
    return {
      editableIndex: null,
      config: {
        itemsCount: 4,
        items: [],
        showSubtitle: true
      }
    };
  },

  watch: {
    config: {
      handler() {
        this.config.items = ensureItemsCount(
          this.config.items,
          this.config.itemsCount,
          () => ({
            icon: "mdi-check",
            title: this.$t("components.featureEditor.service"),
            text: this.$t("components.featureEditor.text"),
            link: "#",
            isImage: false,
            media: null
          })
        );
      },
      immediate: true
    }
  },

  methods: {
    updateMedia(media) {
      const i = media.featureId;
      delete media.featureId;
      this.config.items[i].media = media;
    }
  }
};
</script>

<style scoped>
.features-grid {
  display: flex;
  width: 100%;
  align-items: center;
}
</style>
