<template>
  <v-breadcrumbs
    v-if="items"
    :items="items"
    class="search-breadcrumbs pa-0 mt-2"
  >
    <template #divider>
      <v-icon size="24" color="primary" class="mt-2 mx-0 px-0">
        {{ $vuetify.locale.rtl ? "mdi-chevron-left" : "mdi-chevron-right" }}
      </v-icon>
    </template>

    <template #item="{ item }">
      <div class="mt-2">
        <v-menu offset-y :max-height="$isMobile ? '300' : '500'">
          <template #activator="{ props }">
            <v-btn
              v-if="item.current"
              :aria-label="item.name"
              v-bind="props"
              depressed
              size="small"
              class="px-1 px-md-3"
              tag="h2"
              color="primary"
            >
              {{ item.label }} <v-icon class="mx-0" end>mdi-menu-down</v-icon>
            </v-btn>

            <v-btn
              v-else
              :aria-label="item.name"
              class="px-1 px-md-3"
              v-bind="props"
              size="small"
              variant="outlined"
              color="primary"
            >
              <template v-if="$isDesktop">{{ item.label }}</template>
              <template v-else>{{ getFirstWord(item.label) }}</template>
              <v-icon class="mx-0" end>mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-list v-if="item.siblings.length > 0" dense>
            <v-list-item
              v-for="(child, index) in item.siblings"
              :key="index"
              @click="$emit('update:modelValue', child)"
            >
              <v-list-item-title>{{ child.name }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-card v-else>
            <v-card-text>
              {{ $t("search.filter.category.empty") }}
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </template>
  </v-breadcrumbs>
</template>

<script>
import truncate from "lodash/truncate";
export default {
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
            length: this.$isDesktop ? 50 : 30,
            separator: "..."
          }),
          current: this.category.id == cat.id,
          siblings
        };
      });

      const more = categories[categories.length - 1].children;

      if (more.length > 0) {
        items.push({
          label: this.$t("search.filter.category.more"),
          current: false,
          siblings: more
        });
      }

      return items;
    }
  },

  methods: {
    getFirstWord: function(word) {
      return word.split(" ")[0];
    }
  }
};
</script>

<style lang="scss">
.search-breadcrumbs .v-breadcrumbs__divider {
  padding: 0 2px !important;
}
.search-breadcrumbs .v-btn__content {
  letter-spacing: -0.5px;
}
</style>
