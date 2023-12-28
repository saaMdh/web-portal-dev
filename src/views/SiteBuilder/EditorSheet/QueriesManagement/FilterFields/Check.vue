<template>
  <div
    v-ripple
    class="d-flex justify-space-between px-3 py-2 text-grey-darken-2"
    @click.stop="toggle"
  >
    <label>{{ label }}</label>

    <v-switch
      v-model="isChecked"
      inset
      class="mt-0 me-n3"
      dense
      hide-details
      @change="emit"
      @click.stop="toggle"
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
