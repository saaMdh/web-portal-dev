<template>
  <v-menu offset-y nudge-bottom="8">
    <template #activator="{ props }">
      <v-btn
        class="font-weight-bold"
        :aria-label="$t('topbar.lang')"
        variant="text"
        icon
        v-bind="props"
        >{{ currentLocal }}</v-btn
      >
    </template>

    <v-list>
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
