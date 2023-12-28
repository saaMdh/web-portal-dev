<template>
  <div
    fluid
    class="s-text-block"
    :class="{
      'text-start': config.text.textAlign == 'left',
      'text-end': config.text.textAlign == 'right',
      'text-center': config.text.textAlign == 'center',
      [`s-text-block--f${config.text.fontSize}`]: true
    }"
    :style="{ color: `${config.text.textColor}` }"
  >
    <div class="s-text-block__text">
      <div :style="`font-size: ${fontScale}%`">
        {{ config.text[$i18n.locale] }}
      </div>
    </div>
  </div>
</template>

<script>
import BlockHelperMixinGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockHelperMixinGrid";

import isEmpty from "lodash/isEmpty";
import every from "lodash/every";

export default {
  mixins: [BlockHelperMixinGrid],

  data() {
    return {
      config: {
        text: {
          fr: "Proident non est ipsum est sint anim ex est id incididunt.",
          ar: "لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو.",
          en: "Proident non est ipsum est sint anim ex est id incididunt. ",
          textAlign: null,
          fontSize: 1,
          textColor: null
        }
      }
    };
  },

  normalizeConfig(config) {
    if (every(config.text, property => isEmpty(property)))
      config.text = {
        fr: "Proident non est ipsum est sint anim ex est id incididunt.",
        ar: "لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو.",
        en: "Proident non est ipsum est sint anim ex est id incididunt. "
      };
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive";

.s-text-block {
  min-height: 15px;
  $fontSizeFactor: 0.6, 0.75, 0.9, 1.05, 1.2, 1.35, 1.5, 1.8, 2, 2.5;
  height: 100%;
  width: 100%;
  line-height: 1.2;
  font-size: inherit !important;

  &__text {
    @for $i from 0 through 9 {
      .s-text-block--f#{$i} & {
        font-size: 15px * nth($fontSizeFactor, $i + 1);

        @include isDesktop {
          font-size: 20px * nth($fontSizeFactor, $i + 1);
        }
      }
    }
  }
}
</style>
