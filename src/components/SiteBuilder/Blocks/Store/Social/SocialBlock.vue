<template>
  <v-container fluid class="s-social-block">
    <dual-layout :reverse="config.reverse" class="">
      <template #first>
        <text-editor
          v-model="config.title"
          class="d-flex justify-center"
          :class="{ [`s-social-block--f${config.fontSize}`]: true }"
          @update:modelValue="update"
        >
          <h1 class="s-social-block__title font-weight-bold">
            {{ config.title ? config.title[$i18n.locale] : "" }}
          </h1>
        </text-editor>
      </template>
      <template #second>
        <v-row no-gutters class="my-2">
          <v-col
            v-for="(item, i) in config.buttons"
            :key="i"
            class="d-flex justify-center"
          >
            <button-editor
              v-model="config.buttons[i]"
              class="my-1 pa-0"
              @update:modelValue="update"
            >
              <v-btn
                v-bind="{ [item.style]: true }"
                :color="item.color"
                :size="
                  $vuetify.display.xs
                    ? 'mini'
                    : $vuetify.display.smAndUp
                    ? 'large'
                    : 'default'
                "
              >
                <v-icon
                  v-if="item.icon"
                  :size="item.style == 'fab' ? 40 : 30"
                  >{{ item.icon }}</v-icon
                >
                {{ item.name[locale] }}
              </v-btn>
            </button-editor>
          </v-col>
        </v-row>
      </template>
    </dual-layout>
  </v-container>
</template>

<script>
import DualLayout from "@/components/SiteBuilder/Blocks/Common/DualLayout.vue";
import ButtonEditor from "@/components/SiteBuilder/Editors/ButtonEditor.vue";
import TextEditor from "@/components/SiteBuilder/Editors/TextEditor.vue";

import SpaceStepProp from "@/components/SiteBuilder/Props/SpaceStepProp.vue";
import BooleanProp from "@/components/SiteBuilder/Props/BooleanProp";
import NumberProp from "@/components/SiteBuilder/Props/NumberProp.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { ensureItemsCount } from "@/utils/array";
import merge from "lodash/merge";

export default {
  components: { TextEditor, ButtonEditor, DualLayout },
  mixins: [BlocksHelperMixin],

  editableProps: [
    {
      key: "reverse",
      icon: "mdi-undo-variant",
      label: "components.imageBlock.props.reverse",
      field: BooleanProp
    },
    {
      key: "fontSize",
      icon: "mdi-format-size",
      label: "components.socialBlock.props.fontSize",
      field: SpaceStepProp
    },
    {
      key: "buttonCount",
      icon: "mdi-cursor-default-click",
      label: "components.textContent.props.buttonCount",
      field: NumberProp,
      bind: {
        min: 0,
        max: 4
      }
    }
  ],

  setup() {
    const { locale } = useAuthFrame();
    return { locale };
  },

  data() {
    return {
      config: {
        colored: true,
        reverse: false,
        buttons: [],
        buttonCount: 1,
        fontSize: 5,
        textAlign: null,
        title: {
          fr: "Le titre",
          ar: "العنوان الرئيسي",
          en: "The title"
        }
      }
    };
  },
  watch: {
    modelValue: {
      deep: true,
      handler() {
        this.config = merge({ ...this.config }, this.modelValue);
      }
    },

    config: {
      handler() {
        this.config.buttons = ensureItemsCount(
          this.config.buttons,
          this.config.buttonCount,
          () => ({
            link: "#",
            name: {
              fr: "Cliquer ici",
              ar: "أنقر هنا",
              en: "Click here"
            },
            style: "default",
            color: "primary"
          })
        );
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive";

.s-social-block {
  $fontSizeFactor: 0.6, 0.75, 0.9, 1.05, 1.2, 1.35, 1.5, 1.8, 2, 2.5;

  &__title {
    font-weight: 300;
    line-height: 1;
    white-space: pre-line;

    @for $i from 0 through 9 {
      .s-social-block--f#{$i} & {
        font-size: 15px * nth($fontSizeFactor, $i + 1);

        @include isDesktop {
          font-size: 20px * nth($fontSizeFactor, $i + 1);
        }
      }
    }
  }

  &__button {
    margin-top: 4px * 4;
  }
}
</style>
