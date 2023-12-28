<template>
  <v-container fluid class="s-header-block">
    <div class="d-flex flex-gap-4 align-center">
      <div>
        <v-img
          cover
          class="rounded-lg"
          :src="logoUrl"
          :width="$isDesktop ? 128 : 128 - 32"
        ></v-img>
      </div>

      <div>
        <template v-if="namePath === 'store-announcement-show'">
          <h2 class="text-h5 text-md-h4 font-weight-light">
            {{ market.marketName }}
          </h2>

          <h3 class="text-subtitle-2 text-md-subtitle-1">
            {{ market.descreption }}
          </h3>
        </template>
        <template v-else>
          <h1 class="text-h5 text-md-h4 font-weight-light">
            {{ market.marketName }}
          </h1>

          <h2 class="text-subtitle-2 text-md-subtitle-1">
            {{ market.descreption }}
          </h2>
        </template>
      </div>
    </div>
  </v-container>
</template>

<script>
import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { mapGetters } from "vuex";

export default {
  mixins: [BlocksHelperMixin],

  setup() {
    const { user } = useAuthFrame();

    return {
      user
    };
  },

  computed: {
    ...mapGetters({ market: "builder/market", menuPages: "builder/menuPages" }),
    logoUrl() {
      let url = this.market.logo;
      if (!/^(?:f|ht)tps?:\/\//.test(url)) {
        url = "https://" + url;
      }
      return url;
    },
    namePath() {
      return this.$route.name;
    }
  }
};
</script>

<style lang="scss"></style>
