<template>
  <swiper
    v-slot="{ item }"
    :key="config.pagination + config.navigation + config.autoplay"
    :items="items"
    :autoplay="config.autoplay"
    :slides-per-view="config.slidesPerView"
    :navigation="config.navigation"
    :pagination="config.pagination"
    fill-height
  >
    <link-block :link="item.media.link" style="height:100%">
      <v-img
        v-if="item.media"
        :src="item.media.image.full"
        :lazy-src="item.media.image.thumb"
        :contain="item.media.contain"
        :auto-size="item.media.autoSize"
        height="100%"
      ></v-img>
      <v-img
        v-else
        src="https://source.unsplash.com/640x450/?tech"
        :lazy-src="require('@/assets/default-no-image.svg')"
      ></v-img>
    </link-block>
  </swiper>
</template>

<script>
import Swiper from "@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue";
import LinkBlock from "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/BlockCommon/LinkBlock.vue";

import BlockHelperMixinGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockHelperMixinGrid";
import get from "lodash/get";

export default {
  components: { Swiper, LinkBlock },
  mixins: [BlockHelperMixinGrid],

  data() {
    return {
      config: {
        items: [],
        count: 2,
        large: false,
        slidesPerView: 1,
        navigation: false,
        pagination: false,

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

  methods: {
    mediaDevice(config, type) {
      return get(config.media, type, config.media);
    }
  }
};
</script>

<style lang="scss">
.swiper {
  height: 100%;
}
.swiper-pagination {
  position: absolute !important;
  z-index: 99 !important;
}
</style>
