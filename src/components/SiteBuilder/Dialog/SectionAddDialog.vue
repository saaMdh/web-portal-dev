<template>
  <v-dialog v-model="editor.sectionAddDialog" max-width="700" dark scrollable>
    <v-card>
      <v-card-title class="ma-0 pa-0">
        <v-toolbar>
          <v-toolbar-title>{{ $t("sectionAddDialog.title") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="toggleSectionAddDialog()">
            <v-icon>
              {{ "mdi-close" }}
            </v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-list class="pt-0">
          <template v-for="item in buttons" :key="item.title">
            <v-list-item
              v-if="size(item.layouts) <= 1"
              @click="addBlockFromDefinition(item.type, item)"
            >
              <template #prepend>
                <v-avatar>
                  <v-icon size="large">{{
                    item.icon ? item.icon : "mdi-plus-circle"
                  }}</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title style="-webkit-line-clamp: 2">
                {{ $t(item.title) }}
              </v-list-item-title>

              <v-list-item-subtitle style="-webkit-line-clamp: 2">
                {{ $t(item.description) }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-group v-else no-action>
              <template #activator="{ props }">
                <v-list-item v-bind="props">
                  <template #prepend>
                    <v-avatar>
                      <v-icon size="large">{{
                        item.icon ? item.icon : "mdi-plus-circle"
                      }}</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title style="-webkit-line-clamp: 2">
                    {{ $t(item.title) }}
                  </v-list-item-title>
                  <v-list-item-subtitle style="-webkit-line-clamp: 2">
                    {{ $t(item.description) }}
                  </v-list-item-subtitle>
                </v-list-item>
              </template>

              <v-list-item
                v-for="(layout, index) in item.layouts"
                :key="layout.title"
                class="my-0 py-0"
                @click="addBlockFromDefinition(item.type, item, index)"
              >
                <v-list-item-title>
                  {{
                    $t("editorBlocks.display") +
                    " " +
                    (index + 1) +
                    " / " +
                    size(item.layouts)
                  }}</v-list-item-title
                >
              </v-list-item>
            </v-list-group>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import sectionAddDialogMixin from "@/mixins/sectionAddDialogMixin";
import BlockDefinition from "@/components/SiteBuilder/Blocks/BlockDefinition.js";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

import cloneDeep from "lodash/cloneDeep";
import defaults from "lodash/defaults";
import filter from "lodash/filter";
import size from "lodash/size";

import { mapMutations } from "vuex";
import { sync } from "vuex-pathify";
export default {
  mixins: [sectionAddDialogMixin],

  inject: ["getBlockInstanceByIndex"],
  setup() {
    const { user } = useAuthFrame();

    return {
      user
    };
  },
  data() {
    return {
      Grid: cloneDeep(BlockDefinition()["Grid"]),
      model: null
    };
  },

  computed: {
    ...sync({
      editor: "builder/editor"
    }),
    buttons() {
      const skip = [
        "Grid",
        "ProductsShow",
        "Content",
        "Image",
        "Video",
        "Gallery",
        "Carousel",
        "Features",
        "Maps"
      ];
      return filter(
        filter(cloneDeep(BlockDefinition()), p => !skip.includes(p.type))
      );
    }
  },

  methods: {
    size: structure => size(structure),
    ...mapMutations({
      addBlock: "builder/addBlock",
      selectBlock: "builder/selectBlock",
      toggleSectionAddDialog: "builder/toggleSectionAddDialog"
    }),

    async addBlockFromDefinition(
      type,
      definition,
      layoutIndex = 0,
      attrs = null
    ) {
      const themeDefault = {
        theme: this.$vuetify.theme.current.dark ? "dark" : "light"
      };
      const layout = cloneDeep(BlockDefinition())[type].layouts[layoutIndex];

      const block = {
        type,
        layout: layoutIndex,
        attrs: defaults(attrs, layout.attrs, definition.default, themeDefault)
      };

      const index = this.editor.selected ? this.editor.selected.index + 1 : -1;

      this.addBlock({ block, index });
      this.toggleSectionAddDialog();

      // TEMPORARY FIX
      await this.$nextTick();
      if (!this.editor.selected) {
        window.scrollTo({
          left: 0,
          top: document.body.scrollHeight,
          behavior: "smooth"
        });
      }
      // this.$nextTick(() => {
      //   const vm = this.getBlockInstanceByIndex(index);
      //   this.selectBlock(vm);
      //   this.goTo(vm.$el.offsetTop, { duration: 1000 });
      // });
    }
  }
};
</script>

<style scoped lang="scss"></style>
