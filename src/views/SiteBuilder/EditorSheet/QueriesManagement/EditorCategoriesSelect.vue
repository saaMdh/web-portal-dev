<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="selected"
    :items="categories"
    :label="$t('components.editorCategories.label')"
    item-title="name"
    item-value="slug"
    chips
    solo
    dense
    small-chips
    hide-details
    clearable
    class="mt-3"
    :loading="loading > 0"
  >
    <template #selection="{ props }">
      <v-list-item
        :key="props.key"
        :ref="props.ref"
        density="compact"
        @click="props.onClick"
      >
        <v-list-item-title>
          {{ props.title }}
        </v-list-item-title>
        <template #prepend>
          <v-avatar v-if="props.icon">
            <v-img :src="props.icon" width="25px"> </v-img>
          </v-avatar>
        </template>
      </v-list-item>
    </template>
    <template #item="{ props }">
      <v-list-item
        :key="props.key"
        :ref="props.ref"
        density="compact"
        @click="props.onClick"
      >
        <v-list-item-title>
          {{ props.title }}
        </v-list-item-title>
        <template #prepend>
          <v-avatar v-if="props.icon">
            <v-img :src="props.icon" width="25px"> </v-img>
          </v-avatar>
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
import isEmpty from "lodash/isEmpty";
export default {
  props: {
    modelValue: {
      type: Object,
      default: null
    },
    categories: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    selected: {
      get() {
        if (isEmpty(this.modelValue)) return null;
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      }
    }
  }
};
</script>
