<template>
  <div class="o-wrapper-background">
    <div key="full" class="__full" :style="fullStyle"></div>
    <v-fade-transition>
      <div
        v-if="loading"
        key="loading"
        class="__loading"
        :style="loadingStyle"
      ></div>
    </v-fade-transition>
  </div>
</template>

<script>
import get from "lodash/get";

function preloadImage(src) {
  return new Promise(resolve => {
    const loader = new Image();
    loader.onload = resolve;
    loader.src = src;
  });
}

export default {
  props: {
    background: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      loading: false
    };
  },

  computed: {
    cssBackgroundImageFull() {
      const src = get(this.background, "image.full", null);
      if (!src) return null;

      return `url("${src}")`;
    },

    cssBackgroundImageThumb() {
      const src = get(this.background, "image.thumb", null);
      if (!src) return null;

      return `url("${src}")`;
    },

    cssBackgroundColor() {
      const color = get(this.background, "gradient", null);
      if (!color) return null;

      const [from, to] = color;
      return `linear-gradient(to bottom, ${from}, ${to})`;
    },

    cssBackgroundSize() {
      return get(this.background, "cover", false) ? "cover" : "contain";
    },

    fullStyle() {
      const background = [this.cssBackgroundColor, this.cssBackgroundImageFull];

      return {
        backgroundImage: background.filter(e => !!e).join(", "),
        backgroundSize: this.cssBackgroundSize
      };
    },

    loadingStyle() {
      const background = [
        this.cssBackgroundColor,
        this.cssBackgroundImageThumb
      ];

      return {
        backgroundImage: background.filter(e => !!e).join(", "),
        backgroundSize: this.cssBackgroundSize
      };
    }
  },

  watch: {
    "background.image": {
      immediate: true,
      async handler() {
        if (!this.background || !this.background.image) return;

        this.loading = true;
        await preloadImage(this.background.image.full);
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss">
.o-wrapper-background {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  > .__full,
  > .__loading {
    position: absolute;
    width: 100%;
    height: 100%;

    background-position: center center;
  }

  > .__full {
    z-index: 1;
  }

  > .__loading {
    filter: blur(8px);
    z-index: 2;
  }
}
</style>
