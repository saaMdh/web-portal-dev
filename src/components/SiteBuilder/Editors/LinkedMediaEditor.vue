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
      <v-theme-provider :key="_uid" theme="dark">
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
          <picture-prop
            :model-value="modelValue"
            :size="size"
            @update:modelValue="v => $emit('update', v)"
          ></picture-prop>
        </div>
      </v-theme-provider>
    </Teleport>

    <slot></slot>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import EditorCommon from "@/components/SiteBuilder/Editors/EditorCommon.js";

export default {
  components: {
    PictureProp: defineAsyncComponent(() =>
      import("@/components/SiteBuilder/Props/PictureProp.vue")
    )
  },

  mixins: [EditorCommon],

  model: {
    event: "update"
  },

  props: {
    size: {
      type: String,
      default: "hd"
    },

    modelValue: {
      type: Object,
      default: null
    }
  }
};
</script>

<style lang="scss">
.s-media-editor {
  position: relative;

  .v-btn {
    left: calc(50% - 20px);
    top: calc(50% - 20px);
  }
}
</style>
