<template>
  <v-dialog v-model="active" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="transparent" elevation="3">
        <v-toolbar-title>{{ $t("topbar.categories") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn :aria-label="$t('topbar.categories')" icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <sub-categories-dialog
        container=".v-navigation-drawer.scrollable>.v-navigation-drawer__content"
        @category="v => openCategory(v)"
        @tagStores="v => openTagStores(v)"
      ></sub-categories-dialog>
    </v-card>
  </v-dialog>
</template>

<script>
import SearchState, { QUERY_DEFAULT } from "@/views/Search/SearchState";
import SubCategoriesDialog from "./SubCategoriesDialog.vue";
import assign from "lodash/assign";

export default {
  components: {
    SubCategoriesDialog
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    active: {
      get() {
        return this.$store.state.dialog.modelCategories;
      },
      set(v) {
        const toggle = v ? "openDialog" : "closeDialog";
        this.$store.commit(`dialog/${toggle}`, { name: "modelCategories" });
      }
    }
  },

  methods: {
    openCategory(selectedCategory) {
      const delivery = selectedCategory.delivery;
      const category = selectedCategory.category;

      assign(SearchState, QUERY_DEFAULT);
      SearchState.categorySlug = category.slug;
      let query;
      if (delivery) query = { delivery: "DELIVERY_AVAILABLE" };

      this.$router.push({
        name: "search_category",
        params: { category: category.slug, page: 1 },
        query
      });

      window.scrollTo(0, 0);
      this.close();
    },

    openTagStores(tag) {
      this.$router.replace({
        name: "boutiques",
        params: {
          tag: tag.code
        }
      });

      window.scrollTo(0, 0);
      this.close();
    },

    close() {
      this.active = false;
    }
  }
};
</script>

<style lang="scss"></style>
