<template>
  <v-autocomplete
    v-model="selected"
    :items="agencies.data"
    :label="$t('travel.agencies.form.targetAgencies')"
    :loading="loading > 0"
    variant="outlined"
    clearable
    item-title="name"
    item-value="id"
    multiple
    @update:search="q => (filter.q = q)"
  >
    <template #item="{ item, props }">
      <v-list-item
        :key="props.key"
        :active="selected.includes(item.raw.id)"
        @click="props.onClick"
      >
        <template #prepend>
          <v-avatar size="24">
            <store-img contain :store="item.raw" />
          </v-avatar>
        </template>

        <v-list-item-title style="text-wrap: inherit">{{
          item.raw.name
        }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ formatLocation(item.raw.locations) }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
import uniq from "lodash/uniq";
import gql from "graphql-tag";

export default {
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      loading: 0,
      agencies: { data: [] },
      filter: {
        q: ""
      }
    };
  },
  computed: {
    selected: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      }
    }
  },
  apollo: {
    agencies: {
      loadingKey: "loading",
      debounce: 800,
      query: gql`
        query AgenciesList($q: String, $filter: StoreSearchFilterInput) {
          agencies: storeSearch(q: $q, filter: $filter) {
            data {
              id
              name
              imageUrl
              locations {
                location {
                  region {
                    name
                  }
                }
              }
            }
          }
        }
      `,
      variables() {
        return {
          q: this.filter.q ? this.filter.q : "",
          filter: {
            // NOTE: "voyages" should be refactored as env var
            categorySlug: "voyages",
            count: 32,
            page: 1
          }
        };
      }
    }
  },

  methods: {
    formatLocation(locations) {
      locations = locations
        .map(l => (l.location.region ? l.location.region.name : null))
        .filter(l => !!l);

      return uniq(locations).join(", ");
    }
  }
};
</script>

<style></style>
