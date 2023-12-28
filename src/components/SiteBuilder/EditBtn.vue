<template>
  <v-fab-transition>
    <v-btn
      v-if="!modelValue"
      dark
      icon
      style="position: fixed; bottom: 25px; right: 25px"
      @click.stop="$emit('update:modelValue', !modelValue)"
    >
      <v-icon>mdi-feather</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style></style>
