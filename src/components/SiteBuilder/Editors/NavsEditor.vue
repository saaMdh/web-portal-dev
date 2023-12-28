<template>
  <div
    class="s-feature-editor ma-1"
    :class="{
      '--editable': isInSelectedBlock,
      ...themeClasses
    }"
    @click="openEditor"
  >
    <Teleport v-if="isActiveEditor" to="#inline-editing">
      <v-theme-provider :key="_uid" theme="dark">
        <v-toolbar>
          <v-btn icon @click="closeEditor">
            <v-icon>
              {{ $vuetify.locale.rtl ? "mdi-arrow-right" : "mdi-arrow-left" }}
            </v-icon>
          </v-btn>

          <v-toolbar-title>
            {{ $t("components.featureEditor.personalizeFeature") }}
          </v-toolbar-title>
        </v-toolbar>

        <div class="px-4 mt-4">
          <link-blocks-field
            v-model="form.link"
            @update:modelValue="update"
          ></link-blocks-field>

          <v-divider class="mb-4"></v-divider>
          <v-card>
            <v-card-title>
              {{ $t("components.featureEditor.title") }}
            </v-card-title>
            <v-text-field
              v-for="loc in locales"
              :key="loc"
              v-model="form.name[loc]"
              :label="label_locales[loc]"
              class="my-2 mx-1"
              hide-details
              variant="outlined"
              dense
              @update:model-value="update"
            ></v-text-field>
          </v-card>
        </div>
      </v-theme-provider>
    </Teleport>

    <router-link class="href-feature" :to="editor.enable ? '' : form.link">
      <slot></slot>
    </router-link>
  </div>
</template>

<script>
import EditorCommon from "@/components/SiteBuilder/Editors/EditorCommon.js";

import { sync } from "vuex-pathify";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    LinkBlocksField: defineAsyncComponent(() =>
      import("@/components/SiteBuilder/Fields/LinkBlocksField.vue")
    )
  },
  mixins: [EditorCommon],
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: this.modelValue.name,
        text: this.modelValue.count,
        link: this.modelValue.link
      },
      locales: ["fr", "ar", "en"],
      label_locales: { fr: "Français", ar: "عربي", en: "English" }
    };
  },

  computed: {
    ...sync({ editor: "builder/editor" })
  },

  watch: {
    modelValue() {
      merge(this.form, this.modelValue);
    }
  },

  methods: {
    update() {
      this.$emit("update:modelValue", cloneDeep(this.form));
    }
  }
};
</script>

<style lang="scss">
.s-feature-editor {
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
    border-radius: 1px;
    z-index: 0;
    position: absolute;
    .v-theme--dark & {
      border-color: white;
    }

    .v-theme--light & {
      border-color: black;
    }
  }
}

.href-feature {
  text-decoration: none;
  color: inherit !important;
}
</style>
