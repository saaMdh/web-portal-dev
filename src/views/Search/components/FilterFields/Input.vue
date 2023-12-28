<template>
  <v-combobox
    ref="combo"
    :items="suggestedDataset"
    :model-value="value"
    item-title="label"
    item-value="codename"
    hide-details
    :label="label"
    single-line
    density="comfortable"
    :placeholder="label"
    variant="solo"
    flat
    clearable
    :menu-props="{
      width: '300'
    }"
    clear-icon="mdi-trash-can-outline"
    @update:model-value="v => update(v)"
    @click:clear="update(null)"
  >
  </v-combobox>
</template>

<script>
import gql from "graphql-tag";
export default {
  props: {
    label: String,
    modelValue: [String, Number],
    codename: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      value: this.modelValue,
      key: 0,
      suggestedDataset: []
    };
  },
  mounted() {
    this.loadDataSet();
  },
  methods: {
    update(v) {
      if (v != null && typeof v === "object") this.value = v.label;
      else this.value = v;
      this.loadDataSet();
      this.$emit("update:modelValue", this.value);
    },
    async loadDataSet() {
      this.key++;
      let key = this.key;
      if (this.value && this.value.length >= 1) {
        const { data } = await this.$apollo.query({
          fetchPolicy: "network-only",
          query: gql`
            query ($codename: String!, $value: String!) {
              suggestedDataset: specificationDataSetSuggestion(
                codename: $codename
                value: $value
              ) {
                label
                codename
              }
            }
          `,
          variables: {
            codename: this.codename,
            value: this.value
          }
        });
        if (key == this.key) this.suggestedDataset = data.suggestedDataset;
      } else {
        this.suggestedDataset = [];
      }
    }
  }
};
</script>
