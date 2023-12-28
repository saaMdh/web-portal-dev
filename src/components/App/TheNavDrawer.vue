<template>
  <ok-drawer
    class="o-app-drawer"
    :width="
      $r({
        sm: 340,
        xs: '80%'
      })
    "
    :model-value="$store.state.ui.drawer"
    location="start"
    block-page-scroll
    @update:model-value="v => toggleDrawer(v)"
  >
    <!-- Lang Menu -->
    <div class="languages d-flex py-3">
      <v-btn
        v-for="(item, key) in langs"
        :key="key"
        class="px-1 mx-2"
        variant="text"
        :class="{ 'text-primary font-weight-bold': $i18n.locale === key }"
        @click.stop="applyLang(key)"
      >
        {{ item }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        icon
        density="comfortable"
        class="mx-2"
        :aria-label="$t('_.close')"
        @click.stop.prevent="toggleDrawer(false)"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <v-divider></v-divider>
    <main-menu-tab @toggle="toggleDrawer(false)"></main-menu-tab>
  </ok-drawer>
</template>

<script>
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { mapMutations } from "vuex";
import isEmpty from "lodash/isEmpty";
import pickBy from "lodash/pickBy";
import okDrawer from "@/components/uiKit/drawer";
import MainMenuTab from "./TheNavDrawer/MainMenuTab.vue";
export default {
  components: { okDrawer, MainMenuTab },
  setup() {
    const { user, locale } = useAuthFrame();
    return {
      user,
      locale,
      langs: {
        fr: "FR",
        ar: "عربية",
        en: "EN"
      }
    };
  },
  methods: {
    ...mapMutations("ui", ["toggleDrawer"]),

    refreshBookmark() {
      if (this.$refs.bookmark) this.$refs.bookmark.refresh();
    },
    applyLang(lang) {
      this.locale = lang;
      if (!isEmpty(this.$route.query.lang)) {
        const query = pickBy(this.$route.query, (v, k) => {
          return k !== "lang";
        });
        this.$router.push({ query });
      }
      if (location.href.includes("?")) {
        this.$router.push({
          path: this.$route.fullPath + "&lang=" + this.locale
        });
      } else {
        this.$router.push({
          path: this.$route.fullPath + "?lang=" + this.locale
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.languages .v-btn {
  min-width: 40px !important;
}
</style>
