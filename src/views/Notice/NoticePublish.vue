<template>
  <div>
    <v-snackbar
      :model-value="notice.publish.loading"
      :timeout="-1"
      color="success"
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
      {{ $t("components.notice.publication") }}
    </v-snackbar>

    <v-snackbar
      v-model="notice.publish.notify"
      :timeout="4000"
      color="success"
      center
      bottom
      dark
      fixed
    >
      {{ $t("components.notice.published") }}
      <template #action>
        <v-btn text @click="notice.publish.notify = false">
          {{ $t("_.close") }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { sync } from "vuex-pathify";

export default {
  computed: {
    ...sync({ notice: "builder/editor@notice" })
  }
};
</script>

<style></style>
