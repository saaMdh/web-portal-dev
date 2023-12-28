<template>
  <div class="s-editor-toolbar">
    <div class="__logo">
      <img src="@/assets/logomark-h-w.svg" alt="" />
    </div>

    <template v-for="(item, index) in toolbar">
      <v-tooltip
        v-if="!item.hide || (item.hide && item.hide())"
        :key="index"
        :location="!editorRight ? 'end' : 'start'"
        class="__item"
      >
        <template #activator="{ props }">
          <v-btn
            variant="text"
            icon
            :class="item.class && item.class()"
            v-bind="{ ...props, ...item.on, ...(item.bind && item.bind()) }"
          >
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </template>

        <span>{{ $t(item.title) }}</span>
      </v-tooltip>
    </template>

    <v-spacer></v-spacer>

    <v-tooltip :location="!editorRight ? 'end' : 'start'">
      <template #activator="{ props }">
        <v-btn text icon v-bind="props" @click="editorRight = !editorRight">
          <v-icon>mdi-arrow-expand-horizontal</v-icon>
        </v-btn>
      </template>

      <span>{{ $t("editorToolbar.toolbarPosition") }}</span>
    </v-tooltip>

    <v-tooltip :location="!editorRight ? 'end' : 'start'">
      <template #activator="{ props }">
        <v-btn text icon v-bind="props" @click="editorEnable = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>

      <span>{{ $t("editorToolbar.close") }}</span>
    </v-tooltip>
  </div>
</template>

<script>
import Permission from "@/mixins/Permission";

import { mapMutations } from "vuex";
import { sync } from "vuex-pathify";

export default {
  mixins: [Permission],

  inject: ["commitSiteBuild", "restoreSiteBuild"],

  data() {
    return {
      toolbar: [
        {
          title: "editorToolbar.home",
          icon: "mdi-home",
          on: {
            click: () => this.changeEditorTab("home")
          },
          class: () => ({
            "--selected": this.editor.tab === "home"
          })
        },
        {
          title: "editorToolbar.properties",
          icon: "mdi-pencil",
          hide: () => !!this.editor.selected,
          class: () => ({
            "--selected": this.editor.tab === "props"
          }),
          on: {
            click: () => this.changeEditorTab("props")
          }
        },
        {
          title: "editorToolbar.selectBlock",
          icon: "mdi-cursor-default",
          hide: () => !this.editor.selected,
          on: {
            click: this.toggleSelectMode
          },
          class: () => ({
            info: !!this.editor.selected,
            "--selected": this.editorMode === "select"
          })
        },
        {
          title: "editorToolbar.addBlock",
          icon: "mdi-plus-box",
          class: () => ({
            "--selected": this.editor.tab === "blocks"
          }),
          bind: () => ({ disabled: !this.isAccessGranted("blocks") }),
          on: {
            click: () => {
              this.changeEditorTab("blocks");
            }
          }
        },
        {
          icon: "mdi-cloud-check",
          title: "editorHome.publish.title",
          subtitle: "editorHome.publish.subtitle",
          bind: () => ({ disabled: !this.isAccessGranted("publish") }),
          on: {
            click: () => this.changeEditorTab("publish")
          }
        },
        {
          title: "editorToolbar.save",
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
      editorRight: "builder/editor@right",
      editorDirty: "builder/editor@dirty",
      notice: "builder/editor@notice"
    })
  },

  methods: {
    ...mapMutations({
      unselectBlock: "builder/unselectBlock",
      toggleSelectMode: "builder/toggleSelectMode",
      changeEditorTab: "builder/changeEditorTab"
    })
  }
};
</script>

<style lang="scss">
.s-editor-toolbar {
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 100vh;

  border-right: 1px solid;
  border-color: var(--toolbar-border);

  .v-btn {
    margin-top: 4px * 2;
  }

  .v-theme--dark.v-icon {
    color: var(--toolbar-color);
  }

  .--selected {
    .v-theme--dark.v-icon {
      color: var(--toolbar-selected);
    }
  }

  .--highlight {
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
