<template>
  <ok-video
    :media="promo.currentVisual.media"
    :height="height"
    :width="width"
    :autoplay="autoplay"
    cover
  ></ok-video>
</template>

<script>
import OkVideo from "@ouedkniss/web-ui-plugin/src/components/video/OkVideo.vue";
export default {
  name: "PromoVideo",
  components: {
    OkVideo
  },
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
    autoplay: {
      type: Boolean,
      default: false
    }
  }
};
</script>
