<template>
  <v-autocomplete
    v-bind="$attrs"
    :model-value="modelValue"
    :items="search.announcements.data"
    :loading="$apollo.queries.search.loading"
    :search-input="keywords"
    item-value="id"
    no-filter
    :multiple="multiple"
    :label="$t('components.fields.announField')"
    @change="v => $emit('update:modelValue', v)"
  >
    <template #item="{ item, props }">
      <v-list-item :key="props.key" :ref="props.ref" @click="props.onClick">
        <v-list-item-title>
          {{ item.title }}
        </v-list-item-title>
        <v-list-item-subtitle v-if="item.value.refreshedAt">
          {{ formatDateTime(item.value.refreshedAt) }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>

    <template #selection="{ item }">
      {{ item.title }}
    </template>
  </v-autocomplete>
</template>

<script>
import gql from "graphql-tag";
export default {
  props: {
    storeId: {
      type: [Number, String],
      required: true
    },
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
      search: {
        announcements: {
          data: []
        }
      },
      keywords: ""
    };
  },

  apollo: {
    search: {
      debounce: 400,
      fetchPolicy: "cache-and-network",
      query: gql`
        query AnnounField($q: String, $storeId: ID!) {
          search(q: $q, filter: { storeId: $storeId, page: 1, count: 32 }) {
            announcements {
              data {
                id
                title
                refreshedAt
              }
            }
          }
        }
      `,
      skip() {
        return !this.keywords && this.search.announcements.data.length;
      },
      variables() {
        return {
          q: this.keywords,
          storeId: this.storeId
        };
      }
    }
  }
};
</script>

<style></style>
