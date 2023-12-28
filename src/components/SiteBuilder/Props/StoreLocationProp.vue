<template>
  <v-select
    solo
    flat
    hide-details
    clearable
    :items="locations"
    :loading="!!loading"
    item-value="id"
    return-object
    :model-value="modelValue"
    :label="label && $t(label)"
    @update:modelValue="v => $emit('update:modelValue', v)"
  >
    <template #item="{ item, props }">
      <v-list-item
        :key="props.key"
        :ref="props.ref"
        density="compact"
        class="pa-0 ma-0"
        @click="props.onClick"
      >
        <v-list-item-title>
          {{ item.value.location.address }}
        </v-list-item-title>
      </v-list-item>
    </template>

    <template #selection="{ item }">
      <v-list-item density="compact" class="pa-0 ma-0">
        <v-list-item-title>
          {{ item.value.location.address }}
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-select>
</template>

<script>
import { mapGetters } from "vuex";
import get from "lodash/get";
import gql from "graphql-tag";

export default {
  props: {
    modelValue: {
      type: Object,
      default: null
    },
    label: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: 0,
      locations: []
    };
  },

  computed: {
    ...mapGetters({ store: "builder/store" })
  },
  apollo: {
    locations: {
      loadingKey: "loading",
      query: gql`
        query ($id: ID!) {
          storeGet(id: $id) {
            locations {
              id
              worktime
              phones
              emails
              socials {
                name
                url
              }
              location {
                id
                address
                lat
                lng
              }
            }
          }
        }
      `,
      fetchPolicy: "no-cache",
      variables() {
        return { id: this.store.id };
      },
      skip() {
        return !this.store;
      },
      /* result({ data }) {
        const locations = get(data, "storeGet.locations");
        if (locations) {
          this.locations = locations;
        }
      }, */
      update(data) {
        return get(data, "storeGet.locations");
      }
    }
  }
};
</script>

<style></style>
