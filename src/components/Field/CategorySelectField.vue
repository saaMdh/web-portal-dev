<template>
  <v-select
    v-model="selected"
    :items="_categories"
    :return-object="!returnSlug"
    clearable
    hide-details
    item-title="name"
    :item-value="returnSlug ? slugPath : 'id'"
    :item-props="true"
    density="compact"
    variant="solo-filled"
    :menu-props="{ contentClass: 'categories-select-menu' }"
    :label="label ? $t(label) : $t('search.filter.category.choose')"
    single-line
  >
    <template v-if="all" #prepend-item>
      <v-list-item
        density="compact"
        class="px-3 py-0 ma-0"
        @click="categorySlug = 0"
      >
        <template #prepend>
          <v-avatar>
            <v-icon color="primary">mdi-widgets</v-icon>
          </v-avatar>
        </template>
        <v-list-item-title class="font-weight-bold">
          {{ $t("search.allCategories") }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <template #item="{ props }">
      <v-divider v-if="props.type === 'divider'"></v-divider>
      <v-list-item
        v-else
        :key="props.key"
        :ref="props.ref"
        density="compact"
        @click="props.onClick"
      >
        <v-list-item-title
          :class="{ 'mx-4': props.type !== 'subheader' }"
          :style="props.type !== 'subheader' ? 'font-size:0.9em' : ''"
        >
          {{ props.name }}
        </v-list-item-title>
        <template v-if="!hideIcon" #prepend>
          <category-img size="32" :category="props" class="me-1"></category-img>
        </template>
      </v-list-item>
    </template>

    <template #selection="{ item }">
      {{ item.props.name }}
    </template>
  </v-select>
</template>

<script>
import get from "lodash/get";
export default {
  props: {
    modelValue: {
      type: [Object, String, Number],
      default: null
    },

    returnSlug: {
      type: Boolean,
      default: false
    },

    categories: {
      type: Array,
      default: () => []
    },

    hideIcon: {
      type: Boolean,
      default: false
    },

    all: {
      type: Boolean,
      default: false
    },

    label: {
      type: String,
      default: null
    },

    slugPath: {
      type: String,
      default: "target.slug"
    }
  },
  emits: ["select", "updateSlug"],

  computed: {
    _categories() {
      return this.categories.length > 0
        ? this.categories
        : this.$store.getters.categories;
    },
    selected: {
      get() {
        if (this.modelValue == 0) return null;
        if (this.returnSlug)
          return this._categories.find(
            c => this.modelValue == get(c, this.slugPath, "")
          );
        else return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
        this.$emit("select", v);
      }
    }
  }
};
</script>
<style lang="scss">
.categories-select-menu {
  left: 12px !important;
  right: 12px !important;
}
</style>
