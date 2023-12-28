<template>
  <v-autocomplete
    :model-value="modelValue"
    :items="sortedRegions"
    :label="t('label')"
    :loading="$apollo.queries.regions.loading > 0"
    item-title="name"
    item-value="id"
    clearable
    autocomplete="off"
    @update:model-value="$emit('update:modelValue', $event)"
  ></v-autocomplete>
</template>

<script>
import gql from "graphql-tag";
import map from "lodash/map";
import sortBy from "lodash/sortBy";
import { useI18n } from "vue-i18n";

export default {
  props: {
    modelValue: {
      type: [Number, String, Object, Array],
      default: null
    }
  },

  setup() {
    const { t } = useI18n({
      messages: {
        fr: { label: "Wilaya" },
        ar: { label: "ولاية" },
        en: { label: "Region" }
      }
    });
    return { t };
  },

  data() {
    return {
      regions: []
    };
  },

  computed: {
    sortedRegions() {
      const order = {
        16: 0, // Alger
        9: 1, // Blida
        42: 2, // Tipaza
        35: 3, // Boumerdes
        31: 4 // Oran
      };

      const regions = map(this.regions, r => ({
        ...r,
        order: r.id in order ? order[r.id] : 99
      }));

      return sortBy(regions, "order");
    }
  },

  apollo: {
    regions: {
      query: gql`
        {
          regions: regionList {
            id
            slug
            name
          }
        }
      `
    }
  }
};
</script>

<style></style>
