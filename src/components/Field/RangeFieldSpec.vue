<template>
  <div>
    <v-hover v-slot="{ isHovering, props }">
      <div v-bind="props">
        <vv-form v-show="focusing || isHovering" @submit="submit">
          <div class="d-flex align-center">
            <v-text-field
              v-model.number="min"
              hide-details
              variant="solo"
              flat
              density="comfortable"
              min="0"
              type="number"
              single-line
              :label="$t('_.min')"
              :placeholder="$t('_.min')"
              @keydown="DelayedSubmit"
              @focus="focus"
              @blur="blur"
              @update:model-value="DelayedSubmit"
            ></v-text-field>

            <v-text-field
              v-model.number="max"
              hide-details
              variant="solo"
              flat
              density="comfortable"
              type="number"
              single-line
              :label="$t('_.max')"
              :placeholder="$t('_.max')"
              @keydown="DelayedSubmit"
              @focus="focus"
              @blur="blur"
              @update:model-value="DelayedSubmit"
            ></v-text-field>

            <div class="d-flex flex-gap-2 px-2">
              <v-btn
                v-if="isDirty"
                :aria-label="$t('_.clear')"
                icon
                @click="clear"
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </div>
          </div>
        </vv-form>

        <div v-show="!focusing && !isHovering">
          <div
            class="d-flex justify-space-between py-3 px-3 text-grey-darken-1"
          >
            <div>
              {{ label }}
              <span v-if="formated">[{{ formated }}]</span>
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
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      min: null,
      max: null,
      focusing: false
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
      this.$emit("update:modelValue", null);
    },

    submit() {
      this.$emit("update:modelValue", [this.min, this.max]);
    },
    DelayedSubmit() {
      setTimeout(this.submit, 300);
    },
    focus() {
      this.focusing = true;
    },
    blur() {
      this.focusing = false;
    }
  }
};
</script>

<style lang="scss"></style>
