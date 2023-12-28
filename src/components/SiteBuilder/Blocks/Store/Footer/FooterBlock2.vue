<template>
  <v-footer
    class="s-footer-block2 text-center justify-center"
    style="background: transparent"
  >
    &copy; {{ store.storeName }} {{ currentYear }} &mdash; Powered by Ouedkniss
    Site Builder
  </v-footer>
</template>

<script>
import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";

import { mapGetters } from "vuex";
import { isDark } from "@/utils/colors";

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
    ...mapGetters({ store: "builder/store" }),
    currentYear() {
      return new Date().getFullYear();
    }
  },
  methods: {
    darkText() {
      return isDark(this.config.background.gradient[0]);
    }
  }
};
</script>

<style lang="scss"></style>
