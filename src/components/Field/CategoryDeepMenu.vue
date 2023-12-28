<template>
  <v-menu offset-y>
    <template #activator="{ props }">
      <slot v-bind="props"></slot>
    </template>

    <v-list v-if="item.siblings.length > 0" dense>
      <v-list-item
        v-for="child in item.siblings"
        :key="child.id"
        @click="$emit('update:modelValue', child)"
      >
        <v-list-item-title>{{ child.name }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-card v-else>
      <v-card-text>
        {{ $t("search.filter.category.empty") }}
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  }
};
</script>

<style></style>
