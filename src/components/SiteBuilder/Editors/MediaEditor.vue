<template>
  <div class="s-media-editor">
    <template v-if="isInSelectedBlock">
      <v-btn
        fab
        light
        absolute
        active-class="primary"
        :input-value="isActiveEditor"
        @click="openEditor"
      >
        <v-icon>mdi-image-search-outline</v-icon>
      </v-btn>
    </template>

    <Teleport v-if="isActiveEditor" to="#inline-editing">
      <v-theme-provider theme="dark">
        <v-toolbar>
          <v-btn icon @click="closeEditor">
            <v-icon>
              {{ $vuetify.locale.rtl ? "mdi-arrow-right" : "mdi-arrow-left" }}
            </v-icon>
          </v-btn>

          <v-toolbar-title>
            {{ $t("components.mediaEditor.chooseImage") }}
          </v-toolbar-title>
        </v-toolbar>

        <div class="px-4 mt-4">
          <template v-if="!hideLink">
            <link-field
              v-model="config.link"
              @update:modelValue="update"
            ></link-field>

            <v-divider class="mb-4"></v-divider>
          </template>
          <p class="text-white">
            <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
              >mdi-image-multiple</v-icon
            >
            {{ $t("components.mediaEditor.uploadImage") }}
          </p>

          <v-card class="pa-2">
            <p>
              {{ $t("components.mediaEditor.chooseImageDesktop") }}
            </p>

            <v-switch
              v-if="!hideSizeSwitch"
              v-model="config.desktop.contain"
              :label="$t('components.mediaEditor.resize')"
              @change="update"
            ></v-switch>

            <picture-prop
              v-model="config.desktop.image"
              :size="size"
              @update:modelValue="update"
            ></picture-prop>

            <v-switch
              v-if="!hideSizeSwitch"
              v-model="config.desktop.autoSize"
              :label="$t('components.mediaEditor.defaultSize')"
              @change="update"
            ></v-switch>
          </v-card>
          <v-divider class="mb-4"></v-divider>
          <v-card class="pa-2">
            <p>
              {{ $t("components.mediaEditor.chooseImageMobile") }}
            </p>
            <v-switch
              v-if="!hideSizeSwitch"
              v-model="config.mobile.contain"
              :label="$t('components.mediaEditor.resize')"
              @change="update"
            ></v-switch>

            <picture-prop
              v-model="config.mobile.image"
              :size="size"
              @update:modelValue="update"
            ></picture-prop>

            <v-switch
              v-if="!hideSizeSwitch"
              v-model="config.mobile.autoSize"
              :label="$t('components.mediaEditor.defaultSize')"
              @change="update"
            ></v-switch>
          </v-card>
        </div>
      </v-theme-provider>
    </Teleport>

    <router-link
      v-if="!hideLink && isPath"
      class="href-media-editor"
      :to="getLink(modelValue.link)"
    >
      <slot></slot>
    </router-link>
    <a
      v-else-if="!hideLink"
      class="href-media-editor"
      :href="modelValue.link"
      target="_blank"
    >
      <slot></slot>
    </a>
    <div v-else class="href-media-editor" target="_blank">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import LinkField from "@/components/SiteBuilder/Fields/LinkField.vue";
import PictureProp from "@/components/SiteBuilder/Props/PictureProp.vue";

import EditorCommon from "@/components/SiteBuilder/Editors/EditorCommon.js";

import isString from "lodash/isString";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";
import omit from "lodash/omit";
import get from "lodash/get";
import has from "lodash/has";

export default {
  components: { PictureProp, LinkField },

  mixins: [EditorCommon],
  model: {
    event: "update"
  },

  props: {
    modelValue: {
      type: [Object, String],
      default: () => ({})
    },
    hideLink: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "hd"
    },
    hideSizeSwitch: {
      type: Boolean,
      default: false
    },
    feature: {
      type: [Number, Boolean],
      default: false
    }
  },

  data() {
    return {
      config: {
        link: null,
        desktop: {
          image: null,
          contain: false,
          autoSize: false
        },
        mobile: {
          image: null,
          contain: false,
          autoSize: false
        }
      }
    };
  },
  computed: {
    isPath() {
      const link = get(this.modelValue, "link");
      return link ? link.startsWith("/") : false;
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(val) {
        if (isString(val))
          val = {
            desktop: { image: { full: val, thumb: val } },
            mobile: { image: { full: val, thumb: val } }
          };

        this.config = this.mediaDevice(val);
      }
    },
    "config.desktop.image": {
      handler(v) {
        const ImgThumbMobile = get(this.config, "mobile.image.thumb", "");
        if (
          v &&
          v.thumb &&
          !v.thumb.includes("default-no-image") &&
          ImgThumbMobile.includes("default-no-image")
        ) {
          this.config.mobile.image = this.config.desktop.image;
          this.$emit("update", this.config);
        }
      }
    },
    "config.mobile.image": {
      handler(v) {
        const ImgThumbDesktop = get(this.config, "desktop.image.thumb", "");
        if (
          v &&
          v.thumb &&
          !v.thumb.includes("default-no-image") &&
          ImgThumbDesktop.includes("default-no-image")
        ) {
          this.config.desktop.image = this.config.mobile.image;
          this.$emit("update", this.config);
        }
      }
    }
  },

  methods: {
    mediaDevice(media) {
      if (has(media, "desktop")) return media;

      const _media = {
        link: media?.link,
        desktop: { ...omit(media, ["link"]) },
        mobile: { ...omit(media, ["link"]) }
      };
      return merge(this.config, _media);
    },
    update() {
      if (this.feature !== false) {
        const config = cloneDeep(this.config);
        config.featureId = this.feature;
        this.$emit("update", config);
      } else this.$emit("update", this.config);
    }
  }
};
</script>

<style lang="scss">
.href-media-editor {
  text-decoration: none;
  height: 100%;
}
.s-media-editor {
  position: relative;
  z-index: 2;

  .v-btn {
    left: calc(50% - 20px);
    top: calc(50% - 20px);
  }
}
</style>
