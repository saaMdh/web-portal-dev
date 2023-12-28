<template>
  <div>
    <p class="text-white">
      <v-icon :left="!$vuetify.locale.rtl" :right="$vuetify.locale.rtl">mdi-eye</v-icon>
      {{ $t("props.hideOnProp.title") }}
    </p>
    <v-select
      solo
      flat
      :clearable="!!modelValue"
      hide-details
      :items="items"
      :item-title="item => $t(item.text)"
      :model-value="modelValue"
      :label="$t('props.hideOnProp.title')"
      class="pb-4"
      @update:modelValue="v => $emit('update:modelValue', v)"
      @click:clear="clear"
    ></v-select>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: "left"
    }
  },

  data() {
    return {
      items: [
        {
          value: null,
          text: "props.hideOnProp.items.none",
          icon: null
        },
        {
          value: "md",
          text: "props.hideOnProp.items.desktop",
          icon: "mdi-monitor"
        },
        {
          value: "xs",
          text: "props.hideOnProp.items.mobile",
          icon: "mdi-cellphone"
        }
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
