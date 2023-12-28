<template>
  <v-list-subheader>
    {{ title }}
    <v-menu open-on-click top offset-y>
      <template #activator="{ props }">
        <v-btn v-bind="props" :aria-label="title" icon color="blue">
          <v-icon>mdi-information</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-text>
          {{ message }}
        </v-card-text>
      </v-card>
    </v-menu>
  </v-list-subheader>
</template>
<script>
export default {
  props: {
    title: { type: String, default: null },
    message: { type: String, default: null }
  }
};
</script>
