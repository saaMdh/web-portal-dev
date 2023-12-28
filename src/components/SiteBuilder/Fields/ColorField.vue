<template>
  <div ref="colorField" class="o-color-field">
    <v-menu max-width="300" :close-on-content-click="false">
      <template #activator="{ props }">
        <v-text-field
          :model-value="modelValue"
          readonly
          clearable
          v-bind="props"
          @click:clear.stop.prevent="$emit('update:modelValue', '#000000FF')"
        >
          <template #prepend-inner>
            <v-avatar size="32" :color="modelValue" class="me-2"> </v-avatar>
          </template>
        </v-text-field>
      </template>

      <v-color-picker
        :model-value="modelValue || '#000000FF'"
        mode="hexa"
        hide-mode-switch
        show-swatches
        flat
        @update:model-value="input"
      ></v-color-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,

  props: {
    modelValue: {
      type: String,
      default: "#000000"
    }
  },
  data() {
    return {
      dialog: {
        active: false
      }
    };
  },
  methods: {
    input(v) {
      if (v.hex) this.$emit("update:modelValue", v.hex);
      else this.$emit("update:modelValue", v);
    }
  }
};
</script>

<style lang="scss">
.o-color-field {
  .v-text-field > .v-input__control > .v-input__slot {
    cursor: pointer;
  }
}
</style>
