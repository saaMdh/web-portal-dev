<template>
  <div
    class="s-text-content"
    :class="{
      'text-left': config.textAlign == 'left',
      'text-right': config.textAlign == 'right',
      'text-center': config.textAlign == 'center',
      [`s-text-content--f${config.fontSize}`]: true
    }"
    :style="{ color: `${config.textColor}` }"
  >
    <text-editor v-model="config.title" @update:modelValue="update">
      <h1 class="s-text-content__title">
        {{ config.title ? config.title[$i18n.locale] : "" }}
      </h1>
    </text-editor>

    <text-editor v-model="config.subtitle" @update:modelValue="update">
      <h2 class="s-text-content__subtitle">
        {{ config.subtitle ? config.subtitle[$i18n.locale] : "" }}
      </h2>
    </text-editor>

    <button-editor
      v-for="(item, i) in config.buttons"
      :key="i"
      v-model="config.buttons[i]"
      class="s-text-content__button me-4"
      @update:modelValue="update"
    >
      <v-btn
        v-bind="{ [item.style]: true }"
        :size="$vuetify.display.xs ? 'mini' : 'default'"
        :color="item.color"
      >
        <v-icon v-if="item.icon" start>{{ item.icon }}</v-icon>
        {{ item.name[locale] }}
      </v-btn>
    </button-editor>
  </div>
</template>

<script>
import ButtonEditor from "@/components/SiteBuilder/Editors/ButtonEditor.vue";
import TextEditor from "@/components/SiteBuilder/Editors/TextEditor.vue";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { ensureItemsCount } from "@/utils/array";

import defaults from "lodash/defaults";
import merge from "lodash/merge";

export default {
  components: { TextEditor, ButtonEditor },
  inheritAttrs: true,

  props: {
    modelValue: {
      type: Object,
      default: () => {}
    }
  },
  setup() {
    const { locale } = useAuthFrame();
    return { locale };
  },

  data() {
    return {
      config: defaults({}, this.modelValue, {
        title: {
          fr: "Le titre",
          ar: "العنوان",
          en: "The title"
        },
        subtitle: "Le sous-titre",
        fontSize: 5,
        textAlign: null,
        buttons: [],
        buttonCount: 0
      })
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
  },

  methods: {
    update() {
      this.$emit("update:modelValue", this.config);
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive";

.s-text-content {
  $fontSizeFactor: 0.4, 0.5, 0.8, 0.9, 1, 1.2, 1.5, 1.8, 2, 2.5;

  &__title {
    line-height: 1;
    font-weight: 600;
    white-space: pre-line;

    @for $i from 0 through 9 {
      .s-text-content--f#{$i} & {
        font-size: 1.3rem * nth($fontSizeFactor, $i + 1);

        @include isDesktop {
          font-size: 2rem * nth($fontSizeFactor, $i + 1);
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
      .s-text-content--f#{$i} & {
        font-size: 0.9rem * nth($fontSizeFactor, $i + 1);

        @include isDesktop {
          font-size: 1.2rem * nth($fontSizeFactor, $i + 1);
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
