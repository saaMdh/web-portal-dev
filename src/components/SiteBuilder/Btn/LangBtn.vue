<template>
  <v-menu
    nudge-bottom="8"
    offset-y
    :start="!$vuetify.locale.rtl"
    :end="$vuetify.locale.rtl"
  >
    <template #activator="{ props }">
      <v-btn text icon v-bind="props" size="small">
        {{ currentLocal }}
      </v-btn>
    </template>

    <v-list flat class="py-0">
      <v-list-item
        v-for="(item, key) in langs"
        :key="key"
        @click="locale = key"
      >
        <v-list-item-title>{{ item }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

export default {
  setup() {
    const { locale } = useAuthFrame();

    return {
      locale
    };
  },
  data() {
    return {
      langs: {
        fr: "Français",
        en: "English",
        ar: "العربية"
      }
    };
  },

  computed: {
    currentLocal() {
      return this.$i18n.locale.toUpperCase();
    }
  }
};
</script>

<style></style>
