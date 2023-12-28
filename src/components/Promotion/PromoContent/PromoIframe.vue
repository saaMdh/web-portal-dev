<template>
  <iframe
    id="uvIFrame"
    :src="mediaUrl"
    frameborder="0"
    scrolling="no"
    title="ad iframe"
    :width="width"
    :height="height"
    :style="disablePointerEvents ? 'pointer-events: none' : ''"
  ></iframe>
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
    disablePointerEvents: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      iframeEl: null,
      loaded: false
    };
  },
  computed: {
    mediaUrl() {
      var url = new URL(this.promo.currentVisual.media.mediaUrl);

      url.searchParams.append("lang", this.$vuetify.locale.current);
      if (this.$route.params && this.$route.params.category)
        url.searchParams.append("category", this.$route.params.category);
      if (
        this.$route.name == "announcement_show" &&
        this.$route.params &&
        this.$route.params.id
      )
        url.searchParams.append("announcement-id", this.$route.params.id);
      return url.href;
    }
  },
  mounted() {
    this.iframeEl = document.querySelector("iframe#uvIFrame");
    if (this.iframeEl) this.iframeEl.onload = this.loadEmitter;
    setTimeout(() => {
      if (!this.loaded) {
        this.$emit("load", true);
        this.loaded = true;
      }
    }, 3000);
  },
  methods: {
    loadEmitter() {
      if (!this.loaded) {
        this.$emit("load", true);
        this.loaded = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
