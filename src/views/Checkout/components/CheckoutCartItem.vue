<template>
  <v-list-group :append-icon="isMerchant ? '' : '$expand'">
    <template #activator="{ props }">
      <v-list-item :disabled="isMerchant" v-bind="props">
        <template v-if="!isMerchant" #prepend>
          <v-avatar>
            <ok-img :media-url="getMediaUrl(item.announcement)" cover />
          </v-avatar>
        </template>

        <span>
          <div>
            {{ item.announcement.title }}
            <span v-if="variantLabel" class="text-subtitle-2 text-primary">
              [{{ variantLabel }}]
            </span>
          </div>
          <v-list-item-subtitle v-if="!item.updateQuantityDisabled">
            <span class="text-primary">{{ quantity }} x </span>
            <span v-if="item.variant" class="text-primary">
              <announ-price
                :price="item.variant.price"
                :unit="item.announcement.priceUnit"
              ></announ-price>
            </span>
            <span v-else class="text-primary">
              <announ-price
                :price="item.announcement.pricePreview"
                :unit="item.announcement.priceUnit"
              ></announ-price>
            </span>
          </v-list-item-subtitle>
          <v-alert
            v-if="!!validation && hasManagement"
            tile
            type="warning"
            class="px-1 mt-1"
            variant="text"
            rounded
          >
            {{ validation }}
          </v-alert>
        </span>
      </v-list-item>
    </template>

    <div class="mt-4 px-4">
      <checkout-qty-field
        v-if="!isMerchant && !item.updateQuantityDisabled"
        v-model.number="quantity"
        :max-quantity="maxQuantity"
        :has-management="hasManagement"
      ></checkout-qty-field>
    </div>

    <checkout-cart-actions
      v-if="!isMerchant"
      :item="item"
      @remove="$emit('remove', item)"
    ></checkout-cart-actions>
  </v-list-group>
</template>

<script>
import CheckoutCartActions from "./CheckoutCartActions.vue";
import AnnounPrice from "@/components/Announcement/AnnounPrice.vue";

import CheckoutQtyField from "./CheckoutQtyField.vue";
import MessageBox from "@/mixins/MessageBox";
import get from "lodash/get";

export default {
  components: {
    CheckoutQtyField,
    CheckoutCartActions,
    AnnounPrice
  },
  mixins: [MessageBox],

  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: [Number, String],
      required: true
    },
    hasManagement: {
      type: Boolean
    },
    isMerchant: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      valid: true
    };
  },

  computed: {
    quantity: {
      get() {
        return this.item.quantity;
      },
      set(quantity) {
        this.$emit("setQuantity", {
          quantity: quantity || 1,
          index: this.index
        });
      }
    },
    variantLabel() {
      if (!this.item.variant) return null;
      return this.item.variant.specifications.map(s => s.valueText).join(" - ");
    },
    maxQuantity() {
      return this.item.variant
        ? this.item.variant.quantity
        : this.item.announcement.quantity;
    },
    validation() {
      if (this.maxQuantity === 0) {
        return this.$t(`checkout.cart.validation.stockOut`);
      }
      if (this.quantity > this.maxQuantity) {
        return this.$t(
          `checkout.cart.validation.maxQuantity`,
          this.maxQuantity
        );
      }
      return null;
    }
  },
  watch: {
    validation: {
      immediate: true,
      handler() {
        this.valid = this.hasManagement
          ? this.validation === null
            ? true
            : false
          : true;

        this.$emit("valid", { valide: this.valid, id: this.item.id });
      }
    }
  },
  methods: {
    getMediaUrl(announcement) {
      return get(announcement, "defaultMedia.mediaUrl", null);
    }
  }
};
</script>

<style lang="scss"></style>
