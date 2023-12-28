<template>
  <div>
    <div
      class="v-card ok-text"
      :style="{
        width: getSize()
      }"
    ></div>
  </div>
</template>

<script>
/* eslint-disable vue/require-prop-types */
export default {
  props: {
    width: {
      Type: [String, Number],
      default: null
    }
  },
  methods: {
    getSize() {
      return this.width ? this.convertSizeToString(this.width) : "100px";
    },
    convertSizeToString(width) {
      return typeof width === "number" ? width + "px" : width;
    }
  }
};
</script>

<style lang="scss">
.ok-text {
  border-radius: 4px;
  height: 18px;
}
.v-theme--light {
  .ok-text {
    background: rgba(120, 120, 120, 0.12);
  }
}
.v-theme--dark {
  .ok-text {
    background: rgba(255, 255, 255, 0.12);
  }
}
</style>
