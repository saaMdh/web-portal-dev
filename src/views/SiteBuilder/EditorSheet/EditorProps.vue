<template>
  <div class="s-editor-props">
    <v-toolbar>
      <v-toolbar-title>
        #{{ editor.selected.index + 1 }} {{ $t(selectedDefinition.title) }}
      </v-toolbar-title>
      <v-btn icon @click="hideEditor">
        <v-icon>
          {{ "mdi-close" }}
        </v-icon>
      </v-btn>
    </v-toolbar>

    <v-divider></v-divider>

    <editor-props-block-shift></editor-props-block-shift>

    <v-divider></v-divider>

    <editor-props-block-layout></editor-props-block-layout>

    <v-divider></v-divider>

    <v-list dense>
      <template v-for="item in editableProps">
        <v-list-group v-if="active(item)" :key="item.key" no-action>
          <template #activator="{ props }">
            <v-list-item v-bind="props">
              <template #prepend>
                <v-icon>{{ item.icon }}</v-icon>
              </template>
              <span>
                <v-list-item-title>{{ $t(item.label) }}</v-list-item-title>
              </span>
            </v-list-item>
          </template>

          <div class="ma-4">
            <component
              v-bind="item.bind"
              :is="item.field"
              :label="item.label"
              :model-value="getAttrValue(item.key)"
              @update:modelValue="v => setAttrValue(item.key, v)"
            ></component>
          </div>
        </v-list-group>
      </template>
    </v-list>
    <v-spacer></v-spacer>
    <v-divider></v-divider>

    <editor-props-block-tools></editor-props-block-tools>
  </div>
</template>

<script>
import get from "lodash/get";
import isFunction from "lodash/isFunction";
import { mapGetters, mapMutations } from "vuex";
import { reactive } from "vue";
import EditorPropsBlockTools from "@/views/SiteBuilder/EditorSheet/EditorPropsBlockTools.vue";
import EditorPropsBlockShift from "@/views/SiteBuilder/EditorSheet/EditorPropsBlockShift.vue";
import EditorPropsBlockLayout from "@/views/SiteBuilder/EditorSheet/EditorPropsBlockLayout.vue";

import EditorPropsDefault from "./EditorPropsDefault";
import { sync } from "vuex-pathify";

export default {
  components: {
    EditorPropsBlockTools,
    EditorPropsBlockShift,
    EditorPropsBlockLayout
  },

  computed: {
    ...sync({ editor: "builder/editor" }),
    ...mapGetters({
      selectedDefinition: "builder/selectedDefinition",
      selectedState: "builder/selectedState"
    }),

    editableProps() {
      const reactiveVariable = reactive(this.editor.selected.$refs);
      const vm = reactiveVariable.component;
      const componentProps = vm && get(vm.$options, "editableProps", null);

      if (componentProps) {
        const blockProps = isFunction(componentProps)
          ? componentProps.bind(vm)()
          : componentProps;

        return [...EditorPropsDefault, ...blockProps];
      }

      return EditorPropsDefault;
    }
  },

  methods: {
    ...mapMutations({
      updateBlockAttr: "builder/updateBlockAttr",
      changeEditorTab: "builder/changeEditorTab",
      unselectBlock: "builder/unselectBlock",
      hideEditor: "builder/hideEditor"
    }),

    setAttrValue(key, value) {
      this.updateBlockAttr({
        index: this.editor.selected.index,
        bucket: this.editor.selected.bucket,
        key,
        value
      });
    },

    getAttrValue(key) {
      const defaultVal = get(this.editor.selected.config, key, null);
      return get(this.selectedState.attrs, key, defaultVal);
    },

    cancel() {
      this.hideEditor();
      this.unselectBlock();
    },
    active(item) {
      return item.active == undefined || item.active == true;
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
