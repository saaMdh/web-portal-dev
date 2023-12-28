<template>
  <v-list-item @click.stop>
    <template #prepend>
      <v-icon>{{ icon }}</v-icon>
    </template>
    <span>
      {{ text }}
    </span>
  </v-list-item>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
};
</script>

<style></style>
