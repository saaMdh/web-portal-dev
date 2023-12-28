import { mapGetters, mapMutations } from "vuex";
import { sync } from "vuex-pathify";

import get from "lodash/get";

export default {
  computed: {
    ...sync({ editor: "builder/editor" }),
    ...mapGetters({
      selectedGridBlockDefinition: "builder/selectedGridBlockDefinition",
      selectedGridBlockState: "builder/selectedGridBlockState"
    }),
    blockAttrs() {
      return get(this.selectedGridBlockState, "attrs", {});
    }
  },

  methods: {
    ...mapMutations({
      updateGridBlockAttr: "builder/updateGridBlockAttr",
      changeEditorTab: "builder/changeEditorTab",
      unselectBlock: "builder/unselectBlock",
      hideEditor: "builder/hideEditor"
    }),

    setAttrValue(key, value) {
      if (this.editor.selectedGridBlock)
        this.updateGridBlockAttr({
          layoutIndex: this.editor.selectedGridBlock.layoutIndex,
          index: this.editor.selectedGridBlock.index,
          bucket: this.editor.selectedGridBlock.bucket,
          key,
          value
        });
    },

    cancel() {
      this.hideEditor();
      this.unselectBlock();
    }
  }
};
