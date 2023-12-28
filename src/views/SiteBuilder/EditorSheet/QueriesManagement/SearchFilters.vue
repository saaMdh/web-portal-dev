<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <v-list class="py-0">
    <!-- Wilaya -->
    <template v-if="category?.slug != 'voyages'">
      <region-field-filter
        v-if="displayRegionFilter"
        v-model="form.regionIds"
        class="mx-2 mt-3"
        multiple
        hide-details
        variant="solo"
        is-filter
        :foreign="isForeignCategory"
        @update:modelValue="submitRegion"
        @change="submitRegion"
        @regions="v => $emit('regions', v)"
        @cities="v => $emit('cities', v)"
      ></region-field-filter>
      <region-field
        v-else
        v-model="form.regionIds"
        class="mx-2 mt-3"
        multiple
        hide-details
        variant="solo"
        is-filter
        :foreign="isForeignCategory"
        @update:modelValue="submitRegion"
        @change="submitRegion"
      />
      <template v-if="form.regionIds.length == 1">
        <city-field-filter
          v-if="displayCityFilter"
          v-model="form.cityIds"
          class="mx-2 mt-3"
          multiple
          hide-details
          variant="solo"
          is-filter
          :region-id="form.regionIds[0]"
          @update:modelValue="submit"
          @change="submit"
          @cities="v => $emit('cities', v)"
        />
        <city-field
          v-else
          v-model="form.cityIds"
          class="mx-2 mt-3"
          multiple
          hide-details
          variant="solo"
          is-filter
          :region-id="form.regionIds[0]"
          @update:modelValue="submit"
          @change="submit"
        />
      </template>
    </template>
    <template v-if="!noCategory">
      <!-- Price -->
      <price-unit-filter
        v-model="priceUnit"
        :price-unit-list="priceUnitList"
        :label="$t('search.filter.price')"
        :placeholder="$t('search.filter.price')"
        class="mx-2 mt-3"
        @update:modelValue="v => submitPrice(v)"
      >
      </price-unit-filter>

      <!-- Has Price -->
      <check
        v-model="form.hasPrice"
        :label="$t('search.filter.hasPrice')"
        @update:modelValue="submit"
      >
      </check>
      <!-- Accept exchange -->
      <template v-if="categoryHasExchange">
        <check
          v-model="form.exchange"
          :label="$t('search.filter.hasExchange')"
          @update:modelValue="submit"
        >
        </check>
      </template>

      <template
        v-for="item in categorySpecification"
        :key="item.specification.codename"
      >
        <spec-list-item
          v-model="form.model[item.specification.codename]"
          :specs-model="form.model"
          :spec="item.specification"
          :toggle="toggle[item.specification.codename]"
          @update:modelValue="
            checkAndResetEntries(
              item.specification.allSubSpecificationCodenames
            )
          "
          @submit="submit"
        ></spec-list-item>
      </template>

      <!-- Has pictures -->

      <check
        v-model="form.hasPictures"
        :label="$t('search.filter.pictures')"
        @update:modelValue="submit"
      >
      </check>

      <!-- Origin -->
      <template v-if="category.slug != 'voyages'">
        <v-select
          v-if="!store"
          ref="select-origin"
          v-model="form.origin"
          :items="originList"
          :label="$t('search.filter.origin.label')"
          :placeholder="$t('search.filter.origin.label')"
          :menu-props="{
            closeOnClick: true,
            'content-class': $vuetify.locale.rtl
              ? 'filter-overlay-rtl'
              : 'filter-overlay-ltr'
          }"
          hide-details
          solo
          flat
          clearable
          clear-icon="mdi-trash-can-outline"
          @update:model-value="submit"
        >
          <template #prepend-item>
            <div>
              <v-list-item @click="$refs['select-origin'].blur()">
                <div class="d-flex text-primary">
                  <span>{{ $t("_.close") }}</span
                  ><v-spacer></v-spacer>
                  <v-icon class="px-2" color="primary">mdi-close</v-icon>
                </div>
              </v-list-item>
            </div>
          </template>
        </v-select>
      </template>

      <!-- Delivery -->
      <template v-if="showDelivery">
        <v-select
          v-model="form.delivery"
          :items="deliveryList"
          :label="$t('search.filter.delivery.label')"
          :menu-props="{ offsetY: true }"
          hide-details
          solo
          flat
          clearable
          @update:model-value="submit"
        ></v-select
      ></template>
    </template>
  </v-list>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import filter from "lodash/filter";
import forEach from "lodash/forEach";
import isArray from "lodash/isArray";
import isInteger from "lodash/isInteger";
import isPlainObject from "lodash/isPlainObject";
import some from "lodash/some";
import startsWith from "lodash/startsWith";
import SpecListItem from "@/views/Search/components/FilterFields/SpecListItem.vue";
import Check from "@/views/Search/components/FilterFields/Check.vue";
import PriceUnitFilter from "@/views/Search/components/FilterFields/PriceUnitFilter.vue";

import RegionField from "@/views/Search/components/FilterFields/RegionField.vue";
import CityField from "@/views/Search/components/FilterFields/CityField.vue";
import RegionFieldFilter from "@/views/Search/components/FilterFields/RegionFieldFilter.vue";
import CityFieldFilter from "@/views/Search/components/FilterFields/CityFieldFilter.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    SpecListItem,
    CityField,
    CityFieldFilter,
    RegionField,
    RegionFieldFilter,
    Check,
    PriceUnitFilter
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
  emits: ["submit", "cities", "dirty", "regions"],
  data() {
    return {
      priceUnit: {
        min: this.filter.priceRange[0] ? this.filter.priceRange[0] : null,
        max: this.filter.priceRange[1] ? this.filter.priceRange[1] : null,
        unit: this.filter.priceUnit
      },

      toggle: {
        priceRange: filter(this.filter.priceRange).length > 0,
        regionIds: this.filter.regionIds.length > 0,
        origin: !!this.filter.origin,
        delivery: !!this.filter.delivery
      },

      originList: [
        {
          title: this.$t("search.filter.origin.types.STORE"),
          value: "STORE"
        },
        {
          title: this.$t("search.filter.origin.types.INDIVIDUAL"),
          value: "INDIVIDUAL"
        }
      ],

      deliveryList: [
        {
          title: this.$t(
            "search.filter.delivery.types.DELIVERY_PAY_ON_DELIVERY"
          ),
          value: "DELIVERY_PAY_ON_DELIVERY"
        },
        {
          title: this.$t("search.filter.delivery.types.DELIVERY_FREE"),
          value: "DELIVERY_FREE"
        },
        {
          title: this.$t("search.filter.delivery.types.DELIVERY_AVAILABLE"),
          value: "DELIVERY_AVAILABLE"
        }
      ],

      form: cloneDeep(this.filter),
      specsModel: {}
    };
  },

  computed: {
    ...mapGetters({ store: "builder/store" }),
    priceUnitList() {
      return this.category.priceUnits != undefined
        ? this.category.priceUnits
            .filter(v => v !== "UNIT_PER_SQUARE" && v !== "MILLION_PER_SQUARE")
            .map(v => ({
              text: this.$t(`announcement.priceUnit.${v}`),
              value: v
            }))
            .sort((a, b) => a.text[0].localeCompare(b.text[0]))
        : [];
    },
    hasFilters() {
      return some(Object.keys(this.filter), k => {
        const v = this.filter[k];
        if (isArray(v)) return filter(v).length > 0;
        if (isPlainObject(v)) return Object.keys(v).length > 0;
        else return !!v;
      });
    },
    noCategory() {
      return Object.keys(this.category).length == 0;
    },
    isForeignCategory() {
      const noForeignCat = [
        "immobilier",
        "emploi_demandes",
        "emploi_offres",
        "services"
      ];

      return this.category && !noForeignCat.includes(this.category.slug);
    },

    categoryHasExchange() {
      const CATEGORIES_WITHOUT_EXCHANGE = [
        "emploi_demandes",
        "emploi_offres",
        "services",
        "voyages"
      ];
      return !CATEGORIES_WITHOUT_EXCHANGE.includes(this.category.slug);
    },

    categorySpecification() {
      return this.category.specifications != undefined
        ? this.category.specifications.filter(cs => {
            return !(
              startsWith(cs.specification.codename, "other_") ||
              cs.specification.class === "INPUT"
            );
          })
        : [];
    },

    showDelivery() {
      return this.category.delivery;
    },

    displayRegionFilter() {
      return (
        this.form.regionIds.length === 0 ||
        (this.form.regionIds.length > 0 &&
          !isInteger(parseInt(this.form.regionIds[0])))
      );
    },

    displayCityFilter() {
      return (
        this.form.cityIds.length === 0 ||
        (this.form.cityIds.length > 0 &&
          !isInteger(parseInt(this.form.cityIds[0])))
      );
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
      this.form.cityIds = [];
      this.$emit("submit", this.form);
    },
    checkAndResetEntries(children) {
      forEach(children, codename => {
        if (this.form.model[codename]) this.form.model[codename] = null;
      });
    },
    submitPrice(v) {
      this.form.priceUnit = v.unit;
      this.form.priceRange = [v.min, v.max];
      this.form.hasPrice = v.hasPrice;

      this.$emit("submit", this.form);
    }
  }
};
</script>
<style lang="scss">
.v-theme--dark.v-navigation-drawer {
  background: #1e1e1e !important;
}
</style>
