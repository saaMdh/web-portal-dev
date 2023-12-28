<template>
  <v-hover v-slot="{ isHovering, props }">
    <div v-bind="props">
      <v-form v-show="isHovering" @submit.prevent="submit">
        <div class="d-flex align-center">
          <v-text-field
            v-model.number="min"
            hide-details
            solo
            flat
            min="0"
            type="number"
            single-line
            :label="t('min')"
          ></v-text-field>

          <v-text-field
            v-model.number="max"
            hide-details
            solo
            flat
            type="number"
            single-line
            :label="t('max')"
          ></v-text-field>

          <div class="d-flex flex-gap-2 pr-2">
            <v-btn v-if="isDirty" icon @click="clear">
              <v-icon>mdi-close</v-icon>
            </v-btn>

            <v-btn icon type="submit" color="primary" :input-value="isDirty">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </div>
        </div>
      </v-form>

      <div v-show="!isHovering">
        <div class="d-flex justify-space-between py-3 px-3 text-grey-darken-1">
          <div>
            {{ label }}
            <span v-if="formated">[{{ formated }}]</span>
          </div>
          <v-icon>mdi-filter</v-icon>
        </div>
      </div>
    </div>
  </v-hover>
</template>

<script>
import { useI18n } from "vue-i18n";
export default {
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: null
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
      max: null
    };
  },

  computed: {
    formated() {
      const [min, max] = this.modelValue;

      if (min && !max) return `> ${min}`;
      if (!min && max) return `< ${max}`;
      if (min && max) return `${min} - ${max}`;

      return null;
    },

    isDirty() {
      return this.min !== null || this.max !== null;
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
        return;
      }

      this.min = value[0] || null;
      this.max = value[1] || null;
    },

    clear() {
      this.min = null;
      this.max = null;
      this.$emit("update:modelValue", []);
    },

    submit() {
      if (this.min === "") this.min = null;
      if (this.max === "") this.max = null;
      this.$emit("update:modelValue", [this.min, this.max]);
    }
  }
};
</script>

<style lang="scss"></style>
