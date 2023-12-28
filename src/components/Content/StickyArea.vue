<template>
  <div
    data-sticky-container
    class="selector"
    data-margin-top="60"
    data-sticky-for="1023"
    data-sticky-class="is-sticky"
  >
    <slot></slot>
  </div>
</template>

<script>
import Sticky from "sticky-js";

export default {
  props: {
    width: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      sticky: null
    };
  },
  mounted() {
    this.sticky = new Sticky(".selector");
  },
  beforeUnmount() {
    this.sticky.destroy();
    this.sticky = null;
  }
};
</script>
<style>
.is-sticky {
}
</style>
