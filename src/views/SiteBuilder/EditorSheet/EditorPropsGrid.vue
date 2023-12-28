<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>
        {{ $t("@.edit") }} {{ $t(selectedGridBlockDefinition.title) }}
      </v-toolbar-title>
      <v-btn icon @click="hideEditor">
        <v-icon>
          {{ "mdi-close" }}
        </v-icon>
      </v-btn>
    </v-toolbar>

    <div class="pt-2">
      <editor-image
        v-if="selectedGridBlockState.type === 'Image'"
      ></editor-image>
      <editor-custom-video
        v-if="selectedGridBlockState.type === 'CustomVideo'"
      ></editor-custom-video>
      <editor-icon
        v-else-if="selectedGridBlockState.type === 'Icon'"
      ></editor-icon>
      <editor-btn
        v-else-if="selectedGridBlockState.type === 'Button'"
      ></editor-btn>
      <editor-text
        v-else-if="selectedGridBlockState.type === 'Text'"
      ></editor-text>
      <editor-video
        v-else-if="selectedGridBlockState.type === 'Video'"
      ></editor-video>
      <editor-map
        v-else-if="selectedGridBlockState.type === 'Map'"
      ></editor-map>
      <editor-contact
        v-else-if="selectedGridBlockState.type === 'ContactInformation'"
      ></editor-contact>
      <editor-carousel
        v-else-if="selectedGridBlockState.type === 'Carousel'"
      ></editor-carousel>
      <editor-spacer
        v-else-if="selectedGridBlockState.type === 'Spacer'"
      ></editor-spacer>

      <editor-props-layout v-else></editor-props-layout>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    EditorPropsLayout: defineAsyncComponent(() =>
      import(
        "@/views/SiteBuilder/EditorSheet/BlockEditor/EditorPropsLayout.vue"
      )
    ),
    EditorImage: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/BlockEditor/EditorImage.vue")
    ),
    EditorIcon: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/BlockEditor/EditorIcon.vue")
    ),
    EditorBtn: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/BlockEditor/EditorBtn.vue")
    ),
    EditorText: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/BlockEditor/EditorText.vue")
    ),
    EditorVideo: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/BlockEditor/EditorVideo.vue")
    ),
    EditorMap: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/BlockEditor/EditorMap.vue")
    ),
    EditorContact: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/BlockEditor/EditorContact.vue")
    ),
    EditorCarousel: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/BlockEditor/EditorCarousel.vue")
    ),
    EditorSpacer: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/BlockEditor/EditorSpacer.vue")
    ),
    EditorCustomVideo: defineAsyncComponent(() =>
      import(
        "@/views/SiteBuilder/EditorSheet/BlockEditor/EditorCustomVideo.vue"
      )
    )
  },

  computed: {
    ...mapGetters({
      selectedGridBlockState: "builder/selectedGridBlockState",
      selectedGridBlockDefinition: "builder/selectedGridBlockDefinition"
    })
  },
  methods: {
    ...mapMutations({
      updateGridBlockAttr: "builder/updateGridBlockAttr",
      changeEditorTab: "builder/changeEditorTab",
      unselectBlock: "builder/unselectBlock",
      hideEditor: "builder/hideEditor"
    })
  }
};
</script>

<style lang="scss"></style>
