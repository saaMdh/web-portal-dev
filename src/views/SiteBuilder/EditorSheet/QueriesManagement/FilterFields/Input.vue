<template>
  <v-form @submit.prevent="submit">
    <div class="d-flex align-center flex-gap-2 pr-1">
      <div class="flex-grow-1">
        <v-combobox
          ref="el"
          :items="suggestedDataset"
          :model-value="value"
          item-title="label"
          item-value="codename"
          hide-details
          :label="label"
          solo
          flat
          @update:search-input="v => (content = v)"
        ></v-combobox>
      </div>

      <v-btn v-if="isDirty" icon @click="clear">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-btn
        v-if="!!content"
        icon
        type="submit"
        color="primary"
        :input-value="isDirty"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>
  </v-form>
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
      isDirty: false,
      content: this.modelValue,
      suggestedDataset: []
    };
  },

  watch: {
    modelValue(v) {
      this.content = v;
    },

    content(v) {
      if (v) this.isDirty = true;
    }
  },

  methods: {
    clear() {
      this.isDirty = false;
      this.content = "";
      this.suggestedDataset = [];
      this.$refs.el.lazySearch = "";
      this.$emit("update:modelValue", null);
    },

    submit() {
      this.isDirty = false;
      this.suggestedDataset = [];
      this.$emit("update:modelValue", this.content);
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
        return !this.content || this.content.length < 3;
      },
      variables() {
        return {
          codename: this.codename,
          value: this.content
        };
      }
    }
  }
};
</script>
