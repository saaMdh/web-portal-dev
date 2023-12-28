<template>
  <div class="d-flex justify-center align-center mx-4 ok-auth-box__logo">
    <v-btn
      color="primary"
      class="auth-return-btn"
      icon
      variant="text"
      @click="$emit('gotoPortal')"
      ><v-icon>{{
        $vuetify.locale.rtl ? "mdi-chevron-right" : "mdi-chevron-left"
      }}</v-icon>
    </v-btn>
    <img
      v-if="$vuetify.locale.rtl"
      :src="
        $vuetify.theme.current.dark
          ? require('@/assets/logo-light-h-w-ar-ps.svg')
          : require('@/assets/logo-h-w-ar-ps.svg')
      "
      @click="$emit('gotoPortal')"
    />

    <img
      v-else
      :src="
        $vuetify.theme.current.dark
          ? require('@/assets/logo-light-h-w-ps.svg')
          : require('@/assets/logo-h-w-ps.svg')
      "
      @click="$emit('gotoPortal')"
    />
  </div>
</template>
<script>
export default {};
</script>

<style lang="scss">
.ok-auth-box__logo {
  cursor: pointer;
  position: relative;
  img {
    width: 220px;
  }
}
.auth-return-btn {
  position: absolute;
}
.v-locale--is-rtl {
  .auth-return-btn {
    right: 0px;
    left: auto;
  }
}

.v-locale--is-ltr {
  .auth-return-btn {
    left: 0px;
    right: auto;
  }
}
</style>
