<template>
  <div>
    <v-hover v-slot="{ isHovering, props }">
      <div v-bind="props">
        <vv-form v-show="isHovering || isFocused" @submit="submit">
          <div class="d-flex align-center">
            <v-text-field
              v-model.number="min"
              onkeypress="return event.charCode >= 48"
              hide-details
              variant="solo"
              flat
              min="0"
              class="me-1"
              type="number"
              single-line
              density="comfortable"
              :label="$t('_.min')"
              :placeholder="$t('_.min')"
              @keydown="DelayedSubmit"
              @update:model-value="DelayedSubmit"
              @focus="focus"
              @click="focus"
              @blur="blur"
            ></v-text-field
            ><v-text-field
              v-model.number="max"
              onkeypress="return event.charCode >= 48"
              hide-details
              variant="solo"
              flat
              type="number"
              single-line
              density="comfortable"
              :label="$t('_.max')"
              :placeholder="$t('_.max')"
              @update:model-value="DelayedSubmit"
              @keydown="DelayedSubmit"
              @focus="focus"
              @click="focus"
              @blur="blur"
            ></v-text-field>
            <div class="d-flex flex-gap-2 px-2">
              <v-btn :aria-label="$t('_.clear')" icon @click="clear">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </div>
          </div>
          <template v-if="priceUnitList.length > 1">
            <v-divider class="mx-2"></v-divider>

            <div class="d-flex align-center">
              <v-select
                ref="select"
                v-model="unit"
                :items="priceUnitList"
                hide-details
                variant="solo"
                flat
                density="comfortable"
                single-line
                :menu-props="{
                  width: '300'
                }"
                :label="$t('search.filter.priceUnit')"
                @click="focus"
                @blur="blur"
                @change="submit"
              ></v-select>
            </div>
          </template>
        </vv-form>

        <div v-show="!isFocused && !isHovering">
          <div
            class="d-flex justify-space-between py-3 px-4 text-grey-darken-1"
          >
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
  </div>
</template>
<script>
export default {
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

  data() {
    return {
      min: null,
      max: null,
      unit: null,
      isFocused: false
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

      this.$emit("update:modelValue", {
        min: this.min,
        max: this.max,
        unit: this.unit
      });
    },
    DelayedSubmit() {
      setTimeout(this.submit, 50);
    }
  }
};
</script>
