<template>
  <v-dialog
    v-if="$store.state.builder.editor.selected"
    v-model="editor.blockAddDialog"
    :max-width="700"
    dark
    scrollable
  >
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar>
          <v-toolbar-title>{{ $t("blockAddDialog.title") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editor.blockAddDialog = false">
            <v-icon>
              {{ "mdi-close" }}
            </v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <v-card-text class="pa-8">
        <v-row>
          <v-col v-for="item in buttons" :key="item.title" cols="4">
            <v-card
              height="100%"
              color="grey-darken-3"
              @click="addBlockFromDefinition(item.type, item)"
            >
              <v-icon
                size="x-large"
                class=" d-flex justify-center align-center pt-4"
                >{{ item.icon ? item.icon : "mdi-plus-circle" }}</v-icon
              >
              <v-card-text class="text-center">
                {{ $t(item.title) }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import BlockDefinitionGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockDefinitionGrid";

import { mapMutations, mapGetters } from "vuex";
import { sync } from "vuex-pathify";

import defaults from "lodash/defaults";
import size from "lodash/size";
import cloneDeep from "lodash/cloneDeep";
import filter from "lodash/filter";
export default {
  components: {},
  mixins: [],

  computed: {
    ...mapGetters({
      selectedDefinition: "builder/selectedDefinition",
      selectedState: "builder/selectedState",
      market: "builder/market"
    }),
    ...sync({ editor: "builder/editor" }),
    buttons() {
      let skip = ["Features", "Content"];
      if (this.market) skip.push("ContactInformation", "Map");
      return filter(
        filter(cloneDeep(BlockDefinitionGrid), p => !skip.includes(p.type))
      );
    },
    blockAttrs() {
      return this.selectedState.attrs;
    }
  },
  methods: {
    ...mapMutations({
      updateBlock: "builder/updateBlock",
      updateBlockAttr: "builder/updateBlockAttr"
    }),
    setAttrValue(key, value) {
      this.updateBlockAttr({
        index: this.editor.selected.index,
        bucket: this.editor.selected.bucket,
        key,
        value
      });
    },
    addItem: function(block, size) {
      // Add a new item.

      this.blockAttrs.blocks[
        Math.max(...this.blockAttrs.layouts["md"].map(el => el.i), 0) + 1
      ] = block;
      this.setAttrValue("blocks", this.blockAttrs.blocks);
      this.blockAttrs.layouts["md"].push({
        x: 0,
        y:
          Math.max(...this.blockAttrs.layouts["md"].map(el => el.y), 0) +
          Math.max(...this.blockAttrs.layouts["md"].map(el => el.h), 0), // puts it at the bottom
        w: size.w,
        h: size.h,
        i: Math.max(...this.blockAttrs.layouts["md"].map(el => el.i), 0) + 1
      });
      this.setAttrValue('layouts["md"]', this.blockAttrs.layouts["md"]);
      this.blockAttrs.layouts["xs"].push({
        x: 0,
        y:
          Math.max(...this.blockAttrs.layouts["xs"].map(el => el.y), 0) +
          Math.max(...this.blockAttrs.layouts["xs"].map(el => el.h), 0), // puts it at the bottom
        w: size.w,
        h: size.h,
        i: Math.max(...this.blockAttrs.layouts["xs"].map(el => el.i), 0) + 1
      });
      this.setAttrValue('layouts["xs"]', this.blockAttrs.layouts["xs"]);
    },

    size: structure => size(structure),

    addBlockFromDefinition(type, definition, layoutIndex = 0) {
      const layout = cloneDeep(BlockDefinitionGrid)[type].layouts[layoutIndex];
      const size = cloneDeep(BlockDefinitionGrid)[type].size;

      const block = {
        type,
        layout: layoutIndex,
        attrs: defaults(
          layout.attrs,
          cloneDeep(BlockDefinitionGrid)[type].default
        )
      };

      this.addItem(block, size);
      this.editor.blockAddDialog = false;
    }
  }
};
</script>

<style scoped></style>
