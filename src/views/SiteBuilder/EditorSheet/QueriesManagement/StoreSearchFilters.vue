<template>
  <div class="o-editor-pages">
    <v-list class="py-0">
      <template v-if="category.slug != 'voyages'">
        <region-field
          v-model="form.regionId"
          hide-details
          variant="solo"
          class="mx-2 mt-3"
          is-filter
          clearable
          :foreign="isForeignCategory"
          @update:modelValue="submitRegion"
          @change="submitRegion"
        ></region-field>
        <template v-if="form && form.regionId">
          <city-field
            v-model="form.cityId"
            hide-details
            variant="solo"
            class="mx-2 mt-3"
            is-filter
            :region-id="form.regionId"
            @update:modelValue="submit"
            @change="submit"
          ></city-field>
        </template>
      </template>
      <template v-if="showDelivery">
        <v-switch
          v-model="form.hasDelivery"
          :label="$t('search.filter.delivery.label')"
          class="mx-2"
          inset
          dense
          hide-details
          @input="submit"
        >
        </v-switch>
      </template>
    </v-list>
  </div>
</template>

<script>
import RegionField from "@ouedkniss/web-ui-plugin/src/components/Field/RegionField";
import CityField from "@ouedkniss/web-ui-plugin/src/components/Field/CityField";

import { mapGetters } from "vuex";
import { some, filter, isArray, cloneDeep, isPlainObject } from "lodash";

export default {
  components: {
    CityField,
    RegionField
  },

  props: {
    category: {
      type: Object,
      required: true
    },
    filter: {
      type: Object,
      required: true
    }
  },

  setup() {
    const regionId = null;
    const cityId = null;
    return { regionId, cityId };
  },

  data() {
    return {
      toggle: {
        regionIds: this.filter.regionId
      },
      form: cloneDeep(this.filter)
    };
  },

  computed: {
    ...mapGetters({ store: "builder/store" }),
    hasFilters() {
      return some(Object.keys(this.filter), k => {
        const v = this.filter[k];
        if (isArray(v)) return filter(v).length > 0;
        if (isPlainObject(v)) return Object.keys(v).length > 0;
        else return !!v;
      });
    },

    isForeignCategory() {
      const noForeignCat = [
        "immobilier",
        "emploi_demandes",
        "emploi_offres",
        "services"
      ];

      return !noForeignCat.includes(this.category.slug);
    },

    showDelivery() {
      return this.category.delivery;
    },

    displayRegionFilter() {
      return !this.form.regionId;
    },

    displayCityFilter() {
      return !this.form.cityId;
    }
  },

  watch: {
    filter: {
      deep: true,
      handler() {
        this.form = cloneDeep(this.filter);
      }
    },

    form: {
      deep: true,
      immediate: true,
      handler() {
        this.$emit("dirty", this.hasFilters);
      }
    }
  },
  methods: {
    hasCategoryParent(categorySlug) {
      return this.category.parentTree != undefined
        ? this.category.parentTree.some(v => v.slug === categorySlug)
        : [];
    },
    submit() {
      this.$emit("submit", this.form);
    },
    submitRegion() {
      this.form.cityId = null;
      this.$emit("submit", this.form);
    }
  }
};
</script>

<style></style>
