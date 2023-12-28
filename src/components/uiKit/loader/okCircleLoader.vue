<template>
  <div>
    <div
      class="v-card ok-circle"
      :style="{
        height: getSize(),
        width: getSize()
      }"
      :class="{
        animation: animated
      }"
      disabled
    ></div>
    <div
      v-if="label"
      class="v-card ok-circle-text mt-2"
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
    size: {
      Type: [String, Number],
      default: null
    },
    target: {
      Type: String,
      default: "category"
    },
    animated: {
      Type: Boolean,
      default: true
    },
    label: {
      Type: Boolean,
      default: false
    }
  },
  methods: {
    getSize() {
      return this.size
        ? this.convertSizeToString(this.size)
        : this.default(this.target);
    },
    convertSizeToString(size) {
      return typeof size === "number" ? size + "" : size;
    },
    default(t) {
      let size = "";
      switch (t) {
        case "category":
          size = "75px";
          break;
        default:
          size = "75px";
          break;
      }
      return size;
    }
  }
};
</script>

<style lang="scss">
.ok-circle {
  border-radius: 50% !important;
}
.ok-circle-text {
  border-radius: 4px;
  height: 14px;
}
.v-theme--light {
  .ok-circle,
  .ok-circle-text {
    background: rgba(120, 120, 120, 0.12);
  }
}
.v-theme--dark {
  .ok-circle,
  .ok-circle-text {
    background: rgba(255, 255, 255, 0.12);
  }
}
</style>
