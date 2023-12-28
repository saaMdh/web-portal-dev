<template>
  <v-container class="s-gallery-block" fluid>
    <v-row class="justify-center" no-gutters>
      <v-col
        cols="12"
        :md="config.items.length == 1 ? '12' : '8'"
        :sm="config.items.length == 1 ? '12' : '8'"
        :class="padding"
      >
        <media-img-common
          v-model="config.items[0]"
          :item="items[0]"
          :show-caption="config.showCaption"
          :height="316"
          class="zoomOut"
          @update="update"
        ></media-img-common>
      </v-col>
      <v-col v-if="config.items.length > 1" cols="12" md="4" sm="4">
        <v-container class="px-0 pt-0 pb-0">
          <media-img-common
            v-model="config.items[1]"
            :item="items[1]"
            :show-caption="config.showCaption"
            :height="height"
            class="zoomOut"
            @update="update"
          ></media-img-common>
        </v-container>
        <v-container v-if="config.items.length > 2" class="pb-0 px-0 pt-2">
          <media-img-common
            v-model="config.items[2]"
            :item="items[2]"
            :show-caption="config.showCaption"
            :height="height"
            class="zoomOut"
            @update="update"
          ></media-img-common>
        </v-container>
        <v-container v-if="config.items.length > 3" class="pb-0 px-0 pt-2">
          <media-img-common
            v-model="config.items[3]"
            :item="items[3]"
            :show-caption="config.showCaption"
            :height="height"
            class="zoomOut"
            @update="update"
          ></media-img-common>
        </v-container>
      </v-col>
      <v-col
        v-if="config.items.length > 4"
        cols="12"
        :md="config.items.length == 5 ? '12' : '8'"
        :sm="config.items.length == 5 ? '12' : '8'"
        class="pt-2"
        :class="$isMobile ? '154' : 'pr-2'"
      >
        <media-img-common
          v-model="config.items[4]"
          :item="items[4]"
          :show-caption="config.showCaption"
          :height="$isMobile ? '100' : '316'"
          class="zoomOut"
          @update="update"
        ></media-img-common>
      </v-col>
      <v-col
        v-if="config.items.length > 5"
        cols="12"
        md="4"
        sm="4"
        class="pt-2"
      >
        <media-img-common
          v-model="config.items[5]"
          :item="items[5]"
          :show-caption="config.showCaption"
          :height="$isMobile ? '100' : '316'"
          class="zoomOut"
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
    height() {
      return this.config.items.length == 2
        ? "316"
        : this.config.items.length == 3
        ? "154"
        : "100";
    },
    padding() {
      return this.$isDesktop | (this.$vuetify.display.name == "sm")
        ? "pr-2"
        : "pb-2";
    }
  }
};
</script>

<style>
._gallery_link {
  text-decoration: none;
}
</style>
