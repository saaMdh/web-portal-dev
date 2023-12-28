<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="items"
    :items="storeSearch.data"
    :loading="$apollo.queries.storeSearch.loading"
    :search-input="keywords"
    item-value="id"
    item-title="name"
    no-filter
    :multiple="multiple"
    :label="$t('components.fields.announField')"
    @update:search="v => (keywords = v)"
    @change="v => $emit('update:modelValue', v)"
  >
    <template #item="{ item, props }">
      <v-list-item :key="props.key" :ref="props.ref" @click="props.onClick">
        <v-list-item-title>
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </template>

    <template #selection>
      <v-chip></v-chip>
    </template>
  </v-autocomplete>
</template>

<script>
import gql from "graphql-tag";
export default {
  props: {
    modelValue: {
      type: [Object, Number, String, Array],
      default: null
    },
    multiple: {
      type: [Boolean],
      default: false
    }
  },

  data() {
    return {
      storeSearch: {
        data: []
      },
      keywords: "",
      items: this.modelValue
    };
  },
  watch: {
    async keywords() {
      this.$apollo.queries.storeSearch.refetch();
    }
  },

  apollo: {
    storeSearch: {
      fetchPolicy: "cache-and-network",
      debounce: 1000,
      query: gql`
        query StoreField($q: String, $filter: StoreSearchFilterInput) {
          storeSearch(q: $q, filter: $filter) {
            data {
              id
              name
            }
          }
        }
      `,
      skip() {
        return !this.keywords && this.storeSearch.data.length;
      },
      variables() {
        return {
          q: this.keywords,
          filter: {
            page: 1,
            count: 32
          }
        };
      }
    }
  }
};
</script>

<style></style>
