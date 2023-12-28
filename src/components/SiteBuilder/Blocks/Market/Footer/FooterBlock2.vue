<template>
  <v-footer
    class="s-footer-block2 text-center justify-center"
    style="background: transparent"
  >
    &copy; {{ market.marketName }} {{ currentYear }} &mdash; Powered by
    Ouedkniss Site Builder
  </v-footer>
</template>

<script>
import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";

import { mapGetters } from "vuex";

export default {
  components: {},
  mixins: [BlocksHelperMixin],

  props: {
    logo: {
      type: String,
      default: null
    }
  },

  computed: {
    ...mapGetters({ market: "builder/market" }),
    currentYear() {
      return new Date().getFullYear();
    }
  }
};
</script>

<style lang="scss"></style>
