<template>
  <div>
    <v-btn
      class="mb-3"
      block
      color="#3b5999"
      depressed
      variant="flat"
      @click="$emit('submit', 'facebook.com')"
    >
      <v-icon start>mdi-facebook</v-icon>
      {{ $t("login.links.facebook") }}
    </v-btn>

    <v-btn
      block
      depressed
      variant="flat"
      color="#dd4b39"
      @click="$emit('submit', 'google.com')"
    >
      <v-icon start>mdi-google</v-icon>
      {{ $t("login.links.google") }}
    </v-btn>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
