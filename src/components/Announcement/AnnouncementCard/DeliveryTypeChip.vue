<template>
  <v-chip
    :size="mini ? 'x-small' : 'small'"
    :class="{
      'text-green': announcement.deliveryType == 'DELIVERY_FREE',
      'text-amber-darken-2':
        announcement.deliveryType == 'DELIVERY_PAY_ON_DELIVERY',
      'text-blue':
        announcement.deliveryType == 'DELIVERY_AVAILABLE' ||
        announcement.deliveryType == 'SERVICE_ORDER_AVAILABLE'
    }"
  >
    <v-icon :size="mini ? 'x-small' : 'small'" start>mdi-truck-check</v-icon>
    <template v-if="announcement.deliveryType == 'DELIVERY_FREE'">
      {{ $t("announcement.delivery.types.DELIVERY_FREE") }}
    </template>
    <template
      v-else-if="announcement.deliveryType == 'DELIVERY_PAY_ON_DELIVERY'"
    >
      {{ $t("announcement.delivery.types.DELIVERY_PAY_ON_DELIVERY") }}
    </template>
    <template v-else-if="announcement.deliveryType == 'DELIVERY_AVAILABLE'">
      {{ $t("announcement.delivery.types.DELIVERY_AVAILABLE") }}
    </template>
    <template
      v-else-if="announcement.deliveryType == 'SERVICE_ORDER_AVAILABLE'"
    >
      {{ serviceMsg }}
    </template>
  </v-chip>
</template>

<script>
export default {
  props: {
    announcement: {
      type: Object,
      required: true
    },
    mini: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    serviceMsg() {
      if (this.announcement.category.slug) {
        if (this.announcement.category.slug.startsWith("voyages"))
          return this.$t(
            "announcement.delivery.types.SERVICE_ORDER_AVAILABLE_SERVICE"
          );
        if (this.announcement.category.slug.startsWith("services"))
          return this.$t(
            "announcement.delivery.types.SERVICE_ORDER_AVAILABLE_SERVICE"
          );
        if (this.announcement.category.slug.startsWith("immobilier"))
          return this.$t(
            "announcement.delivery.types.SERVICE_ORDER_AVAILABLE_SERVICE"
          );
        if (this.announcement.category.slug.startsWith("automobiles"))
          return this.$t(
            "announcement.delivery.types.SERVICE_ORDER_AVAILABLE_VEHICLES"
          );
        if (this.announcement.category.slug.startsWith("vehicules"))
          return this.$t(
            "announcement.delivery.types.SERVICE_ORDER_AVAILABLE_VEHICLES"
          );
      }
      return this.$t("announcement.delivery.types.SERVICE_ORDER_AVAILABLE");
    }
  }
};
</script>

<style></style>
