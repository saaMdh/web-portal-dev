<template>
  <div v-if="!!branch" class="d-flex justify-start align-center ">
    <span class="o-branch-name">{{ branch }}</span>
  </div>
</template>

<script>
import env from "@/utils/env.js";

export default {
  data() {
    return {
      branch: env.VUE_APP_BRANCH_NAME || ""
    };
  }
};
</script>

<style lang="scss">
.o-branch-name {
  color: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.3);
  font-weight: bold;
  border-radius: 20px;
  font-size: 10px;
  padding: 3px 5px;
  position: absolute;
}
.v-theme--dark {
  .o-branch-name {
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
}
</style>
