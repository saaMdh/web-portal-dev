<template>
  <builder-block-base
    :index="index"
    :bucket="bucket"
    :block-attrs="componentAttrs"
    :selected="isSelected"
    :type="block.type"
    :enable-edit="enableEdit"
    @select="select"
  >
    <component
      :is="component"
      v-if="isValidBlock"
      ref="component"
      :layout="block.layout"
      :index="index"
      :bucket="bucket"
      :block-attrs="componentAttrs"
    ></component>
  </builder-block-base>
</template>

<script>
import BuilderBlockBase from "@/views/SiteBuilder/Builder/BuilderBlockBase.vue";

import BlockDefinition from "@/components/SiteBuilder/Blocks/BlockDefinition.js";
import { CommonBlockDefault } from "@/components/SiteBuilder/Blocks/BlockHelperMixin.js";
import { isDark } from "@/utils/colors";

import { mapMutations } from "vuex";
import get from "lodash/get";

export default {
  components: {
    BuilderBlockBase
  },

  provide() {
    return {
      getBlockInstance: this.getBlockInstance
    };
  },

  props: {
    index: {
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
    enableEdit: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    isValidBlock() {
      try {
        if (!this.block.type)
          throw new Error(`Missing required field 'type' for block definition`);

        if (!(this.block.type in BlockDefinition()))
          throw new Error(`Undefined block type '${this.block.type}'`);

        return true;
      } catch (error) {
        // eslint-disable-next-line
        console.warn(`[Parse] Invalid block config`, error);
        return false;
      }
    },

    component() {
      let { type, layout } = this.block;

      if (layout >= BlockDefinition()[type].layouts.length)
        layout = BlockDefinition()[type].layouts.length - 1;

      return BlockDefinition()[type].layouts[layout].component;
    },

    componentAttrs() {
      let { type, layout } = this.block;

      if (layout >= BlockDefinition()[type].layouts.length)
        layout = BlockDefinition()[type].layouts.length - 1;

      const themeDefault = {
        theme: this.$vuetify.theme.current.dark ? "dark" : "light"
      };

      const layoutDefault = BlockDefinition()[type].layouts[layout].attrs;
      const blockAttrs = { ...this.block.attrs };

      blockAttrs.theme = this.$vuetify.theme.current.dark ? "dark" : "light";
      const color = get(
        blockAttrs.background,
        "gradient[0]",
        get(this.$store.state.builder.siteBuild.theme, "backgroundColor")
      );
      if (color && isDark(color)) blockAttrs.theme = "dark";
      if (color && !isDark(color)) blockAttrs.theme = "light";

      return {
        ...CommonBlockDefault,
        ...themeDefault,
        ...layoutDefault,
        ...blockAttrs
      };
    },

    isSelected() {
      return this.$store.state.builder.editor.selected === this;
    }
  },

  methods: {
    ...mapMutations({ selectBlock: "builder/selectBlock" }),

    select() {
      this.selectBlock(this);
    },

    getBlockInstance() {
      return this;
    }
  }
};
</script>

<style></style>
