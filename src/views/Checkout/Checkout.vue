<template>
  <v-container>
    <section-heading icon="mdi-cart" icon-color="primary" class="mb-3" tag="h1">
      <template #title>
        {{ $t("checkout.title") }}
      </template>
    </section-heading>
    <checkout-info></checkout-info>
  </v-container>
</template>

<script>
import CheckoutInfo from "./CheckoutInfo.vue";
import SectionHeading from "@/components/Content/SectionHeading.vue";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

export default {
  components: { CheckoutInfo, SectionHeading },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!vm.token || !vm.$route.query.chunkId) return vm.$router.push({ name: "home" });
      else next();
    });
  },

  setup() {
    const { token } = useAuthFrame();

    return {
      token
    };
  },

  head() {
    return {
      title: this.$t("checkout.meta.title")
    };
  },
  watch: {
    "$cart.state.cart.items": {
      deep: true,
      handler() {
        if (this.$cart.state.cart.items.length === 0)
          this.$router.push({ name: "home" });
      }
    }
  },
  created() {}
};
</script>

<style lang="scss"></style>
