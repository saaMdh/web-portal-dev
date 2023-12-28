<template>
  <v-select
    v-bind="$attrs"
    :items="items"
    :model-value="modelValue"
    item-value="id"
    :label="$t('checkout.cart.provider')"
    :error-messages="errorMessages"
    @update:model-value="v => $emit('update:modelValue', v)"
  >
    <template #item="{item}">
      <span>
        <v-list-item-title>{{ item.provider.name }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ item.duration.min }} - {{ item.duration.max }}
          {{ $t(`checkout.cart.duration.${item.duration.unit}`) }} &mdash;
          {{ formatCurrency(item.deliveryPrice) }}
        </v-list-item-subtitle>
      </span>
    </template>

    <template #selection="{item}">
      {{ item.provider.name }} - {{ formatCurrency(item.deliveryPrice) }}
    </template>
  </v-select>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: () => []
    },
    errorMessages: {
      type: Array,
      required: () => []
    },
    modelValue: {
      type: [Object, Number, String],
      default: null
    }
  }
};
</script>

<style></style>
