<template>
  <promo-dummy :width="width" :height="height"> </promo-dummy>
</template>

<script>
import PromoDummy from "./PromoDummy.vue";

export default {
  components: { PromoDummy },

  props: {
    width: { type: [Number, String], required: true },
    height: { type: [Number, String], required: true }
  }
};
</script>
