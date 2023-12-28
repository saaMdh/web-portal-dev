<template>
  <div class="btn-layout">
    <v-btn
      v-bind="{ [config.button.style]: true }"
      block
      :size="$isMobile ? 'mini' : 'default'"
      :color="config.button.color"
      :to="isPath && !editorEnable ? config.button.link : null"
      :href="!isPath && !editorEnable ? config.button.link : null"
      :target="!isPath ? '_blank' : null"
      :dark="dark"
    >
      <div :style="`font-size: ${fontScale * 1.25}%`">
        <v-icon v-if="config.button.icon" start>{{
          config.button.icon
        }}</v-icon>
        {{ config.button.name[locale] }}
      </div>
    </v-btn>
  </div>
</template>

<script>
import BlockHelperMixinGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockHelperMixinGrid";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { sync } from "vuex-pathify";
import { isDark } from "@/utils/colors";
export default {
  mixins: [BlockHelperMixinGrid],

  inheritAttrs: true,
  setup() {
    const { locale } = useAuthFrame();
    return { locale };
  },

  data() {
    return {
      config: {
        button: {
          link: "#",
          name: {
            fr: "Cliquer ici",
            ar: "أنقر هنا",
            en: "Click here"
          },
          style: "default",
          color: "primary"
        }
      }
    };
  },
  computed: {
    ...sync({
      editorEnable: "builder/editor@enable"
    }),
    isPath() {
      return this.config.button.link
        ? this.config.button.link.startsWith("/")
        : false;
    },
    dark() {
      return isDark(this.config.button.color);
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive";
.btn-layout {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
