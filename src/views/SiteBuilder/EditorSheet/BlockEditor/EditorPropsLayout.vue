<template>
  <div class="s-editor-props">
    <v-list v-if="editableLayoutProps && editableLayoutProps.length > 0" dense>
      <template v-for="item in editableLayoutProps">
        <v-list-group v-if="active(item)" :key="item.key">
          <template #activator="{ props }">
            <v-list-item v-bind="props" :title="$t(item.label)">
              <template #prerend>
                <v-icon>{{ item.icon }}</v-icon>
              </template>
            </v-list-item>
          </template>
          <v-list-item class="ma-4">
            <component
              v-bind="item.bind"
              :is="item.field"
              :label="item.label"
              :model-value="getAttrValue(item.key)"
              @update:modelValue="v => setAttrValue(item.key, v)"
            ></component>
          </v-list-item>

          <v-divider></v-divider>
        </v-list-group>
      </template>
    </v-list>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { sync } from "vuex-pathify";
import isFunction from "lodash/isFunction";
import get from "lodash/get";
export default {
  components: {},

  computed: {
    ...mapGetters({
      selectedGridBlockDefinition: "builder/selectedGridBlockDefinition",
      selectedGridBlockState: "builder/selectedGridBlockState"
    }),
    ...sync({
      editor: "builder/editor"
    }),

    editableLayoutProps() {
      var vm = this.editor.selectedGridBlock
        ? this.editor.selectedGridBlock.$refs.component
        : null;

      const componentProps = vm && get(vm.$options, "editableProps", null);

      if (componentProps) {
        const blockProps = isFunction(componentProps)
          ? componentProps.bind(vm)()
          : componentProps;

        return [...blockProps];
      }

      return "";
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
      this.updateGridBlockAttr({
        layoutIndex: this.editor.selectedGridBlock.layoutIndex,
        index: this.editor.selectedGridBlock.index,
        bucket: this.editor.selectedGridBlock.bucket,
        key,
        value
      });
    },

    getAttrValue(key) {
      const defaultVal = get(this.editor.selectedGridBlock.config, key, null);
      return get(this.selectedGridBlockState.attrs, key, defaultVal);
    },
    active(item) {
      return item.active == undefined || item.active == true;
    },
    cancel() {
      this.hideEditor();
    }
  }
};
</script>

<style lang="scss">
.s-editor-props {
  &__info {
    width: 100%;

    tr th {
      width: 40%;
      text-align: left;
    }
  }
}
</style>
