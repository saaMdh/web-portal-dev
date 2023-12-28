<template>
  <link-block :link="config.icon.link">
    <v-icon :size="size * (fontScale / 120)" :color="config.icon.color">{{
      config.icon.icon
    }}</v-icon></link-block
  >
</template>

<script>
import LinkBlock from "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/BlockCommon/LinkBlock.vue";

import BlockHelperMixinGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockHelperMixinGrid";

export default {
  components: { LinkBlock },
  mixins: [BlockHelperMixinGrid],

  data() {
    return {
      config: {
        icon: {
          icon: "mdi-check",
          link: "#",
          color: "primary",
          size: 6
        }
      }
    };
  },
  computed: {
    size() {
      return this.config.icon.size * 10;
    }
  }
};
</script>

<style lang="scss"></style>
