<template>
  <v-menu
    max-width="300"
    nudge-right="8"
    nudge-bottom="8"
    offset-x
    offset-y
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <v-btn variant="text" tile width="130" :dark="isDark" v-bind="props">
        <span
          class="text-caption"
          :class="{ 'text-white': isDark, 'text-black': !isDark }"
        >
          {{ modelValue ? modelValue : "#--------" }}
        </span>
      </v-btn>
    </template>

    <v-color-picker
      :model-value="modelValue"
      mode="hexa"
      hide-mode-switch
      show-swatches
      flat
      @update:model-value="
        $emit('update:modelValue', $event.hexa ? $event.hexa : $event)
      "
    ></v-color-picker>
  </v-menu>
</template>

<script>
import { isDark } from "@/utils/colors";

export default {
  props: {
    modelValue: {
      type: String,
      default: "#000000FF"
    }
  },

  computed: {
    isDark() {
      return isDark(this.modelValue);
    }
  }
};
</script>

<style></style>
