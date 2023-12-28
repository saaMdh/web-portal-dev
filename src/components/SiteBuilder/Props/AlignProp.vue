<template>
  <v-select
    variant="solo"
    flat
    hide-details
    clearable
    :items="items"
    :item-title="item => $t(item.text)"
    :model-value="modelValue"
    :label="label && $t(label)"
    @update:modelValue="v => $emit('update:modelValue', v)"
    @click:clear="clear"
  ></v-select>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: "left"
    },
    label: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      items: [
        { text: "props.alignProp.items.left", value: "left" },
        { text: "props.alignProp.items.right", value: "right" },
        { text: "props.alignProp.items.center", value: "center" }
      ]
    };
  },

  methods: {
    clear() {
      this.$nextTick(() => this.$emit("update:modelValue", null));
    }
  }
};
</script>

<style></style>
