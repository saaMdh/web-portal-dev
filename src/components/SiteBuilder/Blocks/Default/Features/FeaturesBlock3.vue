<template>
  <v-container class="s-features-block">
    <v-row>
      <v-col
        v-for="(item, i) in config.items"
        :key="i"
        :cols="$isMobile ? '6' : ''"
        class="text-center"
        style="position: relative"
      >
        <feature-editor
          v-model="config.items[i]"
          :show-subtitle="config.showSubtitle"
          @update:modelValue="update"
        >
          <v-row>
            <v-col>
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
            </v-col>
            <v-col>
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
            </v-col>
          </v-row>
        </feature-editor>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import FeatureEditor from "@/components/SiteBuilder/Editors/FeatureEditor.vue";
import MediaEditor from "@/components/SiteBuilder/Editors/MediaEditor.vue";

import FeaturesCommon from "@/components/SiteBuilder/Blocks/Default/Features/FeaturesCommon";

export default {
  components: { MediaEditor, FeatureEditor },
  mixins: [BlocksHelperMixin, FeaturesCommon]
};
</script>

<style></style>
