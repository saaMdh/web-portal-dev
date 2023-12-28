<template>
  <div v-if="display">
    <component
      :is="getFilterComponent(spec.type)"
      v-model="filterValue"
      :label="spec.label"
      :codename="spec.codename"
      :dataset="dataset"
      @update:modelValue="$emit('submit')"
    ></component>

    <v-divider></v-divider>
  </div>
</template>

<script>
import MultiFilter from "./Multi";
import RangeFilter from "./Range";
import RangeSelectFilter from "./RangeSelect";
import SingleFilter from "./Single";
import InputFilter from "./Input";
import CheckFilter from "./Check";

import compact from "lodash/compact";
import gql from "graphql-tag";

const FilterTypeMap = {
  MULTI: MultiFilter,
  MULTI_MANY: MultiFilter,
  RANGE: RangeFilter,
  RANGE_SELECT: RangeSelectFilter,
  SINGLE: SingleFilter,
  INPUT: InputFilter,
  CHECK: CheckFilter
};

export default {
  props: {
    spec: {
      type: Object,
      required: true
    },
    specsModel: {
      type: Object,
      default: () => ({})
    },
    toggle: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: [String, Number, Boolean, Array],
      default: null
    }
  },

  data() {
    return {
      deferDataset: []
    };
  },

  apollo: {
    deferDataset: {
      debounce: 400,
      query: gql`
        query($codename: String!, $values: [String!]!) {
          deferDataset: specificationDataSetGet(
            codename: $codename
            values: $values
          ) {
            codename
            label
          }
        }
      `,
      skip() {
        if (!this.spec) return;

        const hasInitialData =
          this.initialDataset.length === 0 && !this.spec.codename;

        const dependsOn = this.spec.dependsOn;

        const hasParentValue =
          dependsOn !== null ? !!this.specsModel[dependsOn.codename] : false;

        return hasInitialData || !hasParentValue;
      },
      variables() {
        return {
          codename: this.spec.codename,
          values: this.parentValues
        };
      }
    }
  },

  computed: {
    display() {
      if (this.spec.dependsOn === null) return true;
      const compactParentValues = compact(this.parentValues);
      return this.initialDataset.length === 0 && compactParentValues.length > 0;
    },
    initialDataset() {
      return this.spec.datasets;
    },
    dataset() {
      if (this.initialDataset.length > 0) return this.initialDataset;
      else return this.deferDataset;
    },
    parentValues() {
      return this.spec.type === "MULTI"
        ? this.specsModel[this.spec.dependsOn.codename]
        : [this.specsModel[this.spec.dependsOn.codename]];
    },
    filterValue: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      }
    }
  },

  methods: {
    getFilterComponent(type) {
      return FilterTypeMap[type];
    }
  }
};
</script>

<style></style>
