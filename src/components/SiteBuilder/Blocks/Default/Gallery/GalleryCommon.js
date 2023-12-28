import BooleanPropVue from "@/components/SiteBuilder/Props/BooleanProp.vue";
import { ensureItemsCount } from "@/utils/array";

import { mapMutations } from "vuex";
import get from "lodash/get";

export default {
  editableProps: [
    {
      key: "showCaption",
      icon: "mdi-closed-caption",
      label: "components.galleryBlock.props.showCaption",
      field: BooleanPropVue
    }
  ],

  data() {
    return {
      config: {
        itemsCount: 4,
        items: [],
        showCaption: true
      }
    };
  },

  computed: {
    items() {
      return this.$isDesktop
        ? this.config.items.map(c => ({
            ...c,
            media: this.mediaDevice(c, "desktop")
          }))
        : this.config.items.map(c => ({
            ...c,
            media: this.mediaDevice(c, "mobile")
          }));
    }
  },

  normalizeConfig(config) {
    this.parseItems(config);
  },

  methods: {
    ...mapMutations({ updateBlockAttr: "builder/updateBlockAttr" }),

    mediaDevice(config, type) {
      return get(config.media, type, config.media);
    },

    getImageSrc(item) {
      return get(
        item,
        "media.image.full",
        require("@/assets/default-no-image.svg")
      );
    },

    getThumbImageSrc(item) {
      return get(
        item,
        "media.image.thumb",
        require("@/assets/default-no-image.svg")
      );
    },

    getLink(item) {
      return get(item, "media.link", "#");
    },

    parseItems(config) {
      config.items = ensureItemsCount(config.items, config.itemsCount, () => ({
        media: {
          image: {
            full: `https://source.unsplash.com/640x480/?tech&` + Math.random(),
            thumb: require("@/assets/default-no-image.svg")
          },
          contain: false,
          link: "#"
        },
        title: {
          fr: "Le titre",
          ar: "العنوان الرئيسي",
          en: "The title"
        },
        subtitle: {
          fr: "Le sous-titre",
          ar: "العنوان الثانوي",
          en: "The subtitle"
        }
      }));
    }
  },

  watch: {
    "config.itemsCount": {
      immediate: true,
      handler() {
        this.parseItems(this.config);
      }
    }
  }
};
