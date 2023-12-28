<template>
  <div class="embed-container">
    <ok-video
      v-if="config.media && config.media.length"
      :media="config.media[0]"
      cover
      controls
      :loop="config.autoplay"
      :autoplay="config.autoplay"
    >
    </ok-video>
    <ok-video v-else :media="defaultMedia" cover> </ok-video>
  </div>
</template>

<script>
import BlockHelperMixinGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockHelperMixinGrid";
import OkVideo from "@ouedkniss/web-ui-plugin/src/components/video/OkVideo.vue";

export default {
  components: { OkVideo },
  mixins: [BlockHelperMixinGrid],
  data() {
    return {
      loading: true,
      config: {
        media: null,
        autoplay: false
      },
      defaultMedia: {
        mediaUrl:
          "https://cdn0.dev.ouedkniss.com/medias/announcements/videos/2023-10-17/7drURIg7WXHbRoiJMY85XRpvcJNDBcfiE4M64vwM.mp4"
      }
    };
  }
};
</script>

<style></style>
