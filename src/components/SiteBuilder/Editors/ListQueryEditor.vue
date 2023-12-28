<template>
  <div
    class="s-list-query-editor ma-1"
    :class="{
      '--editable': isInSelectedBlock,
      ...themeClasses
    }"
    @click="openEditor"
  >
    <Teleport v-if="isActiveEditor" to="#inline-editing">
      <v-theme-provider theme="dark">
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

        <list-query-editor-form
          v-model="form"
          @update:modelValue="update"
        ></list-query-editor-form>
        <v-divider class="mb-2"></v-divider>

        <div class="px-4">
          <v-btn block variant="outlined" color="primary" @click="openDialog()">
            {{ $t("editorBlocks.add") + " " + $t("editorBlocks.subCategory") }}
          </v-btn>
        </div>
        <v-divider class="my-2"></v-divider>
        <v-list v-if="form.children && form.children.length > 0" class="mx-2">
          <v-list-item
            v-for="(item, i) in form.children"
            :key="i"
            class="elevation-4"
          >
            <span>
              <v-list-item-title>
                {{ item && item.name[locale] }}
              </v-list-item-title>
            </span>

            <v-list-item-action class="my-1">
              <v-btn
                x-small
                color="primary"
                class="ma-1"
                @click="openDialog(i, item)"
                ><v-icon small>mdi-pencil</v-icon></v-btn
              >
              <v-btn
                size="x-small"
                color="error"
                class="ma-1"
                @click="deleteItem(i)"
                ><v-icon size="x-small">mdi-delete</v-icon></v-btn
              >
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-dialog v-if="childForm" v-model="active" :max-width="600" dark>
          <v-card class="px-0 pb-4" color="#22252a">
            <v-card-title class="pa-0">
              <v-toolbar>
                <v-toolbar-title>{{
                  type === "add"
                    ? $t("editorBlocks.add") +
                      " " +
                      $t("editorBlocks.subCategory")
                    : $t("@.edit") + " " + $t("editorBlocks.subCategory")
                }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="active = false">
                  <v-icon>
                    {{ "mdi-close" }}
                  </v-icon>
                </v-btn>
              </v-toolbar>
            </v-card-title>
            <list-query-editor-form
              v-model="childForm"
            ></list-query-editor-form>
            <div class="px-4 pt-2">
              <v-btn
                block
                color="primary"
                :disabled="
                  !childForm.query ||
                  !childForm.name.fr ||
                  !childForm.name.ar ||
                  !childForm.name.en
                "
                @click="submit"
                ><v-icon left>mdi-content-save</v-icon>
                {{ $t("editorToolbar.save") }}</v-btn
              >
            </div>
          </v-card>
        </v-dialog>
      </v-theme-provider>
    </Teleport>
    <slot></slot>
  </div>
</template>

<script>
import ListQueryEditorForm from "@/components/SiteBuilder/Editors/ListQueryEditorForm.vue";

import EditorCommon from "@/components/SiteBuilder/Editors/EditorCommon.js";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";

export default {
  components: { ListQueryEditorForm },
  mixins: [EditorCommon],
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  setup() {
    const { locale } = useAuthFrame();
    return { locale };
  },
  data() {
    return {
      active: false,
      form: {
        name: this.modelValue.name,
        query: this.modelValue.query,
        children: this.modelValue.children,
        slug: this.modelValue.slug
      },
      childForm: null,
      index: null,
      type: "add",
      locales: ["fr", "ar", "en"],
      label_locales: { fr: "Français", ar: "عربي", en: "English" }
    };
  },

  watch: {
    modelValue() {
      merge(this.form, this.modelValue);
    }
  },

  methods: {
    update() {
      this.form.slug = this.slugify(this.form.name.fr);
      this.$emit("update:modelValue", cloneDeep(this.form));
    },
    deleteItem(index) {
      this.form.children.splice(index, 1);
      this.update();
    },
    openDialog(index, v) {
      this.active = true;
      if (v) {
        this.childForm = cloneDeep(v);
        this.type = "edit";
        this.index = index;
      } else {
        this.index = null;
        this.type = "add";
        this.childForm = {
          name: { fr: "", ar: "", en: "" },
          query: null,
          slug: null
        };
      }
    },
    submit() {
      this.childForm.slug =
        this.form.slug + "-" + this.slugify(this.childForm.name.fr);
      if (this.type === "add") {
        this.form.children.push(cloneDeep(this.childForm));
      } else {
        this.form.children[this.index] = cloneDeep(this.childForm);
      }
      this.update();
      this.childForm = null;
      this.index = null;
      this.active = false;
    },
    slugify(text) {
      if (!text) return;
      return text
        .toString()
        .normalize("NFKD")
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/[-\s]+/g, "-");
    }
  }
};
</script>

<style lang="scss">
.s-list-query-editor {
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
    z-index: 0;
    position: absolute;
    left: -4px;
    right: -4px;
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
