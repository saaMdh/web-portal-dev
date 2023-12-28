<template>
  <v-item-group
    :model-value="modelValue"
    @change="v => $emit('update:modelValue', v)"
  >
    <v-item
      v-for="item in categories"
      :key="item.id"
      v-slot="{ active, toggle }"
      :model-value="item.id"
    >
      <v-btn
        class="me-2 mt-2"
        active-class="primary"
        :input-value="active"
        filter
        @click="toggle"
        >{{ item.title }}</v-btn
      >
    </v-item>
  </v-item-group>
</template>

<script>
import CategoryBaseField from "@/components/SiteBuilder/Fields/CategoryBaseField";

export default {
  mixins: [CategoryBaseField],

  props: {
    modelValue: {
      type: [String, Number],
      default: null
    }
  }
};
</script>

<style></style>
