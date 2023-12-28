<template>
  <div :key="$isMobile" ref="grid">
    <v-hover v-slot="{ isHovering, props }" :disabled="!editorEnable">
      <v-card
        v-bind="props"
        :key="marginGrid"
        color="transparent"
        tile
        :style="`--r: ${row}px; --m:${marginGrid}px;--c:${cols}`"
        :class="{ grid: editorEnable && isHovering }"
      >
        <grid-layout
          :layout="GridLayout"
          :col-num="cols"
          :breakpoints="{ md: 960, xs: 0 }"
          :row-height="row"
          :margin="[marginGrid, marginGrid]"
          :is-draggable="false"
          :is-resizable="false"
          :vertical-compact="false"
          :use-css-transforms="false"
          :style="config.layouts[mobile].length < 1 ? 'height:250px' : ''"
          :transform-scale="rescale"
          :allow-overlap="config.allowOverlap"
          :is-mirrored="$vuetify.rtl"
        >
          <v-card
            v-for="item in GridLayout"
            :key="item.i"
            color="trasparent"
            @contextmenu="show($event, item.i)"
          >
            <builder-block-grid
              :block="config.blocks[item.i]"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :font-scale="fontScale"
              :index="item.i"
              :layout-index="index"
              :bucket="bucket"
              :style="`z-index:${item.i}`"
              @update="update"
              @removeItem="removeItem"
            >
            </builder-block-grid>
          </v-card>
        </grid-layout>
      </v-card>
    </v-hover>
    <v-menu
      v-if="editorEnable && config.allowOverlap"
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-card>
        <v-card-subtitle>{{ "z-index: " + i }}</v-card-subtitle>
        <v-list-item
          :disabled="i >= Math.max(...config.layouts['md'].map(el => el.i))"
          @click="shiftBlock(i, +1)"
        >
          <template #prepend>
            <v-icon>mdi-arrange-bring-forward</v-icon>
          </template>
          <span>
            <v-list-item-title>{{
              $t("builderBlockGrid.bringForward")
            }}</v-list-item-title>
          </span>
        </v-list-item>
        <v-list-item
          :disabled="i <= Math.min(...config.layouts['md'].map(el => el.i))"
          @click="shiftBlock(i, -1)"
        >
          <template #prepend>
            <v-icon>mdi-arrange-send-backward</v-icon>
          </template>
          <span>
            <v-list-item-title>{{
              $t("builderBlockGrid.sendBackword")
            }}</v-list-item-title>
          </span>
        </v-list-item>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import GridLayout from "@ouedkniss/ok-grid-layout/src/components/GridLayout.vue";
import BooleanPropVue from "@/components/SiteBuilder/Props/BooleanProp.vue";
import BuilderBlockGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BuilderBlockGrid.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";

import { useElementSize } from "@vueuse/core";
import { mapMutations } from "vuex";
import { sync } from "vuex-pathify";
import { ref } from "vue";
export default {
  components: {
    GridLayout,
    BuilderBlockGrid
  },
  mixins: [BlocksHelperMixin],
  setup() {
    const grid = ref(null);
    const { width, height } = useElementSize(grid);

    return {
      grid,
      width,
      height
    };
  },
  editableProps: [
    {
      key: "allowOverlap",
      icon: "mdi-arrange-bring-to-front",
      label: "editorBlocks.allowOverlap",
      field: BooleanPropVue
    }
  ],
  data() {
    return {
      showMenu: false,
      x: 0,
      y: 0,
      i: null,
      config: {
        allowOverlap: false,
        layouts: {
          md: [],
          xs: []
        },
        blocks: {}
      }
    };
  },
  computed: {
    ...sync({
      editorEnable: "builder/editor@enable",
      editorDrawer: "builder/editor@drawer"
    }),
    mobile() {
      return this.$isMobile ? "xs" : "md";
    },
    cols() {
      if (this.$isDesktop) return 24;
      else return 8;
    },
    marginGrid() {
      return this.width / (this.cols * 10);
    },
    row() {
      return (this.width - this.marginGrid * (this.cols + 1)) / this.cols;
    },
    rescale() {
      if (
        this.editorEnable &&
        this.editorDrawer &&
        !this.$vuetify.display.lgAndUp
      )
        return 1 - 350 / document.body.clientWidth;
      else return 1;
    },
    fontScale() {
      if (this.$isMobile) {
        return (this.width / 400) * 100;
      } else return (this.width / 1200) * 100;
    },
    GridLayout() {
      return this.config.layouts[this.mobile].filter(
        item =>
          this.config.blocks[item.i] &&
          this.config.blocks[item.i].attrs.hideOn !== this.mobile
      );
    }
  },
  methods: {
    ...mapMutations({ hideEditor: "builder/hideEditor" }),
    show(event, i) {
      event.preventDefault();
      this.showMenu = false;
      this.x = event.clientX;
      this.y = event.clientY;
      this.i = i;
      this.$nextTick(() => {
        this.showMenu = this.editorEnable;
      });
    },

    removeItem: function (value) {
      delete this.config.blocks[value];
      const indexMD = this.config.layouts["md"]
        .map(item => item.i)
        .indexOf(value);

      this.config.layouts["md"].splice(indexMD, 1);
      const indexXS = this.config.layouts["xs"]
        .map(item => item.i)
        .indexOf(value);
      this.config.layouts["xs"].splice(indexXS, 1);
      this.hideEditor();

      this.update();
    },
    shiftBlock(index, shift) {
      this.hideEditor();
      const from = this.config.layouts.md.findIndex(
        el => el.i == parseInt(index)
      );

      const toIndex = Math.max(
        Math.min(
          parseInt(index) + shift,
          Math.max(...this.config.layouts["md"].map(el => el.i))
        ),
        0
      );

      const to = this.config.layouts.md.findIndex(
        el => el.i == parseInt(toIndex)
      );

      if (index === toIndex) return;

      const md = this.config.layouts.md[from].i;
      this.config.layouts.md[from].i = this.config.layouts.md[to].i;
      this.config.layouts.md[to].i = md;

      const xs = this.config.layouts.xs[from].i;
      this.config.layouts.xs[from].i = this.config.layouts.xs[to].i;
      this.config.layouts.xs[to].i = xs;

      const block = this.config.blocks[index];
      this.config.blocks[index] = this.config.blocks[toIndex];
      this.config.blocks[toIndex] = block;

      this.update();
    }
  }
};
</script>

<style scoped lang="scss">
.grid {
  height: 100%;
  width: 100%;
  background-color: #f3f3f3b3 !important;
  background-image: linear-gradient(#ffffffb3 var(--m), transparent 0),
    linear-gradient(90deg, #ffffffb3 var(--m), transparent 0);
  &.v-theme--dark {
    background-color: #464646b3 !important;
    background-image: linear-gradient(#838282b3 var(--m), transparent 0),
      linear-gradient(90deg, #838282b3 var(--m), transparent 0);
  }
  background-size: calc(calc(100% - var(--m)) / var(--c))
    calc(calc(var(--r)) + var(--m));
  background-repeat: repeat;
}
</style>
