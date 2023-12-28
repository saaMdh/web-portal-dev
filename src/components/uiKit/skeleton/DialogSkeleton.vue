<template>
  <div
    class="ok-card ma-2"
    disabled
    style="background: rgba(0, 0, 0, 0.12)"
  ></div>
</template>

<script>
export default {};
</script>
<style scoped>
.ok-card {
  max-width: 500px;
  width: 400px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.12);
  animation: 1s ease-in infinite fadein;
}
@keyframes fadein {
  from {
    background: rgba(0, 0, 0, 0.12);
  }

  to {
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
