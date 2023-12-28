<template>
  <v-container fluid class="s-annon-block">
    <component v-bind="$props" :is="view"></component>
  </v-container>
</template>

<script>
import { defineAsyncComponent } from "vue";
import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";

const DesktopView = defineAsyncComponent(() => import("@/components/SiteBuilder/Blocks/Store/AnnounBrowser/components/AnnounBrowserDesktop"));
const MobileView = defineAsyncComponent(() => import("@/components/SiteBuilder/Blocks/Store/AnnounBrowser/components/AnnounBrowserMobile"));

export default {
  components: {},

  mixins: [BlocksHelperMixin],

  computed: {
    view() {
      return this.$isMobile ? MobileView : DesktopView;
    }
  }
};
</script>
