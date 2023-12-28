<template>
  <link-block :link="config.link">
    <ok-img
      v-if="media?.image"
      :src="media.image?.full"
      :lazy-src="media.image?.thumb"
      :contain="media.contain"
      :cover="!media.contain"
      height="100%"
    ></ok-img>
    <ok-img
      v-else
      src="https://source.unsplash.com/640x450/?tech"
      :lazy-src="require('@/assets/default-no-image.svg')"
    ></ok-img>
  </link-block>
</template>

<script>
import LinkBlock from "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/BlockCommon/LinkBlock.vue";

import BlockHelperMixinGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockHelperMixinGrid";

import get from "lodash/get";
export default {
  components: { LinkBlock },

  mixins: [BlockHelperMixinGrid],

  data() {
    return {
      config: {
        media: null,
        link: "#"
      }
    };
  },

  computed: {
    media() {
      return this.$isDesktop
        ? get(this.config.media, "desktop", this.config.media)
        : get(this.config.media, "mobile", this.config.media);
    }
  },
  methods: {}
};
</script>

<style lang="scss"></style>
