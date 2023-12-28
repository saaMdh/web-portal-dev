<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <v-autocomplete
    ref="select"
    :model-value="modelValue"
    :items="sortedRegions"
    :label="$t('search.filter.region')"
    single-line
    density="comfortable"
    :placeholder="$t('search.filter.region')"
    :loading="$apollo.queries.regions.loading > 0"
    item-title="name"
    item-value="slug"
    clearable
    variant="solo"
    clear-icon="mdi-trash-can-outline"
    autocomplete="off"
    name="wilaya"
    :menu-props="{
      width: '300'
    }"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #prepend-item>
      <div>
        <v-list-item @click="$refs.select.blur()">
          <div class="d-flex text-primary">
            <span>{{ $t("_.close") }}</span
            ><v-spacer></v-spacer>
            <v-icon class="px-2" color="primary">mdi-close</v-icon>
          </div>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </template>
    <template #selection="{ item, index }">
      <span v-if="modelValue.length == 1">{{ item.title }}</span>
      <span
        v-else-if="index == 0"
        :class="$vuetify.locale.rtl ? 'ps-1' : 'pe-1'"
        >{{ $t("search.filter.region") }} <b>( {{ modelValue.length }} )</b>
      </span>
    </template>
  </v-autocomplete>
</template>

<script>
import gql from "graphql-tag";
import map from "lodash/map";
import sortBy from "lodash/sortBy";
import without from "lodash/without";
import filter from "lodash/filter";

export default {
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    foreign: {
      type: Boolean,
      default: false
    },
    isFilter: {
      type: Boolean,
      default: false
    }
  },
  emits: ["cities", "regions", "update:modelValue"],

  data() {
    return {
      regions: []
    };
  },
  computed: {
    sortedRegions() {
      const order = {
        "alger-16": 0, // Alger
        "blida-9": 1, // Blida
        "tipaza-42": 2, // Tipaza
        "boumerdes-35": 3, // Boumerdes
        "oran-31": 4 // Oran
      };
      const regions = map(this.regions, r => ({
        ...r,
        order: r.slug in order ? order[r.slug] : 99,
        name: r.name + " - " + r.id.padStart(2, "0"),
        onlyName: r.name
      }));
      return sortBy(regions, "order");
    },
    selectedRegionsNames() {
      const regionsFiltred = filter(this.sortedRegions, regions =>
        this.modelValue.includes(regions.slug)
      );
      if (regionsFiltred.length > 1) this.$emit("cities", null);
      return map(regionsFiltred, region => region.onlyName).join(" - ");
    }
  },

  watch: {
    selectedRegionsNames: {
      immediate: true,
      handler() {
        this.$emit("regions", this.selectedRegionsNames);
      }
    }
  },

  methods: {
    remove(item) {
      const newValue = without(this.modelValue, item.id);
      this.$emit("update:modelValue", newValue);
    }
  },

  apollo: {
    regions: {
      query: gql`
        query ($localOnly: Boolean) {
          regions: regionList(localOnly: $localOnly) {
            id
            slug
            name
          }
        }
      `,

      variables() {
        return {
          localOnly: !this.foreign
        };
      }
    }
  }
};
</script>
