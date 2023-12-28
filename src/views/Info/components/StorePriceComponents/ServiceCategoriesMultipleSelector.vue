<template>
  <v-select
    v-model="selectedCategories"
    variant="outlined"
    :items="categories"
    item-title="name"
    return-object
    :label="$t('purchase.store.purchaseForm.step1.fields.category.label')"
    :placeholder="$t('purchase.store.purchaseForm.step1.fields.category.label')"
    :item-disabled="isDisabled"
    multiple
    small-chips
    persistent-hint
    dense
  >
  </v-select>
</template>
<script>
import flatMap from "lodash/flatMap";

export default {
  props: {
    modelValue: { type: Array, default: null },
    categories: { type: Array, default: null },
    disableCategories: { type: Boolean, default: true }
  },
  data() {
    return {
      disabledCategories: []
    };
  },
  computed: {
    selectedCategories: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      }
    }
  },

  watch: {
    modelValue() {
      if (this.disableCategories) {
        this.disabledCategories = flatMap(
          this.selectedCategories.map(category =>
            category.incompatibleCategories.map(category => category.id)
          )
        );
      }
    }
  },
  methods: {
    isDisabled(item) {
      return (
        this.disabledCategories.includes(item.id) && this.disableCategories
      );
    }
  }
};
</script>
