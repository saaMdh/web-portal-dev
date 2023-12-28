<template>
  <div class="px-4">
    <v-card-title>
      {{ $t("components.productNavsBlock.query") }}
    </v-card-title>
    <query-prop
      v-model="form.query"
      :multiple="true"
      @update:modelValue="update"
    ></query-prop>

    <v-divider class="mt-n4"></v-divider>
    <v-card>
      <v-card-title>
        {{ $t("components.featureEditor.title") }}
      </v-card-title>
      <v-text-field
        v-for="loc in locales"
        :key="loc"
        v-model="form.name[loc]"
        :label="label_locales[loc]"
        class="my-2 mx-1"
        hide-details
        variant="outlined"
        dense
        @update:modelValue="update"
      ></v-text-field>
    </v-card>
  </div>
</template>

<script>
import QueryProp from "@/components/SiteBuilder/Props/QueryProp.vue";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";

export default {
  components: { QueryProp },

  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  setup() {
    const { locale } = useAuthFrame();
    return { locale };
  },
  data() {
    return {
      expand: false,
      form: {
        name: this.modelValue.name,
        query: this.modelValue.query,
        children: this.modelValue.children,
        slug: this.modelValue.slug
      },

      locales: ["fr", "ar", "en"],
      label_locales: { fr: "Français", ar: "عربي", en: "English" }
    };
  },

  watch: {
    modelValue() {
      merge(this.form, this.modelValue);
    }
  },

  methods: {
    update() {
      this.form.slug = this.slugify(this.form.name.fr);
      this.$emit("update:modelValue", cloneDeep(this.form));
    },
    slugify(text) {
      if (!text) return;
      return text
        .toString()
        .normalize("NFKD")
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/[-\s]+/g, "-");
    }
  }
};
</script>
