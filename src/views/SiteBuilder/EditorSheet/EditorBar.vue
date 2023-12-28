<template>
  <v-app-bar
    class="s-editor-bar"
    height="50px"
    app
    style="position: fixed;z-index: 900;"
    clipped-left
    clipped-right
  >
    <v-app-bar-nav-icon>
      <v-img
        src="@/assets/logomark-h-w.svg"
        contain
        width="50px"
        height="50px"
      ></v-img>
    </v-app-bar-nav-icon>
    <v-spacer />
    <template v-for="(item, index) in toolbar" :key="index">
      <v-tooltip :text="$t(item.tooltip)">
        <template #activator="{ props }">
          <v-card
            v-if="!item.hide || (item.hide && item.hide())"
            v-bind="{ props, ...(item.bind && item.bind()) }"
            :class="item.class && item.class()"
            class="mx-1 px-1 pt-1"
            flat
            tile
            style="background-color: transparent !important"
            v-on="item.on"
          >
            <v-card-title
              class="d-flex justify-center align-center py-0 px-4 text-white"
            >
              <v-icon>{{ item.icon }}</v-icon>
            </v-card-title>
            <v-card-text class="pa-0 text-white">
              <div style="font-size: 11px; text-align: center">
                {{ $t(item.title) }}
              </div>
            </v-card-text>
          </v-card>
        </template>
      </v-tooltip>
    </template>
    <v-btn
      class="text-white"
      variant="text"
      icon
      :title="$t('editorToolbar.close')"
      @click="closeEditor()"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import Permission from "@/mixins/Permission";
import { LandingType } from "@/utils/LandingSite";

import { sync } from "vuex-pathify";
import { mapMutations } from "vuex";

export default {
  mixins: [Permission],

  inject: ["commitSiteBuild", "restoreSiteBuild"],

  data() {
    return {
      toolbar: [
        {
          icon: "mdi-format-color-fill",
          title: "editorHome.siteTheme.iconText",
          tooltip: "editorHome.siteTheme.title",
          on: {
            click: () => this.changeEditorTab("theme")
          },
          class: () => ({
            "--selected": this.editor.tab === "theme"
          })
        },
        {
          icon: "mdi-book-open-page-variant",
          title: "editorHome.pagesManagement.iconText",
          tooltip: "editorHome.pagesManagement.title",
          on: {
            click: () => this.changeEditorTab("pages")
          },
          class: () => ({
            "--selected": this.editor.tab === "pages"
          })
        },
        {
          icon: "mdi-shape",
          title: "editorHome.queriesManagement.iconText",
          tooltip: "editorHome.queriesManagement.title",
          on: {
            click: () => this.changeEditorTab("queries")
          },
          class: () => ({
            "--selected": this.editor.tab === "queries"
          })
        },
        {
          icon: "mdi-shopping",
          title: "editorHome.storeQueriesManagement.iconText",
          tooltip: "editorHome.storeQueriesManagement.title",
          bind: () => ({ disabled: LandingType().toUpperCase() == "STORE" }),
          on: {
            click: () => this.changeEditorTab("storeQueries")
          },
          class: () => ({
            "--selected": this.editor.tab === "storeQueries"
          })
        },
        /*{
          title: "editorToolbar.togglePhoneMode",
          tooltip: "editorToolbar.togglePhoneMode",
          icon: "mdi-cellphone",
          hide: () => !this.editorPhone,
          on: {
            click: this.togglePhoneMode
          },
          class: () => ({})
        },
        {
          title: "editorToolbar.toggleDesktopMode",
          tooltip: "editorToolbar.toggleDesktopMode",
          icon: "mdi-monitor",
          hide: () => this.editorPhone,
          on: {
            click: this.togglePhoneMode
          },
          class: () => ({})
        },*/
        {
          title: "sectionAddDialog.title",
          tooltip: "sectionAddDialog.title",
          icon: "mdi-plus-box",
          class: () => ({
            "--selected": this.editor.sectionAddDialog
          }),
          bind: () => ({ disabled: !this.isAccessGranted("blocks") }),
          on: {
            click: () => {
              this.toggleSectionAddDialog();
              this.hideEditor();
            }
          }
        },
        {
          icon: "mdi-cloud-check",
          title: "editorHome.publish.iconText",
          tooltip: "editorHome.publish.title",
          subtitle: "editorHome.publish.subtitle",
          bind: () => ({ disabled: !this.isAccessGranted("publish") }),
          on: {
            click: () => this.changeEditorTab("publish")
          },
          class: () => ({
            "--selected": this.editor.tab === "publish"
          })
        },
        {
          title: "editorToolbar.save",
          tooltip: "editorToolbar.save",
          icon: "mdi-content-save-outline",
          class: () => ({
            "--highlight": this.editorDirty
          }),
          on: {
            click: () => this.commitSiteBuild()
          },
          bind: () => ({
            loading: this.notice.update.loading > 0,
            disabled: !this.editorDirty
          })
        },
        {
          title: "editorToolbar.restore",
          tooltip: "editorToolbar.restore",
          icon: "mdi-undo",
          class: () => ({
            "--highlight": this.editorDirty
          }),
          on: {
            click: () => this.restoreSiteBuild()
          },
          bind: () => ({
            disabled: !this.editorDirty
          })
        }
      ]
    };
  },

  computed: {
    ...sync({
      editor: "builder/editor",
      editorMode: "builder/editor@mode",
      editorEnable: "builder/editor@enable",
      editorShow: "builder/editor@show",
      editorRight: "builder/editor@right",
      editorDirty: "builder/editor@dirty",
      editorPhone: "builder/editor@phone",
      notice: "builder/editor@notice"
    })
  },

  methods: {
    ...mapMutations({
      unselectBlock: "builder/unselectBlock",
      toggleSelectMode: "builder/toggleSelectMode",
      changeEditorTab: "builder/changeEditorTab",
      togglePhoneMode: "builder/togglePhoneMode",
      toggleSectionAddDialog: "builder/toggleSectionAddDialog",
      hideEditor: "builder/hideEditor"
    }),
    closeEditor() {
      this.editorEnable = false;
      this.editorPhone = false;
      this.editor.drawer = false;
      this.editor.tab = null;
    }
  }
};
</script>

<style lang="scss">
.s-editor-bar {
  --v-theme-primary: 41, 182, 246;

  --toolbar-background: #22252a;
  --toolbar-header: #2f333a;
  --toolbar-color: #ffffff;
  --toolbar-selected: #4ea1ff;
  --toolbar-warning: #fdd835;
  --toolbar-border: #1a1d21;

  --toolbar-input-background: rgba(0, 0, 0, 0.2);
  --toolbar-input-border: rgba(0, 0, 0, 0.3);
  z-index: 6 !important;
  position: fixed;
  background: var(--toolbar-header) !important;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .v-theme--dark.v-icon {
    color: var(--toolbar-color);
  }

  .--selected {
    .v-card__text {
      color: var(--toolbar-selected);
    }
    .v-theme--dark.v-icon {
      color: var(--toolbar-selected);
    }
  }

  .--highlight {
    .v-card__text {
      color: var(--toolbar-warning);
    }
    .v-theme--dark.v-icon {
      color: var(--toolbar-warning);
    }
  }

  .__logo {
    text-align: center;
    margin-top: 16px;
    margin-bottom: 16px;
    img {
      width: 60%;
    }
  }
}
</style>
