<template>
  <v-dialog
    v-if="$store.state.builder.editor.selected"
    v-model="editor.simpleBlockAddDialog.value"
    max-width="700"
    dark
  >
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar>
          <v-toolbar-title>{{ $t("blockAddDialog.title") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="editor.simpleBlockAddDialog.value = false">
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
              <v-card-text
                class="d-flex justify-center align-center flex-column pt-4 text-center"
              >
                <v-icon size="x-large">{{
                  item.icon ? item.icon : "mdi-plus-circle"
                }}</v-icon>
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

import cloneDeep from "lodash/cloneDeep";
import defaults from "lodash/defaults";
import filter from "lodash/filter";
import size from "lodash/size";

import { mapMutations, mapGetters } from "vuex";
import { sync } from "vuex-pathify";
export default {
  components: {},
  mixins: [],
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      selectedDefinition: "builder/selectedDefinition",
      selectedState: "builder/selectedState",
      market: "builder/market"
    }),
    ...sync({ editor: "builder/editor" }),
    blockAttrs() {
      return this.selectedState.attrs;
    },
    buttons() {
      let skip = ["Icon", "Button", "Spacer"];
      if (this.market) skip.push("ContactInformation", "Map");
      return filter(
        filter(cloneDeep(BlockDefinitionGrid), p => !skip.includes(p.type))
      );
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

    size: structure => size(structure),

    addBlockFromDefinition(type, definition, layoutIndex = 0) {
      const layout = cloneDeep(BlockDefinitionGrid)[type].layouts[layoutIndex];

      const block = {
        type,
        layout: layoutIndex,
        attrs: defaults(
          layout.attrs,
          cloneDeep(BlockDefinitionGrid)[type].default
        )
      };

      this.blockAttrs.blocks[this.editor.simpleBlockAddDialog.indexBlock] =
        block;

      this.setAttrValue("blocks", this.blockAttrs.blocks);
      this.editor.simpleBlockAddDialog.value = false;
    }
  }
};
</script>

<style scoped></style>
