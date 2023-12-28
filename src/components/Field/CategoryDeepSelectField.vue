<template>
  <div class="d-flex align-center flex-gap-2">
    <category-deep-menu
      v-for="(item, index) in items"
      :key="index"
      v-slot="{ on }"
      :item="item"
      @update:modelValue="v => $emit('update:modelValue', v)"
    >
      <template v-if="item.current">
        <v-btn
          :aria-label="item.label"
          depressed
          size="small"
          tag="h2"
          color="primary"
          :loading="loading"
          v-on="on"
        >
          {{ item.label }}
          <v-icon end>mdi-menu-down</v-icon>
        </v-btn>
      </template>

      <template v-else-if="item.more">
        <v-btn
          :aria-label="$t('_.showMore')"
          depressed
          size="small"
          tag="h2"
          color="primary"
          variant="outlined"
          v-on="on"
        >
          {{ index === 1 ? $t("search.filter.category.category") : null }}
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>

      <template v-else>
        <v-btn
          :aria-label="$t('_.close')"
          depressed
          size="small"
          tag="h2"
          color="primary"
          variant="outlined"
          v-on="on"
        >
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
      </template>
    </category-deep-menu>
  </div>
</template>

<script>
import truncate from "lodash/truncate";

import CategoryDeepMenu from "./CategoryDeepMenu.vue";

export default {
  components: { CategoryDeepMenu },
  props: {
    category: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    items() {
      const categories = [...this.category.parentTree, this.category];

      let items = categories.map(cat => {
        let siblings = [];

        const parentIndex = categories.findIndex(c => cat.id == c.id) - 1;

        if (parentIndex < 0) siblings = this.$store.getters.categories;
        else siblings = categories[parentIndex].children;

        return {
          label: truncate(cat.name, {
            length: this.$isDesktop ? 50 : 24,
            separator: "..."
          }),
          current: this.category.id == cat.id,
          more: false,
          siblings
        };
      });

      items = items.slice(-2);

      const more = categories[categories.length - 1].children;

      if (more.length > 0) {
        items.push({
          label: this.$t("search.filter.category.more"),
          current: false,
          more: true,
          siblings: more
        });
      }

      return items;
    }
  }
};
</script>

<style></style>
