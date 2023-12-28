<template>
  <v-btn color="primary" class="auth-return-btn" icon @click="$emit('goBack')">
    <v-icon>{{
      $vuetify.locale.rtl ? "mdi-chevron-right" : "mdi-chevron-left"
    }}</v-icon>
  </v-btn>
</template>

<script>
export default {};
</script>

<style lang="scss">
.auth-return-btn {
  position: absolute;
}
.v-locale--is-rtl {
  .auth-return-btn {
    right: 0px;
    left: auto;
    margin-right: 10px;
    margin-left: auto;
  }
}

.v-locale--is-ltr {
  .auth-return-btn {
    left: 0px;
    right: auto;
    margin-left: 10px;
    margin-right: auto;
  }
}
</style>
