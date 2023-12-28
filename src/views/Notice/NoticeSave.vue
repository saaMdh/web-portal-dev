<template>
  <div>
    <v-snackbar
      :model-value="dirty && !notice.update.loading"
      :timeout="-1"
      color="warning"
      center
      top
      dark
      fixed
    >
      <v-icon start>mdi-content-save-alert</v-icon>
      {{ $t("components.notice.notSaved") }}

      <template #action>
        <v-btn text @click="restoreSiteBuild">Réstaurer</v-btn>
        <v-btn text @click="commitSiteBuild">Enregister</v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      :model-value="notice.update.loading"
      :timeout="-1"
      color="info"
      center
      bottom
      dark
      fixed
    >
      <v-progress-circular
        class="me-4"
        color="white"
        indeterminate
      ></v-progress-circular>
      {{ $t("components.notice.saving") }}
    </v-snackbar>
  </div>
</template>

<script>
import { sync } from "vuex-pathify";

export default {
  inject: ["commitSiteBuild", "restoreSiteBuild"],

  computed: {
    ...sync({ notice: "builder/editor@notice", dirty: "builder/editor@dirty" })
  }
};
</script>

<style></style>
