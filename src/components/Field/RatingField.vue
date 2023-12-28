<template>
  <div>
    <v-icon v-for="i in modelValue" :key="i" color="amber">mdi-star</v-icon>
    <v-icon v-for="i in remain" :key="i + 5" color="amber"
      >mdi-star-outline</v-icon
    >
  </div>
</template>

<script>
export default {
  props: { modelValue: Number },

  computed: {
    remain() {
      return 5 - this.modelValue;
    }
  }
};
</script>

<style></style>
