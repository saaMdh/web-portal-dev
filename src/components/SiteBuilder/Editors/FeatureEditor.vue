<template>
  <div
    class="s-feature-editor"
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

        <div class="px-4 mt-4">
          <link-field
            v-model="form.link"
            @update:modelValue="update"
          ></link-field>

          <v-divider class="mb-4"></v-divider>
          <v-text-field
            v-model="form.title"
            :label="$t('components.featureEditor.title')"
            filled
            @update:model-value="update"
          ></v-text-field>

          <slider-prop
            v-model="form.titleSize"
            :min="1"
            :max="6"
            :label="$t('components.featureEditor.size')"
          ></slider-prop>

          <v-divider class="mb-8"></v-divider>
          <v-text-field
            v-if="showSubtitle"
            v-model="form.text"
            :label="$t('components.featureEditor.subtitle')"
            filled
            @update:model-value="update"
          ></v-text-field>
          <slider-prop
            v-if="showSubtitle"
            v-model="form.subtitleSize"
            :min="1"
            :max="6"
            :label="$t('components.featureEditor.size')"
          ></slider-prop>

          <v-divider class="mb-4"></v-divider>
          <v-row>
            <v-col :cols="10">
              <color-picker-prop-vue
                v-model="form.color"
                :default-color="defaultColor"
              >
              </color-picker-prop-vue>
            </v-col>
            <v-tooltip :text="$t('components.featureEditor.defaultColor')">
              <template #activator="{ props }">
                <v-btn
                  class="pt-7 pr-3"
                  v-bind="props"
                  icon
                  slim
                  prepend-icon
                  variant="plain"
                  @click="restoreColor()"
                  ><v-icon>mdi-restore</v-icon>
                </v-btn>
              </template></v-tooltip
            >
          </v-row>

          <v-divider class="mb-4"></v-divider>
          <v-select
            v-model="form.isImage"
            :items="isImageItems"
            :item-title="item => $t(item.text)"
            dense
            hide-details
            filled
            :label="$t('components.featureEditor.isImage.select')"
            clearable
            @update:modelValue="update"
          >
          </v-select>
          <v-divider class="mb-8"></v-divider>
          <icon-field
            v-if="!form.isImage"
            v-model="form.icon"
            @update:modelValue="update"
          ></icon-field>
        </div>
      </v-theme-provider>
    </Teleport>

    <router-link
      v-if="isPath"
      class="href-feature"
      :to="getLink(modelValue.link)"
    >
      <slot></slot>
    </router-link>
    <a v-else class="href-feature" :href="modelValue.link" target="_blank">
      <slot></slot>
    </a>
  </div>
</template>

<script>
import IconField from "@/components/SiteBuilder/Fields/IconField.vue";
import LinkField from "@/components/SiteBuilder/Fields/LinkField.vue";
import SliderProp from "@/components/SiteBuilder/Props/SliderProp.vue";
import ColorPickerPropVue from "@/components/SiteBuilder/Props/ColorPickerProp.vue";

import EditorCommon from "@/components/SiteBuilder/Editors/EditorCommon.js";

import merge from "lodash/merge";
import get from "lodash/get";

export default {
  components: { IconField, LinkField, SliderProp, ColorPickerPropVue },
  mixins: [EditorCommon],
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    showSubtitle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      form: {
        title: this.modelValue.title,
        text: this.modelValue.text,
        icon: this.modelValue.icon,
        link: this.modelValue.link,
        isImage: this.modelValue.isImage,
        media: this.modelValue.media,
        titleSize: this.modelValue.titleSize,
        subtitleSize: this.modelValue.subtitleSize,
        color: this.modelValue.color
      },
      isImageItems: [
        {
          value: false,
          text: "components.featureEditor.isImage.false"
        },
        {
          value: true,
          text: "components.featureEditor.isImage.true"
        }
      ],
      defaultColor: this.$store.state.builder.siteBuild.theme.color + "FF"
    };
  },
  computed: {
    isPath() {
      const link = get(this.modelValue, "link");
      return link ? link.startsWith("/") : false;
    }
  },

  watch: {
    form: {
      deep: true,
      handler() {
        merge(this.form, this.modelValue);
        this.update();
      }
    }
  },

  methods: {
    update() {
      this.$emit("update:modelValue", this.form);
    },
    restoreColor() {
      this.form.color = this.defaultColor;
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

.href-feature {
  text-decoration: none;
  color: inherit !important;
}
</style>
