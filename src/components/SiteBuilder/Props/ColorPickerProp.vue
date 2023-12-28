<template>
  <div>
    <color-field v-model="color" solo flat class="mt-4" @update:modelValue="update">
    </color-field>
  </div>
</template>

<script>
import ColorField from "@/components/SiteBuilder/Fields/ColorField.vue";

const COLOR_DEFAULT = "#000000";

export default {
  components: { ColorField },

  props: {
    modelValue: {
      type: [String, Number],
      default: null
    }
  },

  data() {
    return {
      color: COLOR_DEFAULT
    };
  },

  watch: {
    modelValue: {
      immediate: true,
      handler() {
        if (this.modelValue) {
          this.color = this.modelValue;
        } else {
          this.color = COLOR_DEFAULT;
        }
      }
    }
  },

  methods: {
    update() {
      this.$emit("update:modelValue", this.color);
    }
  }
};
</script>

<style></style>
