<template>
  <div
    class="s-text-editor"
    :class="{
      '--editable': isInSelectedBlock,
      ...themeClasses
    }"
    theme="dark"
    @click="openEditor"
  >
    <Teleport v-if="isActiveEditor" to="#inline-editing">
      <v-theme-provider theme="dark">
        <v-toolbar theme="dark">
          <v-btn icon @click="closeEditor">
            <v-icon>
              {{ $vuetify.locale.rtl ? "mdi-arrow-right" : "mdi-arrow-left" }}
            </v-icon>
          </v-btn>

          <v-toolbar-title>
            {{ $t("components.textEditor.editText") }}
          </v-toolbar-title>
        </v-toolbar>

        <div class="px-4 mt-4">
          <v-textarea
            theme="dark"
            autofocus
            filled
            :model-value="modelValue.fr"
            row="2"
            clearable
            @update:model-value="v => input(v, 'fr')"
          ></v-textarea>

          <v-textarea
            theme="dark"
            autofocus
            filled
            :model-value="modelValue.ar"
            row="2"
            clearable
            @update:model-value="v => input(v, 'ar')"
          ></v-textarea>

          <v-textarea
            theme="dark"
            autofocus
            filled
            :model-value="modelValue.en"
            row="2"
            clearable
            @update:model-value="v => input(v, 'en')"
          ></v-textarea>
        </div>
      </v-theme-provider>
    </Teleport>

    <div class="__content">
      <template v-if="modelValue">
        <slot :content="modelValue">{{ modelValue }}</slot>
      </template>
    </div>
  </div>
</template>

<script>
import EditorCommon from "@/components/SiteBuilder/Editors/EditorCommon.js";

import debounce from "lodash/debounce";
export default {
  mixins: [EditorCommon],

  props: {
    modelValue: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    style() {
      return "background-color: rgba(0, 0, 0, 0.87) !important;color: #ffffff !important";
    }
  },

  methods: {
    input: debounce(function (v, locale) {
      const newV = { ...this.modelValue };
      newV[locale] = v;
      this.$emit("update:modelValue", newV);
    }, 100)
  }
};
</script>

<style lang="scss">
.s-text-editor {
  position: relative;

  .__content {
    z-index: 1;
    min-width: 100px;
    min-height: 1em;
    height: 100%;
  }

  &.--editable:hover:after {
    content: "";
    cursor: pointer;
    border-radius: 8px;
    z-index: 0;
    position: absolute;
    left: -8px;
    right: -8px;
    top: -4px;
    bottom: -4px;

    border: 1px dashed;

    .v-theme--dark & {
      border-color: white;
    }

    .v-theme--light & {
      border-color: black;
    }
  }
}
</style>
