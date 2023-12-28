<template>
  <v-container class="s-gallery-block" fluid>
    <v-row class="justify-center" no-gutters>
      <v-col v-if="config.items.length > 4" cols="12" md="4">
        <v-container class="pl-0 pt-0 pb-1" :class="padding">
          <media-img-common
            v-model="config.items[3]"
            :item="items[3]"
            :show-caption="config.showCaption"
            :height="height"
            class="zoomOut"
            @update="update"
          ></media-img-common>
        </v-container>
        <v-container class="pl-0 pt-1" :class="padding">
          <media-img-common
            v-model="config.items[4]"
            :item="items[4]"
            :show-caption="config.showCaption"
            :height="height"
            class="zoomOut"
            @update="update"
          ></media-img-common>
        </v-container>
      </v-col>
      <v-col
        cols="12"
        :md="
          config.items.length == 1 ? '12' : config.items.length > 4 ? '4' : '6'
        "
        :class="padding"
      >
        <media-img-common
          v-model="config.items[0]"
          :item="items[0]"
          :show-caption="config.showCaption"
          :height="$isMobile ? '154' : '316'"
          class="zoomOut"
          @update="update"
        ></media-img-common>
      </v-col>
      <v-col
        v-if="config.items.length > 1"
        cols="12"
        :md="config.items.length > 4 ? '4' : '6'"
      >
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
          <v-row no-gutters>
            <v-col
              v-if="config.items.length > 2"
              :md="config.items.length == 4 ? '6' : ''"
            >
              <media-img-common
                v-model="config.items[2]"
                :item="items[2]"
                :show-caption="config.showCaption"
                :height="height"
                class="zoomOut"
                @update="update"
              ></media-img-common>
            </v-col>
            <v-col
              v-if="config.items.length == 4"
              :md="config.items.length == 4 ? '6' : ''"
              :class="$isMobile ? 'py-0 pt-2' : 'pl-1'"
            >
              <media-img-common
                v-model="config.items[3]"
                :item="items[3]"
                :show-caption="config.showCaption"
                :height="height"
                class="zoomOut"
                @update="update"
              ></media-img-common>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col v-if="config.items.length == 6" cols="12" md="12" class="pt-2">
        <media-editor
          v-model="config.items[5].media"
          size="regular"
          @update="update"
        >
          <v-img
            :src="getImageSrc(items[5])"
            :lazy-src="getThumbImageSrc(items[5])"
            :height="$isMobile ? '154' : '316'"
            :contain="items[5].media.contain"
            class="rounded"
          >
            <div
              v-if="config.showCaption"
              class="d-flex pa-4 flex-column fill-height justify-center align-center"
              style="background: radial-gradient(rgba(0,0,0,0.5), transparent 40%); "
            >
              <text-editor v-model="config.items[5].title" @update:modelValue="update">
                <div
                  class="text-h5 font-weight-bold text-white"
                  v-text="config.items[5].title[$i18n.locale]"
                ></div>
              </text-editor>
              <text-editor v-model="config.items[5].subtitle" @update:modelValue="update">
                <div
                  class="text-subtitle-1 font-weight-light text-white"
                  v-text="config.items[5].subtitle[$i18n.locale]"
                ></div>
              </text-editor>
            </div>
          </v-img>
        </media-editor>
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
      return this.config.items.length == 2 ? "316" : "154";
    },
    padding() {
      return this.$isMobile ? "pb-2 pr-0 pt-0" : "pr-2";
    }
  }
};
</script>

<style>
._gallery_link {
  text-decoration: none;
}
.zoomOut {
  -webkit-transform: scale(1);
  transform: scale(1);
  -webkit-transition: 0.3s ease-in-out;
  transition: 0.3s ease-in-out;
}
.zoomOut:hover {
  -webkit-transform: scale(0.95);
  transform: scale(0.95);
  box-shadow: 0 3px 10px rgb(0 0 0 / 0.7);
}
</style>
