<template>
  <div>
    <checkout-cart-chunk
      v-for="chunk in chunks"
      :key="chunk.id"
      ref="chunks"
      :chunk="chunk"
      class="mb-10"
      @submit="submit(chunk.id)"
    ></checkout-cart-chunk>
  </div>
</template>

<script>
import CheckoutCartChunk from "./components/CheckoutCartChunk.vue";

export default {
  components: { CheckoutCartChunk },

  props: {
    chunks: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss"></style>
