<template>
  <v-alert v-if="success" key="success" type="success" :icon="false" text>
    <v-progress-circular indeterminate></v-progress-circular>
    <span class="ms-4">{{ $t("loginProgress.success") }}</span>
  </v-alert>

  <v-alert v-else key="progress" type="warning" :icon="false" text>
    <v-progress-circular indeterminate></v-progress-circular>
    <span class="ms-4">{{ $t("loginProgress.inProgress") }}</span>
  </v-alert>
</template>

<script>
export default {
  props: {
    success: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style></style>
