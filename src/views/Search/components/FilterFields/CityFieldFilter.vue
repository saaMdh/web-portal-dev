<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <v-autocomplete
    ref="select"
    :model-value="modelValue"
    :items="cities"
    :label="$t('search.filter.city')"
    :placeholder="$t('search.filter.city')"
    single-line
    density="comfortable"
    :loading="$apollo.queries.cities.loading > 0"
    item-title="name"
    item-value="slug"
    clearable
    variant="solo"
    clear-icon="mdi-trash-can-outline"
    autocomplete="off"
    name="commune"
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
        :class="$vuetify.locale.rtl ? 'pl-1' : 'pr-1'"
        >{{ $t("search.filter.city") }} <b>( {{ modelValue.length }} )</b>
      </span>
    </template></v-autocomplete
  >
</template>

<script>
import gql from "graphql-tag";
import filter from "lodash/filter";
import map from "lodash/map";
import without from "lodash/without";

export default {
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    regionId: {
      type: [Number, String],
      default: null
    },
    isFilter: {
      type: Boolean,
      default: false
    }
  },
  emits: ["input", "cities", "update:modelValue"],

  data() {
    return {
      cities: []
    };
  },
  computed: {
    selectedCitiesNames() {
      const citiesFiltred = filter(this.cities, city =>
        this.modelValue.includes(city.slug)
      );
      return map(citiesFiltred, city => city.name).join(" - ");
    }
  },

  watch: {
    selectedCitiesNames: {
      immediate: true,
      handler() {
        this.$emit("cities", this.selectedCitiesNames);
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
    cities: {
      query: gql`
        query CityList($id: ID!) {
          cities: cityList(regionId: $id) {
            id
            slug
            name
          }
        }
      `,
      variables() {
        return {
          id: this.regionId.split("-").pop()
        };
      },
      skip() {
        return !this.regionId;
      }
    }
  }
};
</script>

<style scoped></style>
