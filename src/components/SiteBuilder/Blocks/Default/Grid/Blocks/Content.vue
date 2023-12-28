<template>
  <div class="heading">
    <div
      fluid
      class="s-text-content-layout"
      :class="{
        'text-start': config.textAlign == 'left',
        'text-end': config.textAlign == 'right',
        'text-center': config.textAlign == 'center',
        [`s-text-content-layout--f${config.fontSize}`]: true
      }"
      :style="{ color: `${config.textColor}` }"
    >
      <text-editor v-model="config.title" @update:modelValue="update">
        <h1 class="s-text-content-layout__title">
          {{ config.title ? config.title[$i18n.locale] : "" }}
        </h1>
      </text-editor>
      <text-editor v-model="config.subtitle" @update:modelValue="update">
        <h2 class="s-text-content-layout__subtitle">
          {{ config.subtitle ? config.subtitle[$i18n.locale] : "" }}
        </h2>
      </text-editor>
      <button-editor
        v-for="(item, i) in config.buttons"
        :key="i"
        v-model="config.buttons[i]"
        class="s-text-content-layout__button"
        :class="{
          'me-4': config.textAlign != 'right',
          'ms-4': config.textAlign == 'right'
        }"
        @input="update"
      >
        <v-btn
          v-bind="{ [item.style]: true }"
          :size="$vuetify.display.xs ? true : false"
          :color="item.color"
        >
          <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
          {{ item.name[locale] }}
        </v-btn>
      </button-editor>
    </div>
  </div>
</template>

<script>
import ButtonEditor from "@/components/SiteBuilder/Editors/ButtonEditor.vue";
import TextEditor from "@/components/SiteBuilder/Editors/TextEditor.vue";

import SpaceStepProp from "@/components/SiteBuilder/Props/SpaceStepProp.vue";
import AlignProp from "@/components/SiteBuilder/Props/AlignProp.vue";
import NumberProp from "@/components/SiteBuilder/Props/NumberProp.vue";

import BlockHelperMixinGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockHelperMixinGrid";
import { ensureItemsCount } from "@/utils/array";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
export default {
  components: { TextEditor, ButtonEditor },
  mixins: [BlockHelperMixinGrid],
  setup() {
    const { locale } = useAuthFrame();
    return { locale };
  },
  editableProps: [
    {
      icon: "mdi-format-size",
      label: "components.textContent.props.fontSize",
      key: "fontSize",
      field: SpaceStepProp
    },
    {
      key: "textAlign",
      icon: "mdi-format-align-left",
      label: "components.textContent.props.textAlign",
      field: AlignProp
    },
    {
      key: "buttonCount",
      icon: "mdi-cursor-default-click",
      label: "components.textContent.props.buttonCount",
      field: NumberProp,
      bind: {
        min: 0,
        max: 2
      }
    }
  ],

  data() {
    return {
      config: {
        title: {
          fr: "Le titre",
          ar: "العنوان الرئيسي",
          en: "The title"
        },
        subtitle: {
          fr: "Le sous-titre",
          ar: "العنوان الثانوي",
          en: "The subtitle"
        },
        fontSize: 5,
        textColor: null,
        textAlign: null,
        buttons: [],
        buttonCount: 0
      }
    };
  },
  watch: {
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
.heading {
  display: flex;
  width: 100%;
  align-items: center;
}

.s-text-content-layout {
  width: 100%;
  $fontSizeFactor: 0.6, 0.75, 0.9, 1.05, 1.2, 1.35, 1.5, 1.8, 2, 2.5;

  &__title {
    line-height: 1;
    font-weight: 600;
    white-space: pre-line;

    @for $i from 0 through 9 {
      .s-text-content-layout--f#{$i} & {
        font-size: 15px * nth($fontSizeFactor, $i + 1);

        @include isDesktop {
          font-size: 30px * nth($fontSizeFactor, $i + 1);
        }
      }
    }
  }

  &__subtitle {
    line-height: 1;
    font-weight: 300;
    white-space: pre-line;
    margin-top: 4px * 4;

    @for $i from 0 through 9 {
      .s-text-content-layout--f#{$i} & {
        font-size: 12px * nth($fontSizeFactor, $i + 1);

        @include isDesktop {
          font-size: 20px * nth($fontSizeFactor, $i + 1);
        }
      }
    }

    .ok-cw.v-theme--dark & {
      color: #dbdbdb;
    }

    .ok-cw.v-theme--light & {
      color: #2c2c2c;
    }
  }

  &__button {
    margin-top: 4px * 4;
  }
}
</style>
