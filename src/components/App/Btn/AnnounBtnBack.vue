<template>
  <v-btn v-bind="$attrs" icon :aria-label="$t('_.cancel')" @click="goTo">
    <v-icon>
      {{ $vuetify.locale.rtl ? "mdi-chevron-right" : "mdi-chevron-left" }}
    </v-icon>
  </v-btn>
</template>

<script>
import { usePrevPage } from "@/composables/prev-page";
import get from "lodash/get";
export default {
  setup() {
    const { page } = usePrevPage();

    return {
      prevPage: page
    };
  },

  computed: {
    categories() {
      return get(this.$store, "state.app.announcement.categories", null);
    },
    lastCategory() {
      if (this.categories === null) return null;
      const categories = [...this.categories].sort((a, b) => a.id - b.id);
      return categories[categories.length - 1];
    }
  },
  methods: {
    goTo() {
      if (
        this.$route.name === "announcement_show" &&
        this.lastCategory &&
        this.prevPage.name === null
      ) {
        this.$router.push({
          name: "search_category",
          params: { category: this.lastCategory.slug, page: 1 }
        });
        return;
      }
      if (
        this.prevPage.name !== null &&
        this.prevPage.name === "announcement_show" &&
        this.$route.name === "search_category"
      ) {
        this.$router.push({
          name: "home"
        });
        return;
      }

      if (this.prevPage.name !== null) {
        this.$router.go(-1);
        return;
      }

      this.$router.push({
        name: "home"
      });
    }
  }
};
</script>
