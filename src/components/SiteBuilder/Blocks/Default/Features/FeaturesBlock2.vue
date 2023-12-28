<template>
  <v-container fluid class="s-features-block">
    <dual-layout :reverse="config.reverse">
      <template #first>
        <media-editor v-model="config.media" size="regular" @update="update">
          <v-img
            :src="media.image.full"
            :lazy-src="media.image.thumb"
            :contain="media.contain"
            :height="height"
          ></v-img>
        </media-editor>
      </template>

      <template #second>
        <v-row>
          <v-col
            v-for="(item, i) in config.items"
            :key="i"
            cols="6"
            class="text-center"
          >
            <feature-editor v-model="config.items[i]" @update:modelValue="update">
              <media-editor
                v-if="item.isImage"
                v-model="config.items[i].media"
                :size="$isDesktop ? '91' : '40'"
                hide-size-switch
                hide-link
                @update="update"
              >
                <template v-if="item.media">
                  <v-img
                    class="mx-auto"
                    :src="
                      $isDesktop
                        ? item.media.desktop.image.full
                        : item.media.mobile.image.full
                    "
                    :lazy-src="
                      $isDesktop
                        ? item.media.desktop.image.full
                        : item.media.mobile.image.full
                    "
                    :height="$isDesktop ? '91' : '40'"
                    :width="$isDesktop ? '91' : '40'"
                  ></v-img>
                </template>
                <template v-else>
                  <v-img
                    class="mx-auto"
                    src="https://source.unsplash.com/640x450/?tech"
                    :lazy-src="require('@/assets/default-no-image.svg')"
                    :height="$isDesktop ? '91' : '40'"
                    :width="$isDesktop ? '91' : '40'"
                  ></v-img>
                </template>
              </media-editor>
              <v-icon v-else :size="$isDesktop ? '91' : '40'" color="primary">{{
                item.icon
              }}</v-icon>

              <h1
                class="text-primary font-weight-light"
                :class="$isDesktop ? 'text-h4' : 'text-h6 font-weight-bold'"
              >
                {{ item.title }}
              </h1>

              <h6
                v-if="config.showSubtitle"
                :class="$isDesktop ? 'subtitle-1' : 'caption'"
              >
                {{ item.text }}
              </h6>
            </feature-editor>
          </v-col>
        </v-row>
      </template>
    </dual-layout>
  </v-container>
</template>

<script>
import DualLayout from "@/components/SiteBuilder/Blocks/Common/DualLayout.vue";
import FeatureEditor from "@/components/SiteBuilder/Editors/FeatureEditor.vue";
import MediaEditor from "@/components/SiteBuilder/Editors/MediaEditor.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import FeaturesCommon from "@/components/SiteBuilder/Blocks/Default/Features/FeaturesCommon";
import get from "lodash/get";

export default {
  components: { MediaEditor, FeatureEditor, DualLayout },
  mixins: [BlocksHelperMixin, FeaturesCommon],
  computed: {
    media() {
      return this.$isDesktop
        ? get(this.config.media, "desktop", this.config.media)
        : get(this.config.media, "mobile", this.config.media);
    },
    height() {
      return this.$isDesktop
        ? "500px"
        : this.$vuetify.display.name == "sm"
        ? "400px"
        : "100%";
    }
  }
};
</script>

<style></style>
