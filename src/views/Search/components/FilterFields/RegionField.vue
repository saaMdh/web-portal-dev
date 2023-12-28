<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <v-autocomplete
    ref="select"
    :model-value="modelValue"
    :items="sortedRegions"
    :label="t('label')"
    single-line
    density="comfortable"
    :placeholder="t('label')"
    :loading="$apollo.queries.regions.loading > 0"
    item-title="name"
    item-value="id"
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
    <template #selection="{ index }">
      <span v-if="index == 0" :class="$vuetify.locale.rtl ? 'pl-1' : 'pr-1'"
        >{{ $t("label") }} <b>( {{ modelValue.length }} )</b>
      </span>
    </template>
  </v-autocomplete>
</template>

<script>
import gql from "graphql-tag";
import map from "lodash/map";
import sortBy from "lodash/sortBy";
import without from "lodash/without";
import { useI18n } from "vue-i18n";

export default {
  props: {
    modelValue: {
      type: [Number, String, Object, Array],
      default: null
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

  setup() {
    const { t } = useI18n({
      messages: {
        fr: { label: "Wilaya" },
        ar: { label: "ولاية" },
        en: { label: "State" }
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
        order: r.id in order ? order[r.id] : 99,
        name: r.name + " - " + r.id.padStart(2, "0")
      }));

      return sortBy(regions, "order");
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

<style></style>
