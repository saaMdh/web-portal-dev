<template>
  <v-list dense>
    <v-list-item
      :input-value="isPinnedOnHeader"
      :disabled="!isAccessGranted('blocks')"
      active-class="primary"
      @click="togglePinBlockOnHeaders"
    >
      <template #prepend>
        <v-icon>mdi-page-layout-header</v-icon>
      </template>
      <v-list-item-title>
        {{ $t("components.editorPropsBlockTools.isPinnedOnHeader") }}
      </v-list-item-title>
      <template #append="{ isActive }">
        <v-icon v-if="isActive"> mdi-checkbox-outline </v-icon>
      </template>
    </v-list-item>

    <v-list-item
      :input-value="isPinnedOnFooter"
      :disabled="!isAccessGranted('blocks')"
      active-class="primary"
      @click="togglePinBlockOnFooters"
    >
      <template #prepend>
        <v-icon>mdi-page-layout-footer</v-icon>
      </template>
      <v-list-item-title>
        {{ $t("components.editorPropsBlockTools.isPinnedOnFooter") }}
      </v-list-item-title>
      <template #append="{ isActive }">
        <v-icon v-if="isActive"> mdi-checkbox-outline </v-icon>
      </template>
    </v-list-item>

    <v-list-item
      :disabled="!isAccessGranted('blocks')"
      class="text-red"
      @click="removeBlock"
    >
      <template #prepred>
        <v-icon color="red">mdi-delete</v-icon>
      </template>
      <v-list-item-title>
        {{ $t("components.editorPropsBlockTools.removeBlock") }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
import MessageBox from "@/mixins/MessageBox";

import { mapGetters, mapMutations } from "vuex";
import { sync } from "vuex-pathify";

export default {
  mixins: [MessageBox],

  inject: [
    "getBlockInstanceByIndex",
    "isBlockPinnedOnHeader",
    "isBlockPinnedOnFooter"
  ],

  data() {
    return {
      hotkeyRemoveBlockHandler: this.hotkeyRemoveBlock.bind(this),
      nonDeletableBlocks: ["ProductsShow"]
    };
  },

  computed: {
    ...sync({ editor: "builder/editor", siteBuild: "builder/siteBuild" }),
    ...mapGetters({
      currentPage: "builder/currentPage"
    }),

    tab() {
      return this.editor.tab;
    },

    isPinnedOnHeader() {
      return this.isBlockPinnedOnHeader(this.editor.selected);
    },

    isPinnedOnFooter() {
      return this.isBlockPinnedOnFooter(this.editor.selected);
    }
  },
  mounted() {
    this.tab;
    window.addEventListener("keyup", this.hotkeyRemoveBlockHandler);
  },
  beforeUnmount() {
    window.removeEventListener("keyup", this.hotkeyRemoveBlockHandler);
  },
  methods: {
    ...mapMutations({
      changeEditorTab: "builder/changeEditorTab",
      selectBlock: "builder/selectBlock",
      cloneBlockByIndex: "builder/cloneBlockByIndex",
      moveBlockByIndex: "builder/moveBlockByIndex",
      removeBlockByIndex: "builder/removeBlockByIndex",
      unselectBlock: "builder/unselectBlock",
      pinBlockOnHeaders: "builder/pinBlockOnHeaders",
      pinBlockOnFooters: "builder/pinBlockOnFooters",
      unpinBlockFromHeaders: "builder/unpinBlockFromHeaders",
      unpinBlockFromFooters: "builder/unpinBlockFromFooters",
      toggleSectionAddDialog: "builder/toggleSectionAddDialog",
      hideEditor: "builder/hideEditor"
    }),

    async removeBlock() {
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

      const { index, bucket } = this.editor.selected;
      const { block } = this.getBlockInstanceByIndex(index, bucket);
      if (!this.nonDeletableBlocks.includes(block.type)) {
        this.unselectBlock();
        this.removeBlockByIndex({ index, bucket });
      } else {
        const alert = await this.$alert({
          icon: "mdi-alert",
          title: this.$t(
            "components.editorPropsBlockTools.removeBlockDialogForbidden.title"
          ),
          message: this.$t(
            "components.editorPropsBlockTools.removeBlockDialogForbidden.message"
          )
        });
        if (!alert) return;
      }
    },

    async cloneBlock() {
      const { index, bucket } = this.editor.selected;

      this.unselectBlock();
      this.cloneBlockByIndex({ index, bucket });
    },

    async moveBlock(indexBucket) {
      const { index, bucket } = this.editor.selected;

      this.unselectBlock();
      this.moveBlockByIndex({ index, bucket, indexBucket });
    },

    showNewBlockPanel() {
      this.toggleSectionAddDialog();
      //this.hideEditor();
    },

    togglePinBlockOnHeaders() {
      if (this.isPinnedOnHeader) {
        this.unpinBlockFromHeaders(this.editor.selected.index);
        this.unselectBlock();

        this.$nextTick(() => {
          const vm = this.getBlockInstanceByIndex(0, "pages");
          this.selectBlock(vm);
        });
      } else {
        this.pinBlockOnHeaders({
          index: this.editor.selected.index,
          bucket: this.editor.selected.bucket
        });
        this.unselectBlock();

        this.$nextTick(() => {
          const vm = this.getBlockInstanceByIndex(-1, "headers");
          this.selectBlock(vm);
        });
      }
    },

    togglePinBlockOnFooters() {
      if (this.isPinnedOnFooter) {
        this.unpinBlockFromFooters(this.editor.selected.index);
        this.unselectBlock();

        this.$nextTick(() => {
          const vm = this.getBlockInstanceByIndex(0, "pages");
          this.selectBlock(vm);
        });
      } else {
        this.pinBlockOnFooters({
          index: this.editor.selected.index,
          bucket: this.editor.selected.bucket
        });
        this.unselectBlock();

        this.$nextTick(() => {
          const vm = this.getBlockInstanceByIndex(-1, "footers");
          this.selectBlock(vm);
        });
      }
    },
    hotkeyRemoveBlock(event) {
      if (event.keyCode === 46) {
        this.removeBlock();
      }
    }
  }
};
</script>
