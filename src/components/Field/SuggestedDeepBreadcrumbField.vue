<template>
  <div v-if="loading">
    <div class="d-flex flex-gap-4">
      <v-skeleton-loader
        class="skeleton-loader mt-4"
        type="image"
        height="25"
        width="150"
        rounded
      >
      </v-skeleton-loader>
      <v-skeleton-loader
        class="skeleton-loader mt-4"
        type="image"
        height="25"
        width="150"
        rounded
      >
      </v-skeleton-loader>
    </div>
  </div>
  <div v-else class="d-flex flex-row mt-4">
    <v-btn
      :aria-label="$t('_.search')"
      size="small"
      variant="outlined"
      color="primary"
      class="px-1 px-md-3"
      tag="h2"
    >
      {{ $t("_.search") }}
    </v-btn>
    <v-icon size="24" color="primary" class="mx-0 px-0">
      {{ $vuetify.locale.rtl ? "mdi-chevron-left" : "mdi-chevron-right" }}
    </v-icon>
    <v-menu offset-y :max-height="$isMobile ? '300' : '500'">
      <template #activator="{ props }">
        <v-btn
          :aria-label="$t('_.filterSuggested')"
          v-bind="props"
          class="px-1 px-md-3"
          depressed
          size="small"
          tag="h2"
          color="primary"
        >
          {{ $t("_.filterSuggested") }} <v-icon end>mdi-menu-down</v-icon>
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item
          v-for="(child, index) in items"
          :key="index"
          @click="$emit('update:modelValue', child)"
        >
          <v-list-item-title
            >{{ child.category.name }} &nbsp;({{
              child.count
            }})</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style></style>
