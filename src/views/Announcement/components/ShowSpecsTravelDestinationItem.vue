<template>
  <v-col cols="12" md="6">
    <div class="d-flex flex-gap-2">
      <v-icon size="32" color="primary">{{ icon }}</v-icon>
      <div>
        {{ label }}
        <div class="text-subtitle-2 font-weight-bold text-capitalize">
          {{ valueText }}
        </div>
      </div>
    </div>
  </v-col>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    valueText: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss"></style>
