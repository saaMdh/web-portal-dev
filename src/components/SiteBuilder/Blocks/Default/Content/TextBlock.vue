<template>
  <text-editor
    v-model="config.text"
    :class="{
      'text-left': config.text.textAlign == 'left',
      'text-right': config.text.textAlign == 'right',
      'text-center': config.text.textAlign == 'center',
      [`s-text-block--f${config.text.fontSize}`]: true
    }"
    @update:modelValue="update"
  >
    <v-container fluid class="s-text-block">
      <div class="s-text-block__text">{{ config.text[$i18n.locale] }}</div>
    </v-container>
  </text-editor>
</template>

<script>
import TextEditor from "@/components/SiteBuilder/Editors/TextEditor.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import TextContentMixin from "@/components/SiteBuilder/Blocks/Common/TextContentMixin";

import isEmpty from "lodash/isEmpty";
import every from "lodash/every";
export default {
  components: { TextEditor },
  mixins: [BlocksHelperMixin, TextContentMixin],

  data() {
    return {
      config: {
        text: {
          fr: "",
          ar: "",
          en: "",
          textAlign: null,
          fontSize: 1
        }
      }
    };
  },

  normalizeConfig(config) {
    if (every(config.text, property => isEmpty(property)))
      config.text = {
        fr: "Proident non est ipsum est sint anim ex est id incididunt. Do minim elit aliquip nisi laboris amet cillum ipsum excepteur elit. Proident culpa officia adipisicing consectetur consectetur incididunt duis aliqua. Magna exercitation eu tempor do cillum ullamco commodo quis deserunt. Dolor voluptate pariatur ex irure occaecat deserunt non ipsum.",
        ar: "لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات.",
        en: "Proident non est ipsum est sint anim ex est id incididunt. Do minim elit aliquip nisi laboris amet cillum ipsum excepteur elit. Proident culpa officia adipisicing consectetur consectetur incididunt duis aliqua. Magna exercitation eu tempor do cillum ullamco commodo quis deserunt. Dolor voluptate pariatur ex irure occaecat deserunt non ipsum."
      };
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive";

.s-text-block {
  $fontSizeFactor: 0.4, 0.5, 0.8, 0.9, 1, 1.2, 1.5, 1.8, 2, 2.5;

  &__text {
    @for $i from 0 through 9 {
      .s-text-block--f#{$i} & {
        font-size: 1.6rem * nth($fontSizeFactor, $i + 1);

        @include isDesktop {
          font-size: 2rem * nth($fontSizeFactor, $i + 1);
        }
      }
    }
  }
}
</style>
