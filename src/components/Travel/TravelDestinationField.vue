<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="selected"
    :items="destinations.data"
    item-title="name"
    variant="solo-filled"
    :loading="$apollo.queries.destinations.loading"
    return-object
    @update:search="q => (search = q)"
  >
    <template #item="{ item, props }">
      <v-list-item :ref="props.ref" :key="props.key" @click="props.onClick">
        <template #prepend>
          <v-avatar size="25">
            <travel-img :destination="item.raw" />
          </v-avatar>
        </template>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>
<script>
import TravelImg from "./TravelImg.vue";
import DestinationField from "./TravelDestinationField.graphql";
import isEmpty from "lodash/isEmpty";

export default {
  components: { TravelImg },

  props: {
    modelValue: {
      type: [String, Object],
      default: null
    }
  },

  data() {
    return {
      destinations: {
        data: []
      },
      search: ""
    };
  },

  apollo: {
    destinations: {
      query: DestinationField,
      fetchPolicy: "network-only",
      debounce: 1000,
      variables() {
        return {
          search: this.search,
          isAlgeria: this.departure,
          first: 300,
          page: 1
        };
      }
    }
  },
  computed: {
    selected: {
      get() {
        if (isEmpty(this.modelValue)) return null;
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v === null ? v : { ...v });
      }
    }
  }
};
</script>

<style></style>
