<template>
  <div class="o-editor-publish">
    <v-toolbar>
      <v-toolbar-title>
        {{ $t("components.editorPublish.title") }}
      </v-toolbar-title>
      <v-btn icon @click="hideEditor">
        <v-icon>
          {{ "mdi-close" }}
        </v-icon>
      </v-btn>
    </v-toolbar>

    <v-list three-line>
      <v-list-item
        v-for="(item, index) in items"
        v-bind="item.bind && item.bind()"
        :key="index"
        :class="item.class && item.class()"
        v-on="item.on && item.on()"
        @click.stop
      >
        <template #prepend>
          <v-avatar>
            <v-icon size="32">{{ item.icon }}</v-icon>
          </v-avatar>
        </template>

        <v-list-item-title>
          {{ $t(item.title) }}
        </v-list-item-title>

        <v-list-item-subtitle style="-webkit-line-clamp: 2">
          {{ $t(item.subtitle) }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <input
      ref="importer"
      type="file"
      class="d-none"
      accept="application/json"
      @change="readImportFile"
    />
  </div>
</template>

<script>
import Permission from "@/mixins/Permission";

import { format } from "date-fns";
import { mapMutations } from "vuex";
import { sync } from "vuex-pathify";
import pick from "lodash/pick";

export default {
  mixins: [Permission],

  inject: ["publishSiteBuild", "loadSiteBuild"],

  data() {
    return {
      items: [
        {
          icon: "mdi-cloud-upload-outline",
          title: "components.editorPublish.actions.publishSiteBuild.title",
          subtitle:
            "components.editorPublish.actions.publishSiteBuild.subtitle",
          on: () => ({
            click: () => {
              this.publishSiteBuild();
            }
          }),
          bind: () => ({
            disabled: this.editorNotice.publish.loading > 0
          })
        },
        {
          icon: "mdi-history",
          title: "components.editorPublish.actions.history.title",
          subtitle: "components.editorPublish.actions.history.subtitle",
          on: () => ({ click: () => this.changeEditorTab("history") })
        },
        {
          icon: "mdi-content-save-all",
          title: "components.editorPublish.actions.blueprint.title",
          subtitle: "components.editorPublish.actions.blueprint.subtitle",
          on: () => ({ click: () => this.changeEditorTab("blueprint") })
        },
        {
          icon: "mdi-file-import-outline",
          title: "components.editorPublish.actions.importToFile.title",
          subtitle: "components.editorPublish.actions.importToFile.subtitle",
          on: () => ({
            click: () => this.importToFile()
          }),
          class: () => ({
            "d-none": !this.isAccessGranted("import")
          })
        },
        {
          icon: "mdi-file-export-outline",
          title: "components.editorPublish.actions.exportToFile.title",
          subtitle: "components.editorPublish.actions.exportToFile.subtitle",
          on: () => ({
            click: () => this.exportToFile()
          }),
          class: () => ({
            "d-none": !this.isAccessGranted("export")
          })
        }
      ]
    };
  },

  computed: {
    ...sync({
      siteBuild: "builder/siteBuild",
      editorNotice: "builder/editor@notice",
      editorDirty: "builder/editor@dirty"
    })
  },

  methods: {
    ...mapMutations({
      changeEditorTab: "builder/changeEditorTab",
      hideEditor: "builder/hideEditor"
    }),

    readImportFile() {
      var reader = new FileReader();

      reader.onload = () => {
        let build = JSON.parse(reader.result);
        build = pick(build, ["theme", "pages", "headers", "footers"]);
        build.land = this.siteBuild.land;

        this.loadSiteBuild(build, { recordBackup: false });

        this.$nextTick(() => {
          this.editorDirty = true;
        });

        this.$refs.importer.value = "";
      };

      reader.readAsText(this.$refs.importer.files[0]);
    },

    importToFile() {
      this.$refs.importer.click();
    },

    exportToFile() {
      const filename = `${this.siteBuild.land.name} (${format(
        new Date(),
        "yyyy-MM-dd"
      )}).json`;

      const link = document.createElement("a");

      link.href = `data:text/plain,${encodeURIComponent(
        JSON.stringify(
          pick(this.siteBuild, ["theme", "pages", "headers", "footers"])
        )
      )}`;

      link.setAttribute("download", filename);
      link._target = "blank";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    }
  }
};
</script>

<style lang="scss">
.o-editor-home {
  .v-list-item--disabled {
    opacity: 0.3;
  }
}
</style>
