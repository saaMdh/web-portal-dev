<template>
  <v-btn :aria-label="$t('_.menu')" icon @click="toggleDrawer()">
    <v-icon>mdi-menu</v-icon>
  </v-btn>
</template>

<script>
export default {
  methods: {
    toggleDrawer() {
      this.$store.commit("ui/toggleDrawer", !this.$store.state.ui.drawer);
    }
  }
};
</script>

<style></style>
