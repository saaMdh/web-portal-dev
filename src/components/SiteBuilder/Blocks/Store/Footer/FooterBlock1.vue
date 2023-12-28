<template>
  <v-container fluid class="s-footer-block">
    <v-row justify="space-between">
      <v-col :cols="$isDesktop ? 3 : 12">
        <div
          class="text-center"
          @click="
            to({
              name: `${isStorePath($route) ? 'store' : 'land'}-${homePage.slug}`
            })
          "
        >
          <v-img
            cover
            class="rounded-lg mx-auto"
            :src="addhttp(store.imageUrl)"
            :width="$isDesktop ? 150 : 100"
          ></v-img>
        </div>
      </v-col>
      <v-col v-if="store.mainLocation" :cols="$isDesktop ? 3 : 12">
        <!-- TODO fix conflict theme-provider card  -->
        <p
          v-for="(item, index) in storeInfo"
          :key="index"
          :class="{
            'text-white': blockAttrs.theme == 'dark',
            'text-black': blockAttrs.theme == 'light'
          }"
        >
          <span v-if="item.label" class="d-inline-block"
            >{{ item.label }} :</span
          >
          <span :dir="item.dir" class="d-inline-block">{{ item.value }}</span>
        </p>
      </v-col>

      <v-col :cols="$isDesktop ? 3 : 12">
        <v-list class="pa-0" style="background: transparent" dense nav>
          <v-list-item
            v-for="(item, index) in menuPages.slice(0, 4)"
            :key="index"
            class="ma-0"
            @click.stop="to({ name: `store-${item.slug}` })"
          >
            <v-list-item-title class="text-subtitle-1">
              {{ item.title[$i18n.locale] }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col v-if="showSocialsList" :cols="$isDesktop ? 3 : 12">
        <v-list class="pa-0" style="background: transparent" dense nav>
          <v-list-item
            v-for="(item, index) in store.mainLocation.socials"
            :key="index"
            :href="item.url"
            target="_blank"
          >
            <template #prepend>
              <social-icon :name="item.name"></social-icon>
            </template>
            <span>
              <v-list-item-title class="text-capitalize text-subtitle-1 py-1">
                {{ item.name }}
              </v-list-item-title>
            </span>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SocialIcon from "@ouedkniss/web-ui-plugin/src/components/Formatting/SocialIcon.vue";

import BlockHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";

import { mapGetters } from "vuex";
import { isStorePath } from "@/utils/location";

export default {
  components: { SocialIcon },

  mixins: [BlockHelperMixin],

  computed: {
    ...mapGetters({
      store: "builder/store",
      menuPages: "builder/menuPages",
      homePage: "builder/homePage"
    }),

    storeInfo() {
      return [
        {
          label: null,
          value: this.store.storeName
        },
        {
          label: null,
          value: this.store.mainLocation.location.address
        },
        {
          label: this.$t("components.footerBlock.storeInfo.phone"),
          value: this.store.mainLocation.phones.join(" / "),
          dir: "ltr"
        },
        {
          label: this.$t("components.footerBlock.storeInfo.fax"),
          value: this.store.mainLocation.faxes.join(" / ")
        },
        {
          label: this.$t("components.footerBlock.storeInfo.email"),
          value: this.store.mainLocation.emails.join(" / ")
        }
      ].filter(v => !!v.value);
    },

    showSocialsList() {
      return (
        this.store.mainLocation && this.store.mainLocation.socials.length > 0
      );
    }
  },

  methods: {
    isStorePath,
    to(params) {
      this.$router.push(params);
    },
    addhttp(url) {
      if (!/^(?:f|ht)tps?:\/\//.test(url)) {
        url = "http://" + url;
      }
      return url;
    }
  }
};
</script>
<style lang="scss">
.s-footer-block .v-list-item--nav .v-list-item-title {
  line-height: 1.2em;
}
</style>
