<template>
  <v-container class="py-0" fluid>
    <v-toolbar color="transparent" flat tile>
      <template v-if="$isMobile">
        <v-toolbar-title class="px-1">{{
          currentPage.title[$i18n.locale]
        }}</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn icon @click="expand = !expand">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-toolbar-items>
      </template>

      <template v-if="$isDesktop">
        <v-toolbar-items>
          <template v-for="item in menuPages" :key="item.slug">
            <v-btn variant="text" @click="to({ name: `store-${item.slug}` })">
              {{ item.title[$i18n.locale] }}
            </v-btn>
          </template>
        </v-toolbar-items>
      </template>
    </v-toolbar>

    <template v-if="$isMobile">
      <v-expand-transition>
        <v-list v-if="expand" class="mb-3 py-0" rounded>
          <template v-for="item in menuPages" :key="item.slug">
            <v-list-item
              variant="text"
              @click="to({ name: `store-${item.slug}` })"
            >
              <v-list-item-title>{{
                item.title[$i18n.locale].toUpperCase()
              }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-expand-transition>
    </template>
  </v-container>
</template>

<script>
import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";

import { mapGetters } from "vuex";

export default {
  components: {},
  mixins: [BlocksHelperMixin],

  data() {
    return {
      expand: false,
      config: {
        logo: null,
        showLogo: this.showLogo
      }
    };
  },

  computed: {
    ...mapGetters({
      menuPages: "builder/menuPages",
      currentPage: "builder/currentPage",
      store: "builder/store"
    })
  },
  watch: {
    $route() {
      this.expand = false;
    }
  },
  methods: {
    to(params) {
      this.$router.push(params);
    }
  }
};
</script>
<style>
.o-block .v-toolbar__content {
  padding-left: 0;
  padding-right: 0;
}
</style>
