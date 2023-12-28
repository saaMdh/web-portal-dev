<template>
  <v-select
    solo
    flat
    clearable
    hide-details
    :items="items"
    :item-title="item => $t(item.text)"
    :model-value="modelValue"
    :label="label && $t(label)"
    @change="v => $emit('update:modelValue', v)"
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
        { text: "props.themeProp.items.dark", value: "dark" },
        { text: "props.themeProp.items.light", value: "light" }
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
