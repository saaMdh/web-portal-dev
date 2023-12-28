<template>
  <vv-field v-slot="{ field, errors }" :rules="required ? 'required' : ''">
    <v-combobox
      v-bind="field"
      :model-value="modelValue"
      :items="suggestedDataset"
      item-title="label"
      item-value="codename"
      :search-input="input"
      :label="label"
      :error-messages="errors"
      :type="number ? 'number' : 'string'"
      dense
      clearable
      filled
      @update:model-value="submit"
    ></v-combobox>
  </vv-field>
</template>

<script>
import gql from "graphql-tag";

export default {
  props: {
    dataset: {
      type: Array,
      default: () => []
    },
    label: {
      type: String
    },

    number: {
      type: Boolean,
      default: false
    },

    modelValue: [Number, String, Object, Array],

    codename: {
      type: String
    },
    required: Boolean
  },

  data() {
    return {
      input: null,
      suggestedDataset: []
    };
  },

  watch: {
    input() {
      if (this.suggestedDataset.length > 0) return;
      if (this.isLoading) return;
      this.isLoading = true;
    }
  },

  methods: {
    submit(value) {
      if (value && value.label) {
        this.$emit("update:modelValue", value.label);
      } else {
        this.$emit("update:modelValue", value);
      }
    }
  },

  apollo: {
    suggestedDataset: {
      debounce: 400,
      query: gql`
        query($codename: String!, $value: String!) {
          suggestedDataset: specificationDataSetSuggestion(
            codename: $codename
            value: $value
          ) {
            label
            codename
          }
        }
      `,
      skip() {
        return !this.modelValue || this.modelValue.length < 3;
      },
      variables() {
        return {
          codename: this.codename,
          value: this.modelValue
        };
      }
    }
  }
};
</script>
