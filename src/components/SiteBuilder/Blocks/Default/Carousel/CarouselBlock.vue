<template>
  <swiper
    v-slot="{ item, index }"
    class="s-carousel"
    :items="items"
    :autoplay="config.autoplay"
    :slides-per-view="config.slidesPerView"
    :navigation="config.navigation"
    :pagination="config.pagination"
  >
    <media-editor
      v-model="config.items[index].media"
      hide-size-switch
      @update="update"
    >
      <v-img
        :src="item.media.image.full"
        :lazy-src="item.media.image.thumb"
        :contain="item.media.contain"
        width="100%"
        height="100%"
        class="mx-auto"
        :gradient="config.caption ? 'to top, #00000099, #00000000 50%' : ''"
      >
        <template v-if="config.caption">
          <div class="full-h d-flex align-end justify-center">
            <div
              class="px-8 text-center"
              :class="$isMobile ? 'pb-3' : 'pb-10'"
              :style="{ color: `${config.textColor}` }"
            >
              <text-editor
                v-slot="{ content }"
                v-model="config.items[index].title"
                @update:modelValue="update"
              >
                <h1
                  class="text-h5 text-sm-h4 text-md-h3 font-weight-bold s-carousel-text__title"
                >
                  {{ content[$i18n.locale] }}
                </h1>
              </text-editor>

              <text-editor
                v-slot="{ content }"
                v-model="config.items[index].subtitle"
                @update:modelValue="update"
              >
                <h2
                  class="text-h6 text-sm-h5 text-md-h4 font-weight-light s-carousel-text__subtitle"
                >
                  {{ content[$i18n.locale] }}
                </h2>
              </text-editor>
            </div>
          </div>
        </template>
      </v-img>
    </media-editor>
  </swiper>
</template>

<script>
import TextEditor from "@/components/SiteBuilder/Editors/TextEditor.vue";
import MediaEditor from "@/components/SiteBuilder/Editors/MediaEditor.vue";

import ColorPickerPropVue from "@/components/SiteBuilder/Props/ColorPickerProp.vue";
import BooleanPropVue from "@/components/SiteBuilder/Props/BooleanProp.vue";
import NumberPropVue from "@/components/SiteBuilder/Props/NumberProp.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import { ensureItemsCount } from "@/utils/array";

import { mapMutations } from "vuex";
import get from "lodash/get";
import { defineAsyncComponent } from "vue";
export default {
  components: {
    Swiper: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
    ),
    MediaEditor,
    TextEditor
  },
  mixins: [BlocksHelperMixin],

  editableProps: [
    {
      key: "slidesPerView",
      icon: "mdi-eye-check",
      label: "components.carouselBlock.props.slidesPerView",
      field: NumberPropVue,
      bind: {
        min: 1,
        max: 4
      }
    },
    {
      key: "count",
      icon: "mdi-format-list-numbered",
      label: "components.carouselBlock.props.count",
      field: NumberPropVue,
      bind: {
        min: 1,
        max: 8
      }
    },
    {
      key: "navigation",
      icon: "mdi-arrow-expand-all",
      label: "components.carouselBlock.props.navigation",
      field: BooleanPropVue
    },
    {
      key: "pagination",
      icon: "mdi-dots-horizontal",
      label: "components.carouselBlock.props.pagination",
      field: BooleanPropVue
    },
    {
      key: "caption",
      icon: "mdi-text-box",
      label: "components.carouselBlock.props.caption",
      field: BooleanPropVue
    },
    {
      key: "autoplay",
      icon: "mdi-play-box-multiple",
      label: "components.carouselBlock.props.autoplay",
      field: BooleanPropVue
    },
    {
      icon: "mdi-format-color-fill",
      key: "textColor",
      label: "components.headingBlock.props.textColor",
      field: ColorPickerPropVue
    }
  ],

  data() {
    return {
      config: {
        items: [],
        count: 2,
        large: false,
        slidesPerView: 1,
        navigation: false,
        pagination: false,
        textColor: null,
        caption: true,
        autoplay: false
      }
    };
  },

  computed: {
    items() {
      return this.$isDesktop
        ? this.config.items.map(c => ({
            ...c,
            media: this.mediaDevice(c, "desktop")
          }))
        : this.config.items.map(c => ({
            ...c,
            media: this.mediaDevice(c, "mobile")
          }));
    }
  },

  watch: {
    config: {
      immediate: true,
      handler: "fill"
    }
  },

  methods: {
    ...mapMutations({ updateBlockAttr: "builder/updateBlockAttr" }),

    mediaDevice(config, type) {
      return get(config.media, type, config.media);
    },

    fill() {
      this.config.items = ensureItemsCount(
        this.config.items || [],
        this.config.count,
        () => ({
          media: {
            image: {
              full:
                `https://source.unsplash.com/1600x900/?tech&` + Math.random(),
              thumb: require("@/assets/default-no-image.svg")
            },
            link: null,
            contain: false
          },
          title: {
            fr: "Le titre",
            ar: "العنوان الرئيسي",
            en: "The title"
          },
          subtitle: {
            fr: "Le sous-titre",
            ar: "العنوان الثانوي",
            en: "The subtitle"
          }
        })
      );
    }
  }
};
</script>

<style lang="scss">
.s-carousel-text {
  &__title {
    line-height: 1;
    font-weight: 600;
    white-space: pre-line;
  }

  &__subtitle {
    line-height: 1;
    font-weight: 300;
    white-space: pre-line;
    margin-top: 4px * 1;
  }
}
</style>
