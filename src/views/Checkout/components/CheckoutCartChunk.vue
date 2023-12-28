<template>
  <v-card
    class="o-cart-chunk"
    :loading-chunk="loadingChunk > 0"
    :disabled="loadingChunk > 0"
  >
    <router-link
      target="_blank"
      :to="getStoreUrl(chunk.store)"
      class="d-flex align-center py-2 px-4 text-decoration-none"
    >
      <v-avatar size="40">
        <store-img :store="chunk.store" cover />
      </v-avatar>

      <h1
        class="text-h6 font-weight-light ms-4"
        :class="{
          'text-black': !$vuetify.theme.current.dark,
          'text-white': $vuetify.theme.current.dark
        }"
      >
        {{ chunk.store.name }}
      </h1>
    </router-link>

    <v-divider></v-divider>

    <vv-form ref="form">
      <v-list density="compact" class="py-0">
        <checkout-cart-item
          v-for="(item, index) in items"
          ref="items"
          :key="index + item.id"
          :index="index"
          :item="item"
          :has-management="hasManagement"
          :is-merchant="item.isMerchant"
          @setQuantity="setQuantity"
          @remove="confirmRemoveCartItem"
          @valid="setValidation"
        ></checkout-cart-item>
      </v-list>

      <v-divider></v-divider>
    </vv-form>

    <v-row v-if="total" class="pa-4">
      <v-col cols="6">{{ $t("_.total") }}</v-col>
      <v-col
        cols="6"
        class="text-primary font-weight-bold"
        :class="$vuetify.locale.rtl ? 'text-left' : 'text-right'"
      >
        <announ-price
          :price="total"
          :unit="items && items.length > 0 ? 'UNIT' : 'NO_PRICE'"
        ></announ-price>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import MessageBox from "@/mixins/MessageBox";
import AnnounPrice from "@/components/Announcement/AnnounPrice.vue";
import CheckoutCartItem from "./CheckoutCartItem.vue";
import { cloneDeep, map, some, reduce } from "lodash";
import StoreUrlMixin from "@/components/Store/StoreUrlMixin";

export default {
  components: { CheckoutCartItem, AnnounPrice },
  mixins: [MessageBox, StoreUrlMixin],

  props: {
    chunk: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      loadingChunk: 0,
      items: [],
      itemsValidation: []
    };
  },
  computed: {
    total() {
      return reduce(
        this.items,
        (sum, item) => {
          return sum + item.total;
        },
        0
      );
    },
    notValid() {
      return some(this.itemsValidation, s => s.valide === false);
    },
    hasManagement() {
      return this.chunk.store.hasProductManagement;
    }
  },

  mounted() {
    this.items = cloneDeep(this.chunk.items);
  },

  methods: {
    setQuantity({ quantity, index }) {
      this.items[index].quantity = quantity;
      this.items[index].total = this.items[index].itemPrice * quantity;
      this.makeUpdate();
    },
    setValidation(v) {
      if (this.itemsValidation === undefined) return;
      const index = this.itemsValidation.findIndex(c => c.id === v.id);
      if (index < 0) this.itemsValidation.push(v);
      else this.itemsValidation[index].valide = v.valide;
    },
    async confirmRemoveCartItem(item) {
      const confirm = await this.$confirm({
        title: this.$t("checkout.alerts.remove.0"),
        icon: "mdi-cart-minus"
      });

      if (!confirm) return;

      this.loadingChunk++;

      await this.$cart.removeCartItem(item.id);

      const index = this.itemsValidation.findIndex(c => c.id === item.id);
      if (index >= 0) this.itemsValidation.splice(index, 1);
      this.items = this.items.filter(e => e.id !== item.id);
      this.loadingChunk--;
    },

    async makeUpdate() {
      if (this.notValid) return;
      const { valid: isValid } = await this.$refs.form.validate();
      if (!isValid) return;

      this.loadingChunk++;

      const items = map(this.items, item => ({
        id: item.id,
        item: { quantity: item.quantity }
      }));

      await this.$cart.updateCartItems(items);
      this.loadingChunk--;
    }
  }
};
</script>
