<template>
  <v-container fluid class="s-footer-block">
    <v-row justify="space-between">
      <v-col :cols="$isDesktop ? 6 : 12">
        <div class="text-center">
          <v-img
            v-if="market && market.logo"
            cover
            class="rounded-lg mx-auto"
            :src="addhttp(market.logo)"
            :width="$isDesktop ? 150 : 100"
          ></v-img>
        </div>
      </v-col>
      <v-col :cols="$isDesktop ? 6 : 12">
        <div>
          <v-list class="pa-0" style="background: transparent" dense nav>
            <v-list-item
              v-for="(item, index) in menuPages.slice(0, 4)"
              :key="index"
              @click.stop="to({ name: `land-${item.slug}` })"
            >
              <span>
                <v-list-item-title>
                  {{ item.title[$i18n.locale] }}
                </v-list-item-title>
              </span>
            </v-list-item>
          </v-list>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
export default {
  mixins: [BlocksHelperMixin],

  computed: {
    ...mapGetters({ market: "builder/market", menuPages: "builder/menuPages" }),

    storeInfo() {
      return [
        {
          label: null,
          value: this.market.marketName
        }
      ].filter(v => !!v.value);
    }
  },

  methods: {
    addhttp(url) {
      if (!/^(?:f|ht)tps?:\/\//.test(url)) {
        url = "http://" + url;
      }
      return url;
    },
    to(params) {
      this.$router.push(params);
    }
  }
};
</script>

<style lang="scss">
.s-footer-block {
  .v-theme--dark.v-list {
    color: rgba(white, 0.75);
  }
}
</style>
