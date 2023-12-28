<template>
  <v-autocomplete
    :model-value="modelValue"
    :items="cities"
    :label="t('label')"
    :placeholder="t('label')"
    :loading="$apollo.queries.cities.loading > 0"
    item-title="name"
    item-value="id"
    clearable
    autocomplete="off"
    @update:model-value="$emit('update:modelValue', $event)"
  ></v-autocomplete>
</template>

<script>
import gql from "graphql-tag";
import { useI18n } from "vue-i18n";
export default {
  props: {
    modelValue: {
      type: [Number, String, Object, Array],
      default: null
    },
    regionId: {
      type: [Number, String],
      required: true
    }
  },

  setup() {
    const { t } = useI18n({
      messages: {
        fr: { label: "Commune" },
        ar: {
          label: "البلدية"
        },
        en: {
          label: "City"
        }
      }
    });
    return {
      t
    };
  },

  data() {
    return {
      cities: []
    };
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
          id: this.regionId
        };
      },
      skip() {
        return !this.regionId;
      }
    }
  }
};
</script>

<style></style>
