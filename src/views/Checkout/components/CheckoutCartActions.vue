<template>
  <v-list density="compact">
    <v-list-item
      :to="{
        name: 'announcement_show',
        params: {
          id: item.announcement.id,
          slug: item.announcement.slug
        }
      }"
      target="_blank"
    >
      <template #prepend>
        <v-icon>mdi-eye</v-icon>
      </template>

      <span>
        {{ $t("checkout.cart.show") }}
      </span>
    </v-list-item>

    <v-list-item @click="$emit('remove')">
      <template #prepend>
        <v-icon>mdi-cart-remove</v-icon>
      </template>

      <span>
        {{ $t("checkout.cart.remove") }}
      </span>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  }
};
</script>
