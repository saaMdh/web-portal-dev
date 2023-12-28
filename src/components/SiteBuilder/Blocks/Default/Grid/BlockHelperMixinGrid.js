import { mapMutations } from "vuex";

import cloneDeep from "lodash/cloneDeep";
import mergeWith from "lodash/mergeWith";
import keys from "lodash/keys";
import pick from "lodash/pick";
export const CommonBlockDefault = {
  theme: "light",
  background: null,
  width: 1,
  height: 0,
  margin: 0,
  hideOn: null
};

export default {
  inheritAttrs: false,

  props: {
    index: {
      type: Number,
      required: true
    },
    bucket: {
      type: String,
      required: true
    },
    layout: {
      type: Number,
      required: true
    },
    blockAttrs: {
      type: Object,
      required: true
    },
    layoutIndex: {
      type: Number,
      required: false
    },
    fontScale: {
      type: Number,
      required: false
    }
  },

  data() {
    return {
      config: {}
    };
  },

  watch: {
    blockAttrs: {
      deep: true,
      immediate: true,
      handler(attrs) {
        const config = cloneDeep(this.config);

        const pickKeys = [...keys(CommonBlockDefault), ...keys(config)];

        mergeWith(config, pick(attrs, pickKeys), (obj, src) => {
          if (Array.isArray(obj)) return src;
        });

        if (this.$options.normalizeConfig)
          this.$options.normalizeConfig.call(this, config);

        this.config = config;
      }
    }
  },

  methods: {
    ...mapMutations({
      updateGridBlock: "builder/updateGridBlock",
      updateGridBlockAttr: "builder/updateGridBlockAttr"
    }),
    setAttrValue(key, value) {
      this.updateGridBlockAttr({
        layoutIndex: this.layoutIndex,
        index: this.index,
        bucket: this.bucket,
        key,
        value
      });
    },
    update() {
      this.updateGridBlock({
        layoutIndex: this.layoutIndex,
        index: this.index,
        bucket: this.bucket,
        config: {
          ...this.blockAttrs,
          ...this.config
        }
      });
    }
  }
};
