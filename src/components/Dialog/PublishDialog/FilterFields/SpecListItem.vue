<template>
  <div v-if="spec">
    <component
      :is="getFilterComponent(spec.specification.type)"
      v-model="specsModel[spec.specification.codename]"
      :label="spec.specification.label"
      :codename="spec.specification.codename"
      :dataset="dataset"
      :required="spec.isRequired"
      :number="spec.specification.type === 'RANGE' ? true : false"
      filled
    ></component>
  </div>
</template>

<script>
import SpecListItem from "./SpecListItem.vue";
import SpecFieldText from "./SpecFieldText";
import SpecFieldRange from "./SpecFieldText";
import SpecFieldCheck from "./SpecFieldCheck";
import SpecFieldSelectSingle from "./SpecFieldSelectSingle";
import SpecFieldSelectMulti from "./SpecFieldSelectMulti";

import Queries from "../Queries.graphql";

const FilterTypeMap = {
  INPUT: SpecFieldText,
  RANGE: SpecFieldRange,
  CHECK: SpecFieldCheck,
  SINGLE: SpecFieldSelectSingle,
  MULTI: SpecFieldSelectMulti
};

export default {
  name: "SpecListItem",

  components: {
    "spec-list-item": SpecListItem
  },
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    category: {
      type: Object,
      default: () => ({})
    },
    spec: {
      type: Object,
      default: () => ({})
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
      fetchPolicy: "network-only",
      query: Queries.DeferDataset,
      skip() {
        if (!this.spec) return;

        const hasInitialData =
          this.initialDataset.length === 0 && !this.spec.specification.codename;

        const dependsOn = this.spec.specification.dependsOn;

        const hasParentValue =
          dependsOn !== null ? !!this.specsModel[dependsOn.codename] : false;

        return hasInitialData || !hasParentValue;
      },
      variables() {
        return {
          codename: this.spec.specification.codename,
          values: this.parentValues,
          tags: this.specWithTags
        };
      }
    }
  },

  computed: {
    initialDataset() {
      return this.spec.specification.datasets;
    },

    hasOther() {
      return this.spec.specification.hasOther;
    },

    dependsOn() {
      return this.spec.specification.dependsOn;
    },

    hasParentValue() {
      return this.dependsOn !== null
        ? !!this.specsModel[this.dependsOn.codename]
        : false;
    },

    dataset() {
      let dataset =
        this.initialDataset.length > 0
          ? this.initialDataset
          : this.deferDataset;
      dataset = this.dependsOn !== null && !this.hasParentValue ? [] : dataset;
      if (this.spec.specification.type === "SINGLE" && this.hasOther)
        dataset.push({ label: "Autre", codename: "other" });
      return dataset;
    },

    parentValues() {
      return this.spec.specification.type === "MULTI"
        ? this.specsModel[this.spec.specification.dependsOn.codename]
        : [this.specsModel[this.spec.specification.dependsOn.codename]];
    },

    specWithTags() {
      return this.category.slug === "automobiles" &&
        this.spec.specification.withTags &&
        this.specsModel["annee"]
        ? this.specsModel["annee"]
        : [];
    },

    specsModel: {
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
      if (this.spec.specification.codename === "annee" && type === "RANGE")
        return FilterTypeMap["SINGLE"];
      return FilterTypeMap[type];
    }
  }
};
</script>

<style></style>
