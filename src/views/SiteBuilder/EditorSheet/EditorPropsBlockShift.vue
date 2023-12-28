<template>
  <div class="d-flex justify-space-between align-center pa-4">
    <v-btn icon :disabled="!isAccessGranted('blocks')" @click="shiftBlock(-1)">
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>

    <span
      >{{ $t("components.editorPropsBlockShift.position") }} #{{
        editor.selected.index + 1
      }}</span
    >

    <v-btn icon :disabled="!isAccessGranted('blocks')" @click="shiftBlock(1)">
      <v-icon>mdi-chevron-down</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { sync } from "vuex-pathify";
import debounce from "lodash/debounce";

export default {
  inject: ["getBlockInstanceByIndex"],

  computed: {
    ...sync({ editor: "builder/editor" }),
    ...mapGetters({
      blocksLengthBySelectedBucket: "builder/blocksLengthBySelectedBucket"
    })
  },

  methods: {
    ...mapMutations({
      shiftBlockByIndex: "builder/shiftBlockByIndex",
      selectBlock: "builder/selectBlock"
    }),

    shiftBlock(shift) {
      const index = this.editor.selected.index;
      const bucket = this.editor.selected.bucket;
      const toIndex = Math.min(
        Math.max(index + shift, 0),
        this.blocksLengthBySelectedBucket - 1
      );

      this.shiftBlockByIndex({ index, toIndex, bucket });

      this.$nextTick(() => {
        const vm = this.getBlockInstanceByIndex(toIndex, bucket);
        this.selectBlock(vm);
        this.editor.drawer = true;
      });

      this.selectAndHighlightBlock(toIndex, bucket);
    },

    selectAndHighlightBlock: debounce(function(toIndex, bucket) {
      const vm = this.getBlockInstanceByIndex(toIndex, bucket);
      this.goTo(vm.$el.offsetTop, {
        duratrion: 2000,
        offset: 300
      });
    }, 300)
  }
};
</script>

<style></style>
