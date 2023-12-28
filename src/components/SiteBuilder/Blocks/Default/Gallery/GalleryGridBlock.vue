<template>
  <v-container class="s-gallery-block">
    <v-row>
      <v-col v-for="(item, i) in items" :key="i" cols="12" md="6">
        <media-editor
          v-model="config.items[i].media"
          size="regular"
          @update="update"
        >
          <v-img
            :src="getImageSrc(item)"
            :lazy-src="getThumbImageSrc(item)"
            height="300"
            :contain="item.media.contain"
            :gradient="captionGradient"
          >
            <div
              v-if="config.showCaption"
              class="d-flex pa-4 flex-column justify-end fill-height"
            >
              <text-editor v-model="config.items[i].title" @update:modelValue="update">
                <div
                  class="text-h5 font-weight-bold text-white"
                  v-text="item.title[$i18n.locale]"
                ></div>
              </text-editor>
              <text-editor v-model="config.items[i].subtitle" @update:modelValue="update">
                <div
                  class="text-subtitle-1 font-weight-light text-white"
                  v-text="item.subtitle[$i18n.locale]"
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
import TextEditor from "@/components/SiteBuilder/Editors/TextEditor.vue";
import MediaEditor from "@/components/SiteBuilder/Editors/MediaEditor.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";

import GalleryCommon from "@/components/SiteBuilder/Blocks/Default/Gallery/GalleryCommon";

export default {
  components: { MediaEditor, TextEditor },
  mixins: [BlocksHelperMixin, GalleryCommon],

  computed: {
    captionGradient() {
      return this.config.showCaption
        ? "to top, rgba(0,0,0,0.75), transparent"
        : "";
    }
  }
};
</script>

<style>
._gallery_link {
  text-decoration: none;
}
</style>
