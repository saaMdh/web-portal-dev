<template>
  <div>
    <section-heading icon="mdi-account" icon-color="primary">
      <template #title>{{ $t("announcement.user.title") }}</template>
    </section-heading>
    <v-card
      v-if="loading > 0"
      class="py-2 px-2 rounded-lg"
      :elevation="loading > 0 ? 0 : 1"
    >
      <v-row v-for="x in 4" :key="x" no-gutters>
        <v-col cols="4">
          <v-skeleton-loader type="list-item"></v-skeleton-loader>
        </v-col>
        <v-col cols="8">
          <v-skeleton-loader type="list-item"></v-skeleton-loader>
        </v-col>
        <v-col cols="12"> <v-divider></v-divider> </v-col
      ></v-row>
    </v-card>
    <template v-else>
      <show-user-info
        :announcement="announcement"
        class="mt-1"
      ></show-user-info>
      <show-store :announcement="announcement" class="mt-3"></show-store>
    </template>
  </div>
</template>

<script>
import SectionHeading from "@/components/Content/SectionHeading.vue";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    SectionHeading,
    ShowUserInfo: defineAsyncComponent(() => import("./ShowUserInfo.vue")),
    ShowStore: defineAsyncComponent(() => import("./ShowStore.vue"))
  },

  props: {
    announcement: {
      type: Object
    },
    loading: {
      type: Number
    }
  }
};
</script>

<style lang="scss"></style>
