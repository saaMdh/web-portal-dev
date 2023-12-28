<template>
  <v-navigation-drawer
    v-model="editor.drawer"
    hide-overlay
    stateless
    clipped
    location="start"
    width="350"
    class="s-editor-sheet"
  >
    <div class="s-editor-sheet__content">
      <editor-home v-if="editor.tab === 'home'"></editor-home>
      <editor-theme v-if="editor.tab === 'theme'"></editor-theme>
      <editor-pages v-if="editor.tab === 'pages'"></editor-pages>
      <editor-queries v-if="editor.tab === 'queries'"></editor-queries>
      <editor-store-queries
        v-if="editor.tab === 'storeQueries'"
      ></editor-store-queries>
      <editor-design v-if="editor.tab === 'design'"> </editor-design>
      <editor-blocks v-if="editor.tab === 'blocks' && currentPage">
      </editor-blocks>
      <template v-if="editor.tab === 'props' && currentPage && editor.selected">
        <editor-props></editor-props>
      </template>
      <editor-publish v-if="editor.tab === 'publish'"> </editor-publish>
      <editor-history v-if="editor.tab === 'history'"> </editor-history>
      <editor-blueprint v-if="editor.tab === 'blueprint'"> </editor-blueprint>
      <editor-props-grid
        v-if="
          editor.tab === 'props-grid' &&
          currentPage &&
          editor.selected &&
          editor.selectedGridBlock
        "
      ></editor-props-grid>
      <div id="inline-editing"></div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { sync } from "vuex-pathify";
import Mousetrap from "mousetrap";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    EditorBlocks: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/EditorBlocks.vue")
    ),
    EditorPages: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/EditorPages.vue")
    ),
    EditorQueries: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/EditorQueries.vue")
    ),
    EditorStoreQueries: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/EditorStoreQueries.vue")
    ),
    EditorProps: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/EditorProps.vue")
    ),
    EditorHome: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/EditorHome.vue")
    ),
    EditorTheme: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/EditorTheme.vue")
    ),
    EditorHistory: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/EditorHistory.vue")
    ),
    EditorBlueprint: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/EditorBlueprint.vue")
    ),
    EditorPublish: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/EditorPublish.vue")
    ),
    EditorDesign: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/EditorDesign.vue")
    ),
    EditorPropsGrid: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/EditorPropsGrid.vue")
    )
  },

  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({ currentPage: "builder/currentPage" }),

    ...sync({
      editor: "builder/editor",
      editorEnable: "builder/editor@enable",
      editorRight: "builder/editor@right",
      editorMode: "builder/editor@mode"
    })
  },

  mounted() {
    Mousetrap.bind("esc", () => {
      if (this.editor.selected) this.unselectBlock();
      else if (this.editorMode == "select") this.editorMode = "preview";
      else this.editorEnable = false;
    });
  },

  methods: {
    ...mapMutations({
      changeEditorTab: "builder/changeEditorTab",
      unselectBlock: "builder/unselectBlock"
    })
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans&display=swap");

.s-editor-sheet {
  --v-theme-primary: 41, 182, 246;

  --toolbar-background: #22252a;
  --toolbar-header: #2f333a;
  --toolbar-color: #c9c9c9;
  --toolbar-selected: #4ea1ff;
  --toolbar-warning: #fdd835;
  --toolbar-border: #1a1d21;

  --toolbar-input-background: rgba(0, 0, 0, 0.2);
  --toolbar-input-border: rgba(0, 0, 0, 0.3);

  font-family: "Open Sans", sans-serif;
  display: flex;
  flex-direction: row;
  z-index: 99 !important;

  margin-top: 54px;

  position: fixed !important;
  &.v-theme--dark,
  &.v-theme--light {
    background: var(--toolbar-background) !important;
    color: var(--toolbar-color) !important;
  }

  .v-theme--dark.v-toolbar.v-sheet {
    background: var(--toolbar-header) !important;
  }
  .v-navigation-drawer {
    z-index: 90 !important;
  }
  .v-navigation-drawer__content {
    width: 100%;
    display: flex;
    flex-direction: row;
    height: calc(100% - 50px) !important;
  }

  &.v-navigation-drawer--right .v-navigation-drawer__content {
    flex-direction: row-reverse;
  }

  &__toolbar {
    width: 50px;
  }

  &__content {
    width: 400px - 50px;
    height: 100%;

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1);
      background-color: rgba(0, 0, 0, 0.2);
    }

    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: rgba(0, 0, 0, 0.4);
    }
  }

  /**
   * Cutom Tweak
   */

  .v-theme--dark.v-text-field--solo > .v-input__control {
    & > .v-input__slot {
      background: --toolbar-input-background;
      border: 1px solid --toolbar-input-border;
    }
  }

  .v-theme--dark.v-text-field--filled > .v-input__control {
    & > .v-input__slot {
      background: --toolbar-input-background;
      border: 1px solid --toolbar-input-border;
    }
  }

  .v-theme--dark.v-list .v-list--disabled {
    opacity: 0.25;
  }

  .v-theme--dark.v-color-picker.v-sheet {
    background: var(--toolbar-background);
  }

  .v-menu {
    &__content {
      .v-theme--dark.v-card {
        background: var(--toolbar-background);
      }

      .v-theme--dark.v-list {
        background: var(--toolbar-background);
      }
    }
  }
}
</style>
