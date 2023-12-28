<template>
  <div class="o-publish__submit">
    <v-progress-circular color="primary" indeterminate></v-progress-circular>
    <span class="ms-3">Publication...</span>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "~@/scss/responsive.scss";

.o-publish__submit {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  @include isDesktop {
    height: 400px;
  }
}
</style>
