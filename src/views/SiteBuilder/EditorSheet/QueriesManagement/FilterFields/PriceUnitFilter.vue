<template>
  <v-hover v-slot="{ isHovering, props }">
    <div v-bind="props">
      <v-form v-show="isHovering || isFocused" @submit.prevent="submit">
        <v-row>
          <v-col class="py-0" md="8" cols="8"
            ><v-row dense>
              <v-col
                ><v-text-field
                  v-model.number="min"
                  onkeypress="return event.charCode >= 48"
                  hide-details
                  solo
                  flat
                  min="0"
                  type="number"
                  single-line
                  :label="t('min')"
                  @focus="focus"
                  @blur="blur"
                ></v-text-field
              ></v-col>

              <v-col
                ><v-text-field
                  v-model.number="max"
                  onkeypress="return event.charCode >= 48"
                  hide-details
                  solo
                  flat
                  type="number"
                  single-line
                  :label="t('max')"
                  @focus="focus"
                  @blur="blur"
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row class="d-flex align-center justify-center mx-0" dense>
              <v-select
                v-model="unit"
                :items="priceUnitList"
                hide-details
                solo
                flat
                ronded
                :label="$t('search.filter.priceUnit')"
                @click="focus"
                @blur="blur"
              ></v-select>
            </v-row>
            <v-row>
              <v-col>
                <check
                  v-model="hasPrice"
                  :label="$t('search.filter.hasPrice')"
                  @update:modelValue="submit"
                >
                </check>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            class="d-flex align-center justify-content px-0"
            md="4"
            cols="4"
          >
            <div class="d-flex flex-gap-2">
              <v-btn icon @click="clear">
                <v-icon>mdi-close</v-icon>
              </v-btn>

              <v-btn
                class="justify-center mb-2"
                icon
                type="submit"
                color="primary"
              >
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>

      <div v-show="!isFocused && !isHovering">
        <div class="d-flex justify-space-between py-3 px-3 text-grey-darken-1">
          <div>
            {{ label }}
            <span v-if="formated">[{{ formated }}] </span>
            <span v-if="!!unit">
              {{ $t(`announcement.priceUnit.${unit}`) }}
            </span>
            <!-- Add a formatting for the price unit -->
          </div>
          <v-icon>mdi-filter</v-icon>
        </div>
      </div>
    </div>
  </v-hover>
</template>
<script>
import { useI18n } from "vue-i18n";
import Check from "./Check.vue";

export default {
  components: {
    Check
  },
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      default: null
    },
    priceUnitList: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const { t } = useI18n({
      messages: {
        fr: {
          min: "Min",
          max: "Max"
        },
        ar: {
          min: "الأدنى",
          max: "الأقصى"
        },
        en: {
          min: "Min",
          max: "Max"
        }
      }
    });
    return { t };
  },

  data() {
    return {
      min: null,
      max: null,
      unit: null,
      isFocused: false,
      hasPrice: null
    };
  },

  computed: {
    formated() {
      const min = this.modelValue.min;
      const max = this.modelValue.max;

      if (min && !max) return `> ${min}`;
      if (!min && max) return `< ${max}`;
      if (min && max) return `${min} - ${max}`;

      return null;
    },
    initialUnit() {
      return this.priceUnitList.length > 0 ? this.priceUnitList[0].value : null;
    }
  },

  watch: {
    modelValue: {
      immediate: true,
      handler: "parse"
    }
  },

  methods: {
    parse(value) {
      if (!value) {
        this.min = this.max = null;
        this.unit = this.initialUnit;
        return;
      }

      this.min = value.min || null;
      this.max = value.max || null;
      this.unit = value.unit ? value.unit : this.initialUnit;
    },
    clear() {
      this.min = null;
      this.max = null;
      this.unit = this.initialUnit;
      this.hasPrice = null;
      this.$emit("update:modelValue", {});
    },

    focus() {
      this.isFocused = true;
    },

    blur() {
      this.isFocused = false;
    },

    submit() {
      if (this.min === "") this.min = null;
      if (this.max === "") this.max = null;
      if (this.unit === "") this.unit = null;

      if (this.min !== null || this.max !== null) {
        this.hasPrice = "true";
      }
      this.$emit("update:modelValue", {
        min: this.min,
        max: this.max,
        unit: this.unit,
        hasPrice: this.hasPrice
      });
    }
  }
};
</script>
