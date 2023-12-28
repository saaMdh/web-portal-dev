<template>
  <v-card elevation="1" rounded>
    <v-card-text>
      <div
        v-if="totalWithDelivery"
        class="d-sm-flex justify-space-between mb-4"
      >
        <div class="text-h6">
          {{ $t("checkout.confirm.cartFinalPrice") }}
        </div>
        <div class="text-h6">
          <span class="d-inline-block me-1">
            <span dir="ltr" class="text-primary">
              {{ formatCurrency(totalWithDelivery, false) }}
            </span>
          </span>
          <span class="d-inline-block text-primary me-1">
            {{ $t(`announcement.priceUnit.UNIT`) }}
          </span>
          <span
            v-if="currentChunk.isSelfDelivery"
            class="d-inline-block subtitle-2"
          >
            + {{ $t("checkout.confirm.delivery") }}
          </span>
        </div>
      </div>
      <div class="d-flex justify-end">
        <v-btn
          v-if="userInfo.addresses.length === 0 || userInfo.phones.length === 0"
          :aria-label="$t('_.submit')"
          color="primary"
          :loading="loading > 0"
          rounded="xl"
          variant="elevated"
          @click="$emit('auto-add')"
        >
          {{ $t("_.submit") }}

          <v-icon end>mdi-check</v-icon>
        </v-btn>
        <v-btn
          v-else
          :aria-label="$t('checkout.submit')"
          color="primary"
          :loading="loading > 0"
          rounded="xl"
          variant="elevated"
          @click="$emit('confirm')"
        >
          {{ $t("checkout.submit") }}

          <v-icon end>mdi-truck-delivery</v-icon>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import reduce from "lodash/reduce";

export default {
  props: {
    currentChunk: {
      type: Object,
      required: true
    },
    loading: {
      type: Number,
      dafault: 0
    },
    userInfo: {
      type: Object,
      required: true
    },
    relayPoint: {
      type: Object,
      default: () => {}
    },
    providerPrice: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      items: cloneDeep(this.currentChunk.items)
    };
  },
  computed: {
    totalWithDelivery() {
      const totalPrice = reduce(
        this.items,
        (sum, item) => {
          return sum + item.total;
        },
        0
      );

      return totalPrice + this.providerPrice;
    }
  },

  watch: {
    currentChunk: {
      immediate: true,
      deep: true,
      handler() {
        this.items = cloneDeep(this.currentChunk.items);
      }
    }
  }
};
</script>
