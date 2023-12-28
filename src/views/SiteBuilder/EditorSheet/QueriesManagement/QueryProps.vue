<template>
  <div>
    <v-text-field
      v-model="name"
      :label="$t('editorHome.queriesManagement.queryProps.name')"
      variant="solo"
      hide-details="auto"
      class="px-2 mt-3"
    ></v-text-field>
    <v-text-field
      v-model="count"
      :label="$t('editorHome.queriesManagement.queryProps.count')"
      type="number"
      variant="solo"
      hide-details="auto"
      class="mt-3 mx-2"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: [String, Object]
    }
  },
  data() {
    return {};
  },
  computed: {
    name: {
      get() {
        return this.modelValue.name.fr;
      },
      set(v) {
        this.$emit("update:modelValue", {
          count: this.count,
          name: { fr: v, en: v, ar: v }
        });
      }
    },
    count: {
      get() {
        return this.modelValue.count;
      },
      set(v) {
        this.$emit("update:modelValue", {
          count: parseInt(v),
          name: { fr: this.name, en: this.name, ar: this.name }
        });
      }
    }
  }
};
</script>

<style></style>
