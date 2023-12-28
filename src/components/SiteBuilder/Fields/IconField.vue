<template>
  <v-autocomplete
    v-bind="$attrs"
    :items="items"
    :model-value="modelValue"
    :label="$t('components.fileds.iconField')"
    clearable
    hide-details
    filled
    @update:model-value="v => $emit('update:modelValue', v)"
  >
    <template #item="{ props }">
      <v-list-item v-bind="props">
        <template #prepend>
          <v-icon color="dark">{{ props.value }}</v-icon>
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
import upperFirst from "lodash/upperFirst";

export default {
  props: {
    modelValue: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      items: []
    };
  },
  async created() {
    this.items = (await import("@/assets/mdi-icons.json")).default.map(i => ({
      value: i,
      title: upperFirst(i.substr(4).replace(/-/g, " "))
    }));
  }
};
</script>

<style></style>
