<template>
  <span class="d-inline-flex">
    <div
      dir="ltr"
      :class="{
        'ml-1': $vuetify.locale.rtl,
        'mr-1': !$vuetify.locale.rtl,
        'text-decoration-line-through': old
      }"
      v-text="formatCurrency(price, false)"
    ></div>

    <div
      :class="{
        'text-decoration-line-through': old
      }"
    >
      {{ $t(`announcement.priceUnit.${unit}`) }}
    </div>
  </span>
</template>

<script>
export default {
  props: {
    price: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    old: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style></style>
