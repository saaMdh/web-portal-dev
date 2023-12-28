<template>
  <div>
    <v-hover v-slot="{ isHovering, props }" :disabled="!editorEnable">
      <div
        ref="simpleGrid"
        v-bind="props"
        :class="{
          selected: editorEnable && (isHovering || isSelected)
        }"
      >
        <div
          v-if="editorEnable && isHovering"
          class="icons-simple-layouts"
          style="left: 0; bottom: 0"
        >
          <v-icon
            color="red"
            :title="$t('components.editorPropsBlockTools.removeBlock')"
            @click="$emit('removeItem', index)"
            >mdi-delete</v-icon
          >
        </div>
        <div
          v-if="editorEnable && isHovering"
          class="icons-simple-layouts"
          style="right: 0; z-index: 90"
        >
          <v-icon
            color="indigo"
            :title="$t('builderBlockGrid.edit')"
            @click="openLayoutProp"
            >mdi-cog
          </v-icon>
        </div>
        <component
          :is="component"
          v-if="isValidBlock"
          ref="component"
          :index="index"
          :layout-index="layoutIndex"
          style="height: 100%; width: 100%"
          :style="$isMobile ? `` : `max-height:${width}px`"
          class="__inner"
          :layout="block.layout"
          :bucket="bucket"
          :block-attrs="componentAttrs"
          :width="width"
        ></component>
      </div>
    </v-hover>
  </div>
</template>

<script>
import BlockDefinitionGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockDefinitionGrid.js";

import { useElementSize } from "@vueuse/core";

import { mapMutations } from "vuex";
import { sync } from "vuex-pathify";
import { ref } from "vue";
export default {
  inject: ["getBlockInstanceByIndex"],
  props: {
    index: {
      type: Number,
      required: true
    },
    layoutIndex: {
      type: Number,
      required: true
    },
    bucket: {
      type: String,
      required: true
    },
    block: {
      type: Object,
      required: true
    }
  },
  emits: ["removeItem"],
  setup() {
    const simpleGrid = ref(null);
    const { width, height } = useElementSize(simpleGrid);

    return {
      simpleGrid,
      width,
      height
    };
  },

  computed: {
    ...sync({
      editorEnable: "builder/editor@enable",
      editor: "builder/editor"
    }),

    isValidBlock() {
      try {
        if (!this.block.type)
          throw new Error(`Missing required field 'type' for block definition`);

        if (!(this.block.type in BlockDefinitionGrid))
          throw new Error(`Undefined block type '${this.block.type}'`);

        return true;
      } catch (error) {
        // eslint-disable-next-line
        console.warn(`[Parse] Invalid block config`, error);
        return false;
      }
    },
    isSelected() {
      return this.$store.state.builder.editor.selectedGridBlock === this;
    },
    component() {
      let { type, layout } = this.block;

      if (layout >= BlockDefinitionGrid[type].layouts.length)
        layout = BlockDefinitionGrid[type].layouts.length - 1;
      return BlockDefinitionGrid[type].layouts[layout].component;
    },

    componentAttrs() {
      let { type, layout } = this.block;

      if (layout >= BlockDefinitionGrid[type].layouts.length)
        layout = BlockDefinitionGrid[type].layouts.length - 1;

      const layoutDefault = BlockDefinitionGrid[type].layouts[layout].attrs;
      const blockAttrs = this.block.attrs;

      return {
        ...layoutDefault,
        ...blockAttrs
      };
    }
  },
  methods: {
    ...mapMutations({
      selectGridBlock: "builder/selectGridBlock",
      changeEditorTab: "builder/changeEditorTab",
      selectBlock: "builder/selectBlock",
      unselectBlock: "builder/unselectBlock"
    }),
    openLayoutProp(event) {
      event.preventDefault();
      event.stopPropagation();
      if (
        this.editorEnable &&
        (!this.isSelected ||
          !this.$store.state.builder.editor.drawer ||
          this.$store.state.builder.editor.tab !== "props-grid")
      ) {
        const vm = this.getBlockInstanceByIndex(this.layoutIndex, this.bucket);

        this.selectBlock(vm);
        this.selectGridBlock(this);
        this.changeEditorTab("props-grid");
      } else this.unselectBlock();
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive";
.editBlock {
  border: 1px dashed;
  border-radius: 4px;
}
.selected {
  &:after {
    content: "";
    z-index: 30;
    pointer-events: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border: 1px solid rgba(255, 145, 0, 0.75);
    box-shadow: inset 0 0 14px rgba(255, 145, 0, 0.75);
  }
}

.icons-simple-layouts {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 18px;
  margin: 1px;
  background-color: #f9f9f9 !important;
  position: absolute;
  z-index: 90;
  .v-icon {
    margin: 2px;
  }
}
</style>
