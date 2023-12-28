<template>
  <div
    class="v-card mx-auto"
    disabled
    style="background: rgba(0, 0, 0, 0.12)"
  ></div>
</template>

<script>
export default {};
</script>
<style lang="scss" scoped>
@import "@/scss/responsive";
.v-card {
  background: rgba(0, 0, 0, 0.12);
}
.v-card {
  @include isLG {
    height: 150px;
  }
  @include isMD {
    height: 150px;
  }
  @include isSM {
    height: 90px;
    width: 366px;
  }
  @include isXS {
    height: 90px;
    width: 366px;
  }
}
</style>
