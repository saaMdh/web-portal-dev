<template>
  <v-container fluid class="s-gallery-block">
    <div
      class="d-flex flex-wrap"
      :class="{
        'justify-space-between': $isDesktop,
        'justify-center flex-wrap': $isMobile
      }"
    >
      <div
        v-for="(item, i) in items"
        :key="i"
        class="d-flex flex-column align-center flex-gap-4 ma-1"
      >
        <div>
          <media-editor
            v-model="config.items[i].media"
            size="regular"
            @update:modelValue="update"
          >
            <v-img
              :src="getImageSrc(item)"
              :lazy-src="getThumbImageSrc(item)"
              height="150"
              width="150"
              :contain="item.media.contain"
            >
            </v-img>
          </media-editor>
        </div>

        <div style="width: 150px" class="text-center">
          <text-editor v-model="config.items[i].title" @update:modelValue="update">
            <span class="text-h6 font-weight-bold">{{
              item.title[$i18n.locale]
            }}</span>
          </text-editor>
          <text-editor v-model="config.items[i].subtitle" @update:modelValue="update">
            <span class="text-substitle-1 font-weight-light">
              {{ item.subtitle[$i18n.locale] }}
            </span>
          </text-editor>
        </div>
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
  mixins: [BlocksHelperMixin, GalleryCommon]
};
</script>

<style></style>
