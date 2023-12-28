<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="selected"
    :items="destinations.data"
    item-title="name"
    variant="solo-filled"
    :loading="$apollo.queries.destinations.loading"
    return-object
  >
    <template #item="{ item, props }">
      <v-list-item :ref="props.ref" :key="props.key" @click="props.onClick">
        <template #prepend>
          <v-avatar>
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
      }
    };
  },

  apollo: {
    destinations: {
      query: DestinationField,
      fetchPolicy: "network-only",
      debounce: 500,
      variables() {
        return {
          isAlgeria: true,
          first: 60,
          page: 1
        };
      }
    }
  },
  computed: {
    selected: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", { ...v });
      }
    }
  }
};
</script>

<style></style>
