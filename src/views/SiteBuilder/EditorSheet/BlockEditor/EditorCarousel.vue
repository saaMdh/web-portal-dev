<template>
  <div>
    <div class="px-4 mt-4">
      <v-card :style="style">
        <p class="text-white text-center pt-2">
          <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
            >mdi-eye-check</v-icon
          >
          {{ $t("components.carouselBlock.props.slidesPerView") }}
        </p>
        <number-prop
          v-model="blockAttrs.slidesPerView"
          :min="1"
          :max="3"
          @update:modelValue="
            setAttrValue('slidesPerView', blockAttrs.slidesPerView)
          "
        ></number-prop>
      </v-card>
      <v-divider class="my-2"></v-divider>
      <v-card :style="style">
        <v-toolbar-items class="justify-center align-center ma-2">
          <p class="text-white mb-0">
            <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
              >mdi-arrow-expand-all</v-icon
            >
            {{ $t("components.carouselBlock.props.navigation") }}
          </p>
          <v-spacer></v-spacer>
          <boolean-prop
            v-model="blockAttrs.navigation"
            @update:modelValue="
              setAttrValue('navigation', blockAttrs.navigation)
            "
          ></boolean-prop>
        </v-toolbar-items>
      </v-card>
      <v-divider class="my-2"></v-divider>
      <v-card :style="style">
        <v-toolbar-items class="justify-center align-center ma-2">
          <p class="text-white mb-0">
            <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
              >mdi-dots-horizontal</v-icon
            >
            {{ $t("components.carouselBlock.props.pagination") }}
          </p>
          <v-spacer></v-spacer>
          <boolean-prop
            v-model="blockAttrs.pagination"
            @update:modelValue="
              setAttrValue('pagination', blockAttrs.pagination)
            "
          ></boolean-prop>
        </v-toolbar-items>
      </v-card>
      <v-divider class="my-2"></v-divider>
      <v-card :style="style">
        <v-toolbar-items class="justify-center align-center ma-2">
          <p class="text-white mb-0">
            <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
              >mdi-play-box-multiple</v-icon
            >
            {{ $t("components.carouselBlock.props.autoplay") }}
          </p>
          <v-spacer></v-spacer>
          <boolean-prop
            v-model="blockAttrs.autoplay"
            @update:modelValue="setAttrValue('autoplay', blockAttrs.autoplay)"
          ></boolean-prop>
        </v-toolbar-items>
      </v-card>
      <v-divider class="my-2"></v-divider>
      <v-card :style="style">
        <p class="text-white text-center pt-2">
          <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
            >mdi-format-list-numbered</v-icon
          >
          {{ $t("components.carouselBlock.props.count") }}
        </p>
        <number-prop
          v-model="blockAttrs.count"
          :min="1"
          :max="5"
          @update:modelValue="setAttrValue('count', blockAttrs.count)"
        ></number-prop>
      </v-card>

      <v-list>
        <v-list-group v-for="(item, index) in blockAttrs.items" :key="index">
          <template #activator="{ props }">
            <v-list-item v-bind="props">
              <v-list-item-title
                >{{ $t("editorBlocks.image") }}
                {{ index + 1 }}</v-list-item-title
              >
            </v-list-item>
          </template>
          <v-list-item>
            <div class="mx-2">
              <p class="text-white mt-2 mb-1">
                <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
                  >mdi-link</v-icon
                >
                {{ $t("editorBlocks.link") }}
              </p>
              <link-field
                v-model="blockAttrs.items[index].media.desktop.link"
                @update:modelValue="
                  setAttrValue(
                    `items[${index}].media.desktop.link`,
                    blockAttrs.items[index].media.desktop.link
                  )
                "
              ></link-field>

              <v-divider class="mb-2"></v-divider>
              <p class="text-white mb-1">
                <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
                  >mdi-image-multiple</v-icon
                >
                {{ $t("components.mediaEditor.uploadImage") }}
              </p>

              <v-card :style="style" class="pa-2">
                <v-toolbar-items class="mb-n4">
                  <p>
                    {{ $t("components.mediaEditor.chooseImageDesktop") }}
                  </p>
                  <v-spacer></v-spacer>

                  <v-switch
                    v-model="blockAttrs.items[index].media.desktop.contain"
                    :label="$t('components.mediaEditor.resize')"
                    class="ma-0"
                    @change="
                      setAttrValue(
                        `items[${index}].media.desktop.contain`,
                        blockAttrs.items[index].media.desktop.contain
                      )
                    "
                  ></v-switch>
                </v-toolbar-items>

                <picture-prop
                  v-model="blockAttrs.items[index].media.desktop.image"
                  size="regular "
                  @update:modelValue="
                    setAttrValue(
                      `items[${index}].media.desktop.image`,
                      blockAttrs.items[index].media.desktop.image
                    )
                  "
                ></picture-prop>
              </v-card>
              <v-divider class="ma-2"></v-divider>
              <v-card :style="style" class="pa-2">
                <v-toolbar-items class="mb-n4">
                  <p>
                    {{ $t("components.mediaEditor.chooseImageMobile") }}
                  </p>
                  <v-spacer></v-spacer>
                  <v-switch
                    v-model="blockAttrs.items[index].media.mobile.contain"
                    :label="$t('components.mediaEditor.resize')"
                    class="ma-0"
                    @change="
                      setAttrValue(
                        `items[${index}].media.mobile.contain`,
                        blockAttrs.items[index].media.mobile.contain
                      )
                    "
                  ></v-switch>
                </v-toolbar-items>

                <picture-prop
                  v-model="blockAttrs.items[index].media.mobile.image"
                  size="regular"
                  @update:modelValue="
                    setAttrValue(
                      `items[${index}].media.mobile.image`,
                      blockAttrs.items[index].media.mobile.image
                    )
                  "
                ></picture-prop>
              </v-card>
            </div>
          </v-list-item>
        </v-list-group>
      </v-list>
      <v-divider class="ma-2"></v-divider>
      <hide-on-prop
        v-if="editor.selected.block.type === 'Grid'"
        v-model="blockAttrs.hideOn"
        @update:modelValue="setAttrValue('hideOn', blockAttrs.hideOn)"
      ></hide-on-prop>
    </div>
  </div>
</template>

<script>
import LinkField from "@/components/SiteBuilder/Fields/LinkField.vue";

import PictureProp from "@/components/SiteBuilder/Props/PictureProp.vue";
import HideOnProp from "@/components/SiteBuilder/Props/HideOnProp.vue";
import NumberProp from "@/components/SiteBuilder/Props/NumberProp.vue";
import BooleanProp from "@/components/SiteBuilder/Props/BooleanProp.vue";

import BlockEditorMixin from "@/views/SiteBuilder/EditorSheet/BlockEditor/BlockEditorCommon/BlockEditorMixin";
import { ensureItemsCount } from "@/utils/array";

export default {
  components: { PictureProp, LinkField, NumberProp, BooleanProp, HideOnProp },
  mixins: [BlockEditorMixin],
  computed: {
    style() {
      return "background-color: #1e1e1e !important;color: #ffffff !important;";
    }
  },
  watch: {
    "blockAttrs.count": {
      handler: "fill"
    }
  },
  methods: {
    fill() {
      this.blockAttrs.items = ensureItemsCount(
        this.blockAttrs.items || [],
        this.blockAttrs.count,
        () => ({
          media: {
            desktop: {
              link: null,
              contain: false,
              autoSize: false,
              image: {
                full:
                  `https://source.unsplash.com/640x480/?tech&` + Math.random(),
                thumb: require("@/assets/default-no-image.svg")
              }
            },
            mobile: {
              link: null,
              contain: false,
              autoSize: false,
              image: {
                full:
                  `https://source.unsplash.com/640x480/?tech&` + Math.random(),
                thumb: require("@/assets/default-no-image.svg")
              }
            }
          }
        })
      );
      this.setAttrValue("items", this.blockAttrs.items);
    }
  }
};
</script>

<style lang="scss"></style>
