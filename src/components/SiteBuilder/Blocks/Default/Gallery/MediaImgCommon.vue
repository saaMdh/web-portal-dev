<template>
  <media-editor v-model="mediaElement.media" size="regular" @update="update">
    <v-img
      :src="getImageSrc(item)"
      :lazy-src="getThumbImageSrc(item)"
      :height="height"
      :contain="item.media.contain"
      class="rounded"
    >
      <div
        v-if="showCaption"
        class="d-flex pa-4 flex-column fill-height justify-center align-center"
        :style="
          $isDesktop
            ? 'background: radial-gradient(rgba(0,0,0,0.5), transparent 40%);'
            : 'background: radial-gradient(rgba(0,0,0,0.5), transparent 70%);'
        "
      >
        <text-editor v-model="mediaElement.title" @update:modelValue="update">
          <div
            class="font-weight-bold text-white"
            :class="$isDesktop ? 'text-h5' : 'text-h6'"
            v-text="item.title[$i18n.locale]"
          ></div>
        </text-editor>
        <text-editor v-model="mediaElement.subtitle" @update:modelValue="update">
          <div
            class="font-weight-light text-white "
            :class="$isDesktop ? 'text-subtitle-1' : 'text-subtitle-2'"
            v-text="item.subtitle[$i18n.locale]"
          ></div>
        </text-editor>
      </div>
    </v-img>
  </media-editor>
</template>
<script>
import TextEditor from "@/components/SiteBuilder/Editors/TextEditor.vue";
import MediaEditor from "@/components/SiteBuilder/Editors/MediaEditor.vue";

import GalleryCommon from "@/components/SiteBuilder/Blocks/Default/Gallery/GalleryCommon";

export default {
  components: { MediaEditor, TextEditor },
  mixins: [GalleryCommon],
  props: {
    modelValue: {
      type: [Object, String],
      default: () => ({})
    },
    item: {
      type: [Object, String],
      default: () => ({})
    },
    showCaption: {
      type: [Boolean, String],
      default: false
    },
    height: {
      type: [Number, String],
      default: null
    }
  },
  computed: {
    mediaElement: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      }
    }
  },
  methods: {
    update(v) {
      this.$emit("update", v);
    }
  }
};
</script>
<style></style>
