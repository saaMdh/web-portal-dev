<template>
  <v-container class="py-0">
    <sidebar-layout>
      <div class="v-card"></div>
      <template v-if="$isDesktop" #sidebar>
        <div class="v-card"></div>
      </template>
    </sidebar-layout>
  </v-container>
</template>
<script>
import SidebarLayout from "@/components/SidebarLayout.vue";
export default { components: { SidebarLayout } };
</script>
<style lang="scss" scoped>
@import "@/scss/responsive";
.v-theme--light {
  .v-card {
    background: rgba(0, 0, 0, 0.08);
  }
}
.v-theme--dark {
  .v-card {
    background: rgba(255, 255, 255, 0.12);
  }
}
.v-card {
  @include isLG {
    height: 250px;
  }
  @include isMD {
    height: 250px;
  }
  @include isSM {
    height: calc((100vw - 24px) / 2.1677);
  }
  @include isXS {
    height: calc((100vw - 24px) / 2.1677);
  }
}
</style>
