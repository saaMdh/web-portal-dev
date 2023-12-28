<template>
  <div class="s-placeholder">
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.s-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100vh;

  font-weight: 300;
  font-size: 24pt;
  line-height: 48pt;
  text-align: center;

  svg path {
    fill: currentColor;
  }

  > div {
    opacity: 0.75;
  }
}
</style>
