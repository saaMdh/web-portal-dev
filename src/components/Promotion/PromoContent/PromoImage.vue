<template>
  <ok-img
    :media-url="promo.currentVisual.media.mediaUrl"
    :width="width"
    :height="height"
    :eager="eager"
    contain
    :NoDefaultImg="true"
    @load="load"
  />
</template>

<script>
export default {
  props: {
    promo: {
      type: Object,
      required: true
    },
    width: {
      type: [Number, String],
      required: true
    },
    height: {
      type: [Number, String],
      required: true
    },
    lazySrc: {
      type: String,
      required: true
    },
    eager: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    load(v) {
      this.$emit("load", v);
    }
  }
};
</script>

<style></style>
