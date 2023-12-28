<template>
  <v-hover v-slot="{ isHovering, props }" :disabled="!editorEnable">
    <grid-item
      v-bind="props"
      :x="x"
      :y="y"
      :w="w"
      :h="h"
      :i="i"
      drag-ignore-from=".no-drag"
      :is-draggable="editorEnable"
      :is-resizable="editorEnable"
      :class="{
        selected: editorEnable && (isHovering || isSelected),
        'grid-item': editorEnable
      }"
      @resized="$emit('update')"
      @moved="$emit('update')"
    >
      <div v-if="editorEnable && isHovering">
        <div class="ok-resizable-handle" :title="$t('builderBlockGrid.resize')">
          <div class="spanD"></div>
        </div>

        <div class="icons-layouts ma-1 remove">
          <v-icon
            dense
            color="red"
            :title="$t('components.editorPropsBlockTools.removeBlock')"
            @click="$emit('removeItem', i)"
            >mdi-delete</v-icon
          >
        </div>
        <div class="icons-layouts ma-1" style="right: 0; z-index: 90">
          <v-icon
            dense
            color="indigo"
            :title="$t('builderBlockGrid.edit')"
            @click="openLayoutProp"
            >mdi-cog
          </v-icon>
        </div>
      </div>
      <div v-if="editorEnable" class="dragElement"></div>
      <component
        :is="component"
        v-if="isValidBlock"
        ref="component"
        :index="index"
        :layout-index="layoutIndex"
        style="height: 100%; width: 100%"
        class="__inner"
        :layout="block.layout"
        :bucket="bucket"
        :block-attrs="componentAttrs"
        :font-scale="fontScale"
      ></component>
    </grid-item>
  </v-hover>
</template>

<script>
import GridItem from "@ouedkniss/ok-grid-layout/src/components/GridItem.vue";

import BlockDefinitionGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockDefinitionGrid.js";

import { mapMutations } from "vuex";
import { sync } from "vuex-pathify";
export default {
  components: { GridItem },
  inject: ["getBlockInstance", "getBlockInstanceByIndex"],

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
    },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    h: { type: Number, required: true },
    w: { type: Number, required: true },
    i: { type: Number, required: true },

    fontScale: {
      type: Number,
      required: false
    }
  },
  computed: {
    ...sync({ editorEnable: "builder/editor@enable" }),

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
  mounted() {
    this.$emit("update");
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
.dragElement {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
}
.ok-grid-item {
  &.resizing {
    opacity: 0.9;
  }
  &.no-drag {
    height: 100%;
    width: 100%;
  }
  .ok-resizable-handle {
    background: none !important;
    width: 15px;
    height: 15px;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 999;
    .spanD {
      bottom: -4px;
      right: -4px;
      content: "";
      width: 9px;
      height: 9px;
      background-color: #f9f9f9 !important;
      border: 1px solid rgba(255, 145, 0, 0.75);
      border-radius: 50%;
      position: absolute;
    }
    cursor: nwse-resize;
  }
}
.grid-item a {
  cursor: inherit !important;
}

.remove {
  z-index: 99;
  position: absolute;
  top: 0;
  left: 0;
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
    box-shadow: inset 0 0 5px rgba(255, 145, 0, 0.75);
  }
}

.icons-layouts {
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
