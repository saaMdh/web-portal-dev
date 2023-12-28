<template>
  <v-container fluid class="s-gallery-block">
    <div
      class="d-flex flex-wrap"
      :class="{
        'justify-space-between': $isDesktop,
        'justify-center': $isMobile
      }"
    >
      <div v-for="(item, i) in items" :key="i" class="ma-1">
        <media-editor
          v-model="config.items[i].media"
          size="regular"
          @update="update"
        >
          <v-img
            :src="getImageSrc(item)"
            :lazy-src="getThumbImageSrc(item)"
            height="200"
            width="200"
            :contain="item.media.contain"
            :gradient="captionGradient"
          >
            <div
              v-if="config.showCaption"
              class="d-flex flex-column justify-end fill-height py-2 px-3 text-white"
            >
              <text-editor v-model="config.items[i].title" @update:modelValue="update">
                <span class="title font-weight-bold">{{
                  item.title[$i18n.locale]
                }}</span>
              </text-editor>
              <text-editor v-model="config.items[i].subtitle" @update:modelValue="update">
                <span class="substitle-1 font-weight-light">
                  {{ item.subtitle[$i18n.locale] }}
                </span>
              </text-editor>
            </div>
          </v-img>
        </media-editor>
      </div>
    </div>
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

<style></style>
