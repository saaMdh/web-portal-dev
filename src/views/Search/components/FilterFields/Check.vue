<template>
  <div
    v-ripple
    class="d-flex justify-space-between align-center px-4 py-1 text-grey-darken-2"
    @click.stop="toggle"
  >
    <label>{{ label }}</label>
    <v-switch
      v-model="isChecked"
      variant="inset"
      class="filter-switch mt-0"
      hide-details
      density="compact"
      end
      @change="emit"
      @click.stop
    >
    </v-switch>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: null
    },
    modelValue: {
      type: String,
      default: "false"
    },
    codename: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      isChecked: false
    };
  },

  watch: {
    modelValue: {
      immediate: true,
      handler() {
        this.isChecked = this.modelValue === "true";
        this.emit();
      }
    }
  },

  methods: {
    toggle() {
      this.isChecked = !this.isChecked;
      this.emit();
    },

    emit() {
      this.$emit("update:modelValue", this.isChecked ? "true" : "false");
    }
  }
};
</script>
<style>
.filter-switch .v-input__control {
  grid-area: none !important;
}
</style>
