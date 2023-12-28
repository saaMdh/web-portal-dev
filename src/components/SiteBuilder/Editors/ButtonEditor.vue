<template>
  <div
    class="s-button-editor"
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
            {{ $t("components.boutonEditor.editBouton") }}
          </v-toolbar-title>
        </v-toolbar>

        <div class="px-4 mt-2">
          <v-card class="pt-2" color="transparent">
            <v-card-title class="mt-n5 mb-n3">{{
              $t("components.boutonEditor.props.label")
            }}</v-card-title>
            <v-text-field
              v-for="loc in locales"
              :key="loc"
              v-model="form.name[loc]"
              :label="label_locales[loc]"
              class="my-2 mx-1"
              hide-details
              variant="outlined"
              clearable
              filled
              dense
              @update:model-value="update"
            ></v-text-field>
          </v-card>
          <v-row>
            <v-col cols="6" class="my-2">
              <v-select
                v-model="form.style"
                :items="buttonStyle"
                dens
                hide-details
                filled
                :label="$t('components.boutonEditor.props.form')"
                clearable
                @change="update"
              >
                <template #item="{ props }">
                  <v-list-item v-bind="props" :title="$t(props.title)">
                  </v-list-item>
                </template>
              </v-select>
            </v-col>

            <v-col cols="6" class="my-2">
              <icon-field
                v-model="form.icon"
                dense
                @update:modelValue="update"
              ></icon-field>
            </v-col>
          </v-row>

          <link-field
            v-model="form.link"
            @update:modelValue="update"
          ></link-field>
          <color-field
            v-model="form.color"
            @update:modelValue="update"
          ></color-field>
        </div>
      </v-theme-provider>
    </Teleport>

    <router-link
      v-if="isPath"
      class="href-button-editor"
      :to="getLink(modelValue.link)"
    >
      <slot></slot>
    </router-link>
    <a
      v-else
      class="href-button-editor"
      :href="modelValue.link"
      target="_blank"
    >
      <slot></slot>
    </a>
  </div>
</template>

<script>
import LinkField from "@/components/SiteBuilder/Fields/LinkField.vue";
import IconField from "@/components/SiteBuilder/Fields/IconField.vue";
import ColorField from "@/components/SiteBuilder/Fields/ColorField.vue";

import EditorCommon from "@/components/SiteBuilder/Editors/EditorCommon.js";

import merge from "lodash/merge";
import get from "lodash/get";

export default {
  components: { IconField, LinkField, ColorField },

  mixins: [EditorCommon],

  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      buttonStyle: [
        {
          value: "depressed",
          title: "components.boutonEditor.boutonStyles.depressed"
        },
        {
          value: "outlined",
          title: "components.boutonEditor.boutonStyles.outlined"
        },
        {
          value: "rounded",
          title: "components.boutonEditor.boutonStyles.rounded"
        },
        { value: "text", title: "components.boutonEditor.boutonStyles.text" },
        { value: "fab", title: "components.boutonEditor.boutonStyles.Icon" }
      ],
      locales: ["fr", "ar", "en"],
      label_locales: { fr: "Français", ar: "عربي", en: "English" },

      form: {
        name: {
          fr: get(this.modelValue, "name.fr", ""),
          en: get(this.modelValue, "name.en", ""),
          ar: get(this.modelValue, "name.ar", "")
        },
        link: this.modelValue.link,
        style: this.modelValue.style,
        color: this.modelValue.color
      }
    };
  },
  computed: {
    isPath() {
      const link = get(this.modelValue, "link");
      return link ? link.startsWith("/") : false;
    }
  },

  watch: {
    modelValue() {
      merge(this.form, this.modelValue);
    }
  },

  methods: {
    update() {
      this.$emit("update:modelValue", this.form);
    }
  }
};
</script>

<style lang="scss">
.s-button-editor {
  position: relative;
  display: inline-block;

  &.--editable:hover:after {
    content: " ";
    cursor: pointer;
    border-radius: 4px;
    z-index: 9;
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
.href-button-editor {
  text-decoration: none !important;
}
</style>
