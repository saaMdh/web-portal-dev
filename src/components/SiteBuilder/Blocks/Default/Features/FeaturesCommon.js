import BooleanProp from "@/components/SiteBuilder/Props/BooleanProp.vue";
import NumberProp from "@/components/SiteBuilder/Props/NumberProp.vue";

import { ensureItemsCount } from "@/utils/array";

export default {
  editableProps: [
    {
      key: "itemsCount",
      icon: "mdi-format-list-numbered",
      label: "components.featureEditor.props.itemsCount",
      field: NumberProp,
      bind: {
        min: 1,
        max: 4
      }
    },
    {
      key: "showSubtitle",
      icon: "mdi-subtitles-outline",
      label: "components.featureEditor.props.showSubtitle",
      field: BooleanProp
    },
    {
      key: "reverse",
      icon: "mdi-undo-variant",
      label: "components.featureEditor.props.reverse",
      field: BooleanProp
    }
  ],

  data() {
    return {
      editableIndex: null,
      config: {
        itemsCount: 4,
        items: [],
        showSubtitle: true,
        reverse: false,
        media: {
          image: {
            full: `https://source.unsplash.com/640x480/?tech&` + Math.random(),
            thumb: require("@/assets/default-no-image.svg")
          },
          contain: false,
          link: "#"
        }
      }
    };
  },

  watch: {
    config: {
      handler() {
        this.config.items = ensureItemsCount(
          this.config.items,
          this.config.itemsCount,
          () => ({
            icon: "mdi-check",
            title: this.$t("components.featureEditor.service"),
            text: this.$t("components.featureEditor.text"),
            link: "#"
          })
        );
      },
      immediate: true
    }
  }
};
