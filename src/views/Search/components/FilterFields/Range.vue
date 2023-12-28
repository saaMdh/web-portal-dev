<template>
  <range-field-spec
    :model-value="range"
    :label="label"
    single-line
    density="comfortable"
    :placeholder="label"
    @update:modelValue="submit"
  ></range-field-spec>
</template>

<script>
import RangeFieldSpec from "@/components/Field/RangeFieldSpec.vue";

export default {
  components: { RangeFieldSpec },
  props: {
    modelValue: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    codename: {
      type: String,
      default: null
    }
  },

  computed: {
    range() {
      return (this.modelValue ? this.modelValue.split("-") : [null, null]).map(
        v => parseInt(v)
      );
    }
  },

  methods: {
    submit(v) {
      if (!v) {
        this.$emit("update:modelValue", null);
        return;
      }

      const [min, max] = v;
      this.isDirty = false;
      this.$emit("update:modelValue", `${min}-${max}`);
    }
  }
};
</script>

<style lang="scss"></style>
