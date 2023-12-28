<template>
  <div>
    <div class="px-4 mt-2">
      <v-card class="pt-2" variant="outlined" color="transparent">
        <v-card-title class="mt-n5 mb-n3">{{
          $t("components.boutonEditor.props.label")
        }}</v-card-title>
        <v-text-field
          v-for="loc in locales"
          :key="loc"
          v-model="blockAttrs.button.name[loc]"
          :label="label_locales[loc]"
          class="my-2 mx-1"
          hide-details
          variant="outlined"
          clearable
          filled
          dense
          @update:model-value="
            setAttrValue(`button.name[${loc}]`, blockAttrs.button.name[loc])
          "
        ></v-text-field>
      </v-card>
      <v-divider class="mt-2 mb-4"></v-divider>
      <v-row>
        <v-col cols="6">
          <v-select
            v-model="blockAttrs.button.style"
            :items="buttonStyle"
            :item-title="item => $t(item.text)"
            dense
            hide-details
            filled
            :label="$t('components.boutonEditor.props.form')"
            clearable
            @change="setAttrValue('button.style', blockAttrs.button.style)"
          ></v-select>
        </v-col>

        <v-col cols="6">
          <icon-field
            v-model="blockAttrs.button.icon"
            @update:modelValue="setAttrValue('button.icon', blockAttrs.button.icon)"
          ></icon-field>
        </v-col>
      </v-row>
      <v-divider class="my-4"></v-divider>
      <p class="text-white">
        <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
          >mdi-link</v-icon
        >
        {{ $t("editorBlocks.link") }}
      </p>

      <link-field
        v-model="blockAttrs.button.link"
        @update:modelValue="setAttrValue('link', blockAttrs.button.link)"
      ></link-field>
      <v-divider class="mb-4"></v-divider>
      <p class="text-white mb-0">
        <v-icon :start="!$vuetify.locale.rtl" :end="$vuetify.locale.rtl"
          >mdi-format-color-fill</v-icon
        >
        {{ $t("editorBlocks.color") }}
      </p>
      <color-field
        v-model="blockAttrs.button.color"
        @update:modelValue="setAttrValue('button.color', blockAttrs.button.color)"
      ></color-field>
      <v-divider class="ma-2"></v-divider>
      <hide-on-prop
        v-if="editor.selected.block.type === 'Grid'"
        v-model="blockAttrs.hideOn"
        @update:modelValue="setAttrValue('hideOn', blockAttrs.hideOn)"
      ></hide-on-prop>
    </div>
  </div>
</template>

<script>
import LinkField from "@/components/SiteBuilder/Fields/LinkField.vue";
import IconField from "@/components/SiteBuilder/Fields/IconField.vue";
import ColorField from "@/components/SiteBuilder/Fields/ColorField.vue";
import HideOnProp from "@/components/SiteBuilder/Props/HideOnProp.vue";

import BlockEditorMixin from "@/views/SiteBuilder/EditorSheet/BlockEditor/BlockEditorCommon/BlockEditorMixin";
export default {
  components: { LinkField, IconField, ColorField, HideOnProp },
  mixins: [BlockEditorMixin],
  data() {
    return {
      buttonStyle: [
        {
          value: "depressed",
          text: "components.boutonEditor.boutonStyles.depressed"
        },
        {
          value: "outlined",
          text: "components.boutonEditor.boutonStyles.outlined"
        },
        {
          value: "rounded",
          text: "components.boutonEditor.boutonStyles.rounded"
        },
        { value: "text", text: "components.boutonEditor.boutonStyles.text" }
      ],
      locales: ["fr", "ar", "en"],
      label_locales: { fr: "Français", ar: "عربي", en: "English" }
    };
  }
};
</script>

<style lang="scss"></style>
