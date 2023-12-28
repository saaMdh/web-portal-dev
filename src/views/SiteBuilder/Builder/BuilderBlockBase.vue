<template>
  <v-theme-provider :theme="theme">
    <v-hover
      v-slot="{ isHovering, props }"
      :disabled="!(enableEdit && editor.enable)"
    >
      <v-card
        v-bind="props"
        variant="flat"
        class="o-block rounded-0"
        :class="{
          ['--width-' + blockAttrs.width]: blockAttrs.width > 0,
          ['--padding-' + blockAttrs.padding]: blockAttrs.padding > 0,
          ['--margin-' + blockAttrs.margin]: blockAttrs.margin > 0,
          '--selected': editor.enable && (isHovering || selected),
          '--selectable': !selected && editor.enable
        }"
        :style="{
          background: 'transparent',
          paddingTop:
            editor.enable && (type == 'Grid' || type == 'SimpleGrid')
              ? '35px'
              : null,
          paddingBottom: editor.enable && type == 'Grid' ? '35px' : null
        }"
      >
        <div
          v-if="enableEdit && editor.enable && (isHovering || selected)"
          class="icon-actions"
          style="top: 0; right: 0; border-radius: 100px"
        >
          <v-icon :title="$t('builderBlock.edit')" v-on="on">mdi-cog </v-icon>
        </div>
        <div
          v-if="
            enableEdit &&
            editor.enable &&
            (isHovering || selected) &&
            type == 'Grid'
          "
          class="icon-actions"
          style="bottom: 0; right: 0"
        >
          <v-icon
            :title="$t('blockAddDialog.title')"
            @click="openBlockAddDialog()"
            >mdi-plus</v-icon
          >
        </div>

        <div
          v-if="enableEdit && editor.enable && (isHovering || selected)"
          class="icon-actions"
          style="top: 0; left: 0"
        >
          <v-icon
            :disabled="!isAccessGranted('blocks')"
            :title="$t('_.delete')"
            @click="removeBlock"
            >mdi-delete</v-icon
          >
          <v-icon
            :disabled="!isAccessGranted('blocks') || index <= 0"
            light
            :title="$t('components.editorPages.actions.moveUp')"
            @click="shiftBlock(-1)"
            >mdi-chevron-up</v-icon
          >
          <v-icon
            :disabled="
              !isAccessGranted('blocks') || index >= blocksLengthBucket - 1
            "
            light
            :title="$t('components.editorPages.actions.moveDown')"
            @click="shiftBlock(1)"
            >mdi-chevron-down</v-icon
          >
        </div>
        <builder-block-base-background
          class="__background"
          :background="blockAttrs.background"
        ></builder-block-base-background>

        <div class="__inner">
          <slot></slot>
        </div>
      </v-card>
    </v-hover>
  </v-theme-provider>
</template>

<script>
import BuilderBlockBaseBackground from "@/views/SiteBuilder/Builder/BuilderBlockBaseBackground.vue";
import MessageBox from "@/mixins/MessageBox";

import { mapMutations, mapGetters } from "vuex";
import debounce from "lodash/debounce";
import { sync } from "vuex-pathify";
export default {
  components: { BuilderBlockBaseBackground },
  mixins: [MessageBox],
  inject: ["getBlockInstanceByIndex"],
  inheritAttrs: false,

  props: {
    index: {
      type: Number,
      required: true
    },
    bucket: {
      type: String,
      required: true
    },
    blockAttrs: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ""
    },
    enableEdit: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    ...sync({ editor: "builder/editor", theme: "builder/siteBuild@theme" }),
    ...mapGetters({
      blocksLengthBySelectedBucket: "builder/blocksLengthBySelectedBucket",
      blocksLengthByBucket: "builder/blocksLengthByBucket",
      blocksLength: "builder/blocksLength"
    }),
    theme() {
      if (this.bucket === "pages")
        return this.$vuetify.theme.current.dark ? "dark" : "light";
      else return this.blockAttrs.theme;
    },

    blocksLengthBucket() {
      return this.blocksLengthByBucket(this.bucket);
    },

    on() {
      if (
        this.editor.enable &&
        (!this.selected || !this.editor.drawer || this.editor.tab !== "props")
      )
        return {
          click: e => {
            this.editor.drawer = true;
            this.editor.tab = "props";
            this.$emit("select", e);
          }
        };

      return {
        click: () => {
          this.unselectBlock();
        }
      };
    }
  },
  methods: {
    ...mapMutations({
      shiftBlockByIndex: "builder/shiftBlockByIndex",
      selectBlock: "builder/selectBlock",
      unselectBlock: "builder/unselectBlock",
      addBlock: "builder/addBlock",
      changeEditorTab: "builder/changeEditorTab",
      hideEditor: "builder/hideEditor",
      removeBlockByIndex: "builder/removeBlockByIndex"
    }),
    openBlockAddDialog() {
      this.editor.blockAddDialog = !this.editor.blockAddDialog;
      this.hideEditor();
      this.$emit("select", this);
    },

    shiftBlock(shift) {
      this.$emit("select", this);
      const index = this.editor.selected.index;
      const bucket = this.editor.selected.bucket;
      const toIndex = Math.min(
        Math.max(index + shift, 0),
        this.blocksLengthBucket - 1
      );

      this.shiftBlockByIndex({ index, toIndex, bucket });

      this.$nextTick(() => {
        const vm = this.getBlockInstanceByIndex(toIndex, bucket);
        this.selectBlock(vm);
      });

      this.selectAndHighlightBlock(toIndex, bucket);
    },
    async removeBlock() {
      this.hideEditor();
      const confirm = await this.$confirm({
        icon: "mdi-delete",
        title: this.$t(
          "components.editorPropsBlockTools.removeBlockDialog.title"
        ),
        message: this.$t(
          "components.editorPropsBlockTools.removeBlockDialog.message"
        )
      });

      if (!confirm) return;

      this.removeBlockByIndex({ index: this.index, bucket: this.bucket });
    },

    selectAndHighlightBlock: debounce(function (toIndex, bucket) {
      const vm = this.getBlockInstanceByIndex(toIndex, bucket);
      this.goTo(vm.$el.offsetTop, {
        duratrion: 2000,
        offset: 300
      });
    }, 300)
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive";
.icon-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  margin: 4px;
  background-color: #f9f9f9;
  .v-icon {
    margin: 2px;
    color: #2f333a;
  }
  position: absolute;
  z-index: 90;
}

.o-block {
  // position: relative;
  // background-position: center !important;

  // display: flex;
  // align-items: center;

  // overflow: hidden;

  > .__background {
    z-index: 1;
  }

  > .__inner {
    position: relative;
    width: 100%;
    z-index: 2;
  }

  &.v-theme--light.v-sheet,
  &.v-theme--dark.v-sheet {
    background-color: transparent !important;
  }

  &.--selected {
    z-index: 30;

    &:after {
      content: "";
      z-index: 30;
      pointer-events: none;

      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;

      border: 1px solid rgba(0, 255, 255, 0.75);
      box-shadow: inset 0 0 14px rgba(0, 255, 255, 0.75);
    }
  }

  $widthSteps: 1200px, 992px, 768px, 576px, 360px;

  @for $i from 1 through 5 {
    &.--width-#{$i} {
      > .__inner {
        margin: auto;
        max-width: nth($widthSteps, $i);
      }
    }
  }
  $paddingSteps: 8px, 16px, 24px, 32px, 48px, 96px, 144px, 192px, 240px;

  @for $i from 1 through 9 {
    &.--padding-#{$i} {
      padding: (nth($paddingSteps, $i) * 0.4) 0;

      @include isDesktop {
        padding: nth($paddingSteps, $i) 0;
      }
    }
  }

  $marginSteps: 8px, 16px, 24px, 32px, 48px, 96px, 144px, 192px, 240px;

  @for $i from 1 through 9 {
    &.--margin-#{$i} {
      margin: (nth($marginSteps, $i) * 0.4) 0;

      @include isDesktop {
        margin: nth($marginSteps, $i) 0;
      }
    }
  }
}
</style>
