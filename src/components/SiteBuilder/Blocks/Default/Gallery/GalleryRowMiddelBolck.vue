<template>
  <v-container class="s-gallery-block" fluid>
    <v-row class="justify-center">
      <v-col
        v-for="(item, i) in items"
        :key="i"
        cols="6"
        :md="comp"
        class="px-2"
        :class="py"
      >
        <media-img-common
          v-model="config.items[i]"
          :item="item"
          :show-caption="config.showCaption"
          :height="height"
          class="zoomIn"
          @update="update"
        ></media-img-common>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";

import MediaImgCommon from "@/components/SiteBuilder/Blocks/Default/Gallery/MediaImgCommon.vue";
import GalleryCommon from "@/components/SiteBuilder/Blocks/Default/Gallery/GalleryCommon";

export default {
  components: { MediaImgCommon },
  mixins: [BlocksHelperMixin, GalleryCommon],
  computed: {
    comp() {
      return this.config.items.length > 4
        ? "2"
        : this.config.items.length == 4
        ? "3"
        : "4";
    },
    py() {
      return this.$isMobile ? "pt-1" : "py-0";
    },
    height() {
      return this.$vuetify.display.name == "xs" ? "100" : "200";
    }
  }
};
</script>

<style>
._gallery_link {
  text-decoration: none;
  text-decoration-color: transparent;
}
.zoomIn {
  -webkit-transform: scale(1);
  transform: scale(1);
  -webkit-transition: 0.3s ease-in-out;
  transition: 0.3s ease-in-out;
}
.zoomIn:hover {
  -webkit-transform: scale(1.06);
  transform: scale(1.06);
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.7);
}
</style>
