<template>
  <v-list elevation="1" class="py-0">
    <template v-if="loading > 0">
      <v-skeleton-loader
        v-for="i in 5"
        :key="i"
        type="list-item"
      ></v-skeleton-loader>
    </template>

    <template v-else-if="flatCategories.length > 0">
      <v-list-item @click="v => $emit('update:modelValue', null)">
        <v-list-item-title>
          {{ $t("components.fields.categoryListField") }}
        </v-list-item-title>
      </v-list-item>
      <v-divider />
      <tree-list-view
        :categories="flatCategories"
        :model-value="modelValue"
        @update:model-value="v => $emit('update:modelValue', v)"
      ></tree-list-view>
    </template>
    <template v-else>
      <v-list-item @click="v => $emit('update:modelValue', null)">
        <v-list-item-title>
          {{ $t("components.fields.categoryListFieldNull") }}
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
import TreeListView from "@/components/SiteBuilder/List/TreeListView.vue";

import CategoryBaseField from "@/components/SiteBuilder/Fields/CategoryBaseField";

import flatMap from "lodash/flatMap";

export default {
  components: { TreeListView },
  mixins: [CategoryBaseField],

  props: {
    modelValue: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    flatCategories() {
      return flatMap(this.categories, c => [
        { header: c.name, slug: c.slug },
        ...c.children.map(c => ({
          slug: c.slug,
          name: c.name,
          children: c.children
        })),
        { divider: true }
      ]);
    }
  }
};
</script>

<style></style>
