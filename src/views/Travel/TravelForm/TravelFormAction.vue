<template>
  <v-row
    class="text-center text-md-left my-2"
    justify="center"
    justify-md="start"
  >
    <v-col cols="6" :class="$vuetify.locale.rtl ? 'text-right' : 'text-left'">
      <v-btn
        :aria-label="$t('travel.reset')"
        variant="text"
        :loading="loading > 0"
        @click="$emit('reset')"
      >
        <v-icon start>mdi-briefcase-remove</v-icon>
        {{ $t("travel.reset") }}
      </v-btn>
    </v-col>
    <v-spacer></v-spacer>
    <v-col cols="6" :class="$vuetify.locale.rtl ? 'text-left' : 'text-right'">
      <v-btn
        :aria-label="$t('travel.submit')"
        rounded
        variant="elevated"
        color="primary"
        :loading="loading > 0"
        @click="$emit('submit')"
      >
        <v-icon start>mdi-check</v-icon>
        {{ $t("travel.submit") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style></style>
