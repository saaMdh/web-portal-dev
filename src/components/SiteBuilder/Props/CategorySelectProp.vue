<template>
  <v-autocomplete
    :model-value="nestedCategory"
    :items="flatCategories"
    item-title="name"
    item-value="slug"
    solo
    flat
    clearable
    chips
    :label="label && $t(label)"
    @update:modelValue="onChange"
  ></v-autocomplete>
</template>

<script>
import CategoryBaseField from "@/components/SiteBuilder/Fields/CategoryBaseField";
import flatMap from "lodash/flatMap";

export default {
  mixins: [CategoryBaseField],
  props: {
    modelValue: {
      type: [String, Number],
      default: null
    },
    label: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      nestedCategory: null
    };
  },

  computed: {
    flatCategories() {
      return flatMap(this.categories, c => [
        { header: c.name },
        ...c.children.map(c => ({
          slug: c.slug,
          name: c.name,
          children: c.children
        })),
        { divider: true }
      ]);
    }
  },
  methods: {
    onChange(v) {
      if (!v) this.$emit("update:modelValue", null);
      else this.$emit("update:modelValue", v);
    }
  }
};
</script>

<style></style>
