<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <div>
    <v-toolbar class="d-flex justify-space-around" color="transparent">
      <v-toolbar-title class="text-start">{{
        $t("search.filter.title")
      }}</v-toolbar-title>
      <v-btn :aria-label="$t('_.validate')" icon @click="submit"
        ><v-icon v-if="!dirty">mdi-close</v-icon
        ><v-icon v-else :color="submitButtonClass">mdi-check</v-icon></v-btn
      >
    </v-toolbar>

    <v-list class="transparent">
      <!-- Wilaya -->
      <template v-if="category.slug != 'voyages'">
        <region-field-filter
          v-if="displayRegionFilter"
          v-model="form.regionIds"
          multiple
          hide-details
          solo
          flat
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
          multiple
          hide-details
          solo
          flat
          is-filter
          :foreign="isForeignCategory"
          @update:modelValue="submitRegion"
          @change="submitRegion"
        />
        <template v-if="form.regionIds.length == 1">
          <v-divider />
          <city-field-filter
            v-if="displayCityFilter"
            v-model="form.cityIds"
            multiple
            hide-details
            solo
            flat
            is-filter
            :region-id="form.regionIds[0]"
            @cities="v => $emit('cities', v)"
          />
          <city-field
            v-else
            v-model="form.cityIds"
            multiple
            hide-details
            solo
            flat
            is-filter
            :region-id="form.regionIds[0]"
          />
        </template>
        <v-divider></v-divider>
      </template>

      <!-- Price -->
      <price-unit-filter
        v-model="priceUnit"
        :price-unit-list="priceUnitList"
        :label="$t('search.filter.price')"
        :placeholder="$t('search.filter.price')"
        @update:modelValue="v => submitPrice(v)"
      >
      </price-unit-filter>

      <v-divider></v-divider>
      <!-- Has Price -->
      <check v-model="form.hasPrice" :label="$t('search.filter.hasPrice')">
      </check>
      <!-- Accept exchange -->
      <template v-if="categoryHasExchange">
        <v-divider></v-divider>
        <check v-model="form.exchange" :label="$t('search.filter.hasExchange')">
        </check>
      </template>
      <v-divider></v-divider>
      <template
        v-for="item in categorySpecification"
        :key="item.specification.codename"
      >
        <spec-list-item
          v-model="form.model[item.specification.codename]"
          :specs-model="form.model"
          :spec="item.specification"
          @update:modelValue="
            checkAndResetEntries(
              item.specification.allSubSpecificationCodenames
            )
          "
        ></spec-list-item>
      </template>

      <!-- Has pictures -->
      <check v-model="form.hasPictures" :label="$t('search.filter.pictures')">
      </check>

      <!-- Origin -->
      <template v-if="category.slug != 'voyages'">
        <v-divider></v-divider>

        <v-select
          ref="select-origin"
          v-model="form.origin"
          :items="originList"
          :label="$t('search.filter.origin.label')"
          :placeholder="$t('search.filter.origin.label')"
          :menu-props="{
            width: '300'
          }"
          hide-details
          single-line
          density="comfortable"
          variant="solo"
          flat
          clearable
          clear-icon="mdi-trash-can-outline"
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
              <v-divider></v-divider>
            </div>
          </template>
        </v-select>
      </template>

      <!-- Delivery -->
      <template v-if="showDelivery">
        <v-divider></v-divider>
        <check
          v-model="hasDelivery"
          :label="$t('search.filter.delivery.label')"
        >
        </check
      ></template>
    </v-list>

    <div class="py-4 d-flex justify-center">
      <v-btn
        :aria-label="$t('search.filter.filter')"
        class="rounded-xl"
        :color="submitButtonClass"
        variant="elevated"
        style="width: 90%"
        @click="submit"
      >
        {{ $t("search.filter.filter") }}
      </v-btn>
    </div>
  </div>
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
import SpecListItem from "./FilterFields/SpecListItem.vue";
import Check from "./FilterFields/Check.vue";
import PriceUnitFilter from "./FilterFields/PriceUnitFilter.vue";

import RegionField from "./FilterFields/RegionField.vue";
import CityField from "./FilterFields/CityField.vue";
import RegionFieldFilter from "./FilterFields/RegionFieldFilter.vue";
import CityFieldFilter from "./FilterFields/CityFieldFilter.vue";

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
  emits: ["submit", "close", "cities", "dirty", "regions"],
  data() {
    return {
      submitButtonClass: "primary",
      blinkInterval: null,
      blinkCount: 0,
      hasDelivery: "false",
      dirty: false,
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
    priceUnitList() {
      return this.category.priceUnits != undefined
        ? this.category.priceUnits
            .filter(v => v !== "UNIT_PER_SQUARE" && v !== "MILLION_PER_SQUARE")
            .map(v => ({
              title: this.$t(`announcement.priceUnit.${v}`),
              value: v
            }))
            .sort((a, b) => a.title[0].localeCompare(b.title[0]))
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
    isForeignCategory() {
      const noForeignCat = [
        "immobilier",
        "emploi_demandes",
        "emploi_offres",
        "services"
      ];
      return !noForeignCat.includes(this.category.slug);
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
      immediate: false,
      handler() {
        if (this.deepEqual(this.filter, this.form)) {
          this.dirty = false;
          this.unBlink();
        } else {
          this.dirty = true;
          this.blink();
        }
      }
    },
    hasDelivery: {
      deep: true,
      immediate: true,
      handler() {
        if (this.hasDelivery === "true") {
          this.form.delivery = "DELIVERY_AVAILABLE";
        } else {
          this.form.delivery = null;
        }
      }
    }
  },
  beforeUnmount() {
    clearInterval(this.blinkInterval);
  },
  methods: {
    deepEqual(object1, object2) {
      const keys2 = Object.keys(object2);
      for (const key of keys2) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = this.isObject(val1) && this.isObject(val2);
        if (
          (val1 || val2) &&
          ((areObjects && !this.deepEqual(val1, val2)) ||
            (!areObjects && val1 != val2))
        ) {
          return false;
        }
      }

      return true;
    },

    isObject(object) {
      return object != null && typeof object === "object";
    },
    hasCategoryParent(categorySlug) {
      return this.category.parentTree != undefined
        ? this.category.parentTree.some(v => v.slug === categorySlug)
        : [];
    },
    submit() {
      if (this.dirty) this.$emit("submit", this.form);
      else this.$emit("close");
    },
    blink() {
      clearInterval(this.blinkInterval);
      this.blinkCount = 0;
      this.blinkInterval = setInterval(this.doBlink, 500);
    },
    unBlink() {
      clearInterval(this.blinkInterval);
      this.submitButtonClass = "primary";
    },
    doBlink() {
      if (this.blinkCount > 5) {
        this.submitButtonClass = "primary";
        clearInterval(this.blinkInterval);
      } else {
        if (this.submitButtonClass == "green-darken-1")
          this.submitButtonClass = "primary";
        else this.submitButtonClass = "green-darken-1";
        this.blinkCount++;
      }
    },
    submitRegion() {
      this.form.cityIds = [];
    },
    checkAndResetEntries(children) {
      forEach(children, codename => {
        if (this.form.model[codename]) this.form.model[codename] = null;
      });
    },
    submitPrice(v) {
      this.form.priceUnit = v.unit;
      this.form.priceRange = [v.min, v.max];
    }
  }
};
</script>
