<template>
  <div class="s-editor-blocks">
    <v-toolbar>
      <v-btn icon @click="changeEditorTab('design')">
        <v-icon>
          {{ $vuetify.locale.rtl ? "mdi-arrow-right" : "mdi-arrow-left" }}
        </v-icon>
      </v-btn>

      <v-toolbar-title>
        {{ $t("blockDefinitions.title") }}
      </v-toolbar-title>
    </v-toolbar>

    <v-list three-line class="pt-0">
      <template v-for="(item, type) in buttons">
        <v-list-item
          v-if="size(item.layouts) <= 1"
          :key="item.title"
          @click="addBlockFromDefinition(type, item)"
        >
          <template #prepend>
            <v-icon size="large">{{
              item.icon ? item.icon : "mdi-plus-circle"
            }}</v-icon>
          </template>

          <span>
            <v-list-item-title>
              {{ $t(item.title) }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ $t(item.description) }}
            </v-list-item-subtitle>
          </span>
        </v-list-item>
        <v-list-group v-else :key="item.title" no-action>
          <template #activator>
            <v-icon size="large">{{
              item.icon ? item.icon : "mdi-plus-circle"
            }}</v-icon>
            <span>
              <v-list-item-title> {{ $t(item.title) }} </v-list-item-title>
              <v-list-item-subtitle>
                {{ $t(item.description) }}
              </v-list-item-subtitle>
            </span>
          </template>

          <v-list-item
            v-for="(layout, index) in item.layouts"
            :key="layout.title"
            class="my-0 py-0"
            @click="addBlockFromDefinition(type, item, index)"
          >
            <span class="my-0 py-0">
              <v-list-item-title>
                {{
                  $t("editorBlocks.display") +
                    " " +
                    (index + 1) +
                    " / " +
                    size(item.layouts)
                }}</v-list-item-title
              >
            </span>
          </v-list-item>
        </v-list-group>
      </template>
    </v-list>
  </div>
</template>

<script>
import BlockDefinition from "@/components/SiteBuilder/Blocks/BlockDefinition.js";

import { mapMutations } from "vuex";
import { sync } from "vuex-pathify";
import defaults from "lodash/defaults";
import size from "lodash/size";

export default {

  inject: ["getBlockInstanceByIndex"],
  data() {
    return {
      buttons: BlockDefinition()
    };
  },

  computed: {
    ...sync({ editor: "builder/editor" })
  },

  methods: {
    size: structure => size(structure),
    ...mapMutations({
      addBlock: "builder/addBlock",
      selectBlock: "builder/selectBlock",
      changeEditorTab: "builder/changeEditorTab"
    }),

    async addBlockFromDefinition(type, definition, layoutIndex = 0) {
      const themeDefault = {
        theme: this.$vuetify.theme.current.dark ? "dark" : "light"
      };
      const layout = definition.layouts[layoutIndex];

      const block = {
        type,
        layout: layoutIndex,
        attrs: defaults(layout.attrs, definition.default, themeDefault)
      };

      const index = this.editor.selected ? this.editor.selected.index : -1;

      this.addBlock({ block, index });

      this.$nextTick(() => {
        const vm = this.getBlockInstanceByIndex(index);
        this.selectBlock(vm);

        this.goTo(vm.$el.offsetTop, { duration: 1000 });
      });
    }
  }
};
</script>

<style scoped lang="scss">
.s-editor-blocks {
  .v-list--three-line .v-list__tile__avatar {
    margin-top: 0;
  }
}
.v-list--three-line .v-list-item,
.v-list-item--three-line {
  min-height: 50px;
}
</style>
