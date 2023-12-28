<template>
  <div class="s-gradient-field">
    <v-btn
      icon
      :input-value="isGradient"
      active-class="primary"
      @click="isGradient = !isGradient"
    >
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-icon v-bind="props">mdi-gradient-horizontal</v-icon>
        </template>

        <span>{{ $t("components.fields.gradientField") }}</span>
      </v-tooltip>
    </v-btn>

    <div class="__gradient ms-2" :style="style">
      <gradient-field-input
        v-model="from"
        @update:modelValue="submit"
      ></gradient-field-input>

      <template v-if="isGradient">
        <gradient-field-input
          v-model="to"
          @update:modelValue="submit"
        ></gradient-field-input>
      </template>
    </div>
  </div>
</template>

<script>
import GradientFieldInput from "@/components/SiteBuilder/Fields/GradientFieldInput.vue";

import debounce from "lodash/debounce";

export default {
  components: { GradientFieldInput },

  props: {
    modelValue: {
      type: Array,
      default: () => ["#000000FF", "#000000FF"]
    }
  },

  data() {
    return {
      isGradient: this.modelValue[0] !== this.modelValue[1],
      from: this.modelValue[0],
      to: this.modelValue[1]
    };
  },

  computed: {
    style() {
      return {
        background: `linear-gradient(to right, ${this.from}, ${this.to})`
      };
    }
  },

  watch: {
    from(v) {
      if (!this.isGradient) this.to = v;
    },
    to(v) {
      if (!this.isGradient) this.from = v;
    },
    isGradient(v) {
      if (!v) this.to = this.from;
    }
  },

  methods: {
    submit: debounce(function() {
      this.$emit("update:modelValue", [this.from, this.to]);
    }, 400)
  }
};
</script>

<style lang="scss">
.s-gradient-field {
  display: flex;

  > .__gradient {
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
  }
}
</style>
