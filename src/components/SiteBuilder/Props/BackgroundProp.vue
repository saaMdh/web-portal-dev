<template>
  <div>
    <v-switch
      v-model="gradientEnable"
      hide-details
      dense
      :label="$t('props.backgroundProp.fields.gradientEnable')"
      inset
      @update:modelValue="update"
    ></v-switch>

    <gradient-field
      v-if="background.gradient"
      v-model="background.gradient"
      solo
      flat
      class="mt-4"
      @update:modelValue="update"
    ></gradient-field>

    <picture-prop
      v-model="background.image"
      class="mt-4"
      @update:modelValue="update"
    ></picture-prop>

    <v-switch
      v-model="background.cover"
      hide-details
      dense
      :label="$t('props.backgroundProp.fields.cover')"
      inset
      @update:modelValue="update"
    ></v-switch>
  </div>
</template>

<script>
import GradientField from "@/components/SiteBuilder/Fields/GradientField.vue";
import PictureProp from "@/components/SiteBuilder/Props/PictureProp.vue";

const BACKGROUND_DEFAULT = {
  gradient: null,
  cover: false,
  image: null
};

export default {
  components: { PictureProp, GradientField },

  props: {
    modelValue: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      background: { ...BACKGROUND_DEFAULT }
    };
  },

  computed: {
    gradientEnable: {
      get() {
        return this.background.gradient !== null;
      },
      set(e) {
        if (e) this.background.gradient = ["#000000FF", "#000000FF"];
        else this.background.gradient = null;
        this.update();
      }
    }
  },

  watch: {
    modelValue: {
      immediate: true,
      handler() {
        if (this.modelValue) {
          this.background = this.modelValue;
        } else {
          this.background = { ...BACKGROUND_DEFAULT };
        }
      }
    }
  },

  methods: {
    update() {
      this.$emit("update:modelValue", this.background);
    }
  }
};
</script>

<style></style>
