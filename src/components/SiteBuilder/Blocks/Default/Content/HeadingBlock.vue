<template>
  <v-container fluid class="s-heading-block">
    <div
      class="s-heading-block__inner"
      :class="{
        '--reverse': config.reverse,
        '--half-width': config.halfWidth
      }"
    >
      <text-content v-model="config.text" @update:modelValue="update"></text-content>
    </div>
  </v-container>
</template>

<script>
import TextContent from "@/components/SiteBuilder/Blocks/Common/TextContent.vue";

import BooleanProp from "@/components/SiteBuilder/Props/BooleanProp";
import ColorPickerProp from "@/components/SiteBuilder/Props/ColorPickerProp.vue";

import TextContentMixin from "@/components/SiteBuilder/Blocks/Common/TextContentMixin";
import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";

export default {
  components: {
    TextContent
  },
  mixins: [BlocksHelperMixin, TextContentMixin],

  editableProps: [
    {
      key: "halfWidth",
      icon: "mdi-align-horizontal-left",
      label: "components.headingBlock.props.halfWidth",
      field: BooleanProp
    },
    {
      key: "reverse",
      icon: "mdi-undo-variant",
      label: "components.headingBlock.props.reverse",
      field: BooleanProp
    },
    {
      icon: "mdi-format-color-fill",
      key: "text.textColor",
      label: "components.headingBlock.props.textColor",
      field: ColorPickerProp
    }
  ],

  data() {
    return {
      config: {
        reverse: false,
        halfWidth: false,

        text: {
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
      }
    };
  }
};
</script>

<style lang="scss">
.s-heading-block {
  &__inner {
    display: flex;

    flex-direction: row;

    align-items: center;

    > div {
      width: 100%;
    }

    &.--half-width {
      gap: 4px * 4;

      > div {
        width: 50%;
      }
    }

    &.--reverse {
      flex-direction: row-reverse;
    }
  }
}
</style>
