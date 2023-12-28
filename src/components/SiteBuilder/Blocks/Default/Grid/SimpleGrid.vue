<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="(block, indexGrid) in config.blocks"
        :key="indexGrid"
        :cols="cols"
      >
        <v-card color="transparent" width="100%">
          <div
            :class="{ editBlock: editorEnable }"
            style="height: 100%; width: 100%"
          >
            <v-card v-if="isEmpty(block)" color="transparent" height="100%">
              <div style="height: 250px">
                <v-btn
                  v-if="editorEnable"
                  light
                  icon
                  class="elevation-2"
                  absolute
                  style="left: calc(50% - 20px); top: calc(50% - 20px)"
                  :title="$t('blockAddDialog.title')"
                  @click="openDialog(indexGrid)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-card>
            <builder-block-simple-grid
              v-else
              :key="indexGrid + 'gridBlock'"
              style="height: 100%; width: 100%"
              :block="block"
              :index="indexGrid"
              :layout-index="index"
              :bucket="bucket"
              @removeItem="removeItem"
            >
            </builder-block-simple-grid>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NumberPropVue from "@/components/SiteBuilder/Props/NumberProp.vue";
import BuilderBlockSimpleGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BuilderBlockSimpleGrid.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";

import { ensureItemsCount } from "@/utils/array";
import { mapMutations, mapGetters } from "vuex";
import { sync } from "vuex-pathify";
import isEmpty from "lodash/isEmpty";
export default {
  components: { BuilderBlockSimpleGrid },
  mixins: [BlocksHelperMixin],
  inject: ["getBlockInstance", "getBlockInstanceByIndex"],
  editableProps: [
    {
      key: "numBlock",
      icon: "mdi-format-list-numbered",
      label: "components.featureEditor.props.itemsCount",
      field: NumberPropVue,
      bind: {
        min: 1,
        max: 4
      }
    }
  ],
  data() {
    return {
      addIndex: null,
      config: {
        numBlock: 2,
        blocks: [null, null]
      }
    };
  },
  computed: {
    ...mapGetters({
      selectedDefinition: "builder/selectedDefinition",
      selectedState: "builder/selectedState"
    }),
    ...sync({
      editorEnable: "builder/editor@enable",
      editor: "builder/editor"
    }),
    cols() {
      if (this.$isMobile && !this.$store.state.builder.editor.phone) {
        if (this.config.numBlock === 4) return 6;
        else return 12;
      } else return 12 / this.config.numBlock;
    }
  },
  watch: {
    config: {
      immediate: true,
      handler: "fill"
    }
  },
  methods: {
    ...mapMutations({
      hideEditor: "builder/hideEditor",
      selectGridBlock: "builder/selectGridBlock",
      changeEditorTab: "builder/changeEditorTab",
      selectBlock: "builder/selectBlock"
    }),

    isEmpty(block) {
      return isEmpty(block);
    },
    openDialog(indexGrid) {
      const vm = this.getBlockInstanceByIndex(this.index, this.bucket);
      this.selectBlock(vm);
      this.editor.simpleBlockAddDialog.indexBlock = indexGrid;
      this.editor.simpleBlockAddDialog.value =
        !this.editor.simpleBlockAddDialog.value;
    },

    removeItem: function (value) {
      this.config.blocks[value] = null;

      this.hideEditor();

      this.update();
    },
    fill() {
      this.config.blocks = ensureItemsCount(
        this.config.blocks,
        this.config.numBlock,
        () => null
      );
    }
  }
};
</script>

<style scoped lang="scss"></style>
