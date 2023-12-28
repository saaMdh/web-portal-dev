<template>
  <div class="embed-container">
    <iframe
      width="100%"
      height="100%"
      :src="videoId"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
import BlockHelperMixinGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockHelperMixinGrid";

export default {
  components: {},
  mixins: [BlockHelperMixinGrid],
  data() {
    return {
      loading: true,
      config: {
        videoUrl: null
      }
    };
  },

  computed: {
    player() {
      return this.$refs.youtube.player;
    },
    videoId() {
      if (this.config.videoUrl) return this.config.videoUrl;
      return null;
    }
  }
};
</script>

<style>
.embed-container {
  position: relative;
  padding-bottom: 50%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
}
.embed-container iframe,
.embed-container object,
.embed-container embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
