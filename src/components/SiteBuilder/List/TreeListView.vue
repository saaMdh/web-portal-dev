<template>
  <template v-for="(item, index) in categories" :key="item.id">
    <v-list-group
      v-if="!item.header && !item.divider && item.children.length > 0"
      :value="item.slug"
    >
      <template #activator="{ props }">
        <v-list-item v-bind="props">
          {{ item.name }}
        </v-list-item>
      </template>

      <template v-if="item.children && item.children.length">
        <v-list-item
          :value="item.slug"
          color="primary"
          @click="v => $emit('update:modelValue', item.slug)"
        >
          <span class="font-weight-bold">
            {{ item.name }}
          </span>
        </v-list-item>
        <v-list-item
          v-for="child in item.children"
          :key="child.id"
          :value="child.slug"
          color="primary"
          @click="v => $emit('update:modelValue', child.slug)"
        >
          {{ child.name }}
        </v-list-item>
      </template>
    </v-list-group>
    <v-list-item
      v-else-if="item.children && item.children.length === 0"
      :key="item.id"
      :value="item.slug"
      color="primary"
      @click="v => $emit('update:modelValue', item.slug)"
    >
      {{ item.name }}
    </v-list-item>
    <div v-else>
      <v-list-item
        v-if="item.header"
        class="font-weight-bold"
        @click="v => $emit('update:modelValue', item.slug)"
        >{{ item.header }}</v-list-item
      >
      <v-divider v-else-if="item.divider && index < categories.length - 1" />
    </div>
  </template>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: String,
      default: null
    }
  }
};
</script>

<style></style>
