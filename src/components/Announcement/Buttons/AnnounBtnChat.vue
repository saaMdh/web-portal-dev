<template>
  <v-btn
    v-bind="$attrs"
    :aria-label="$t('_.message')"
    variant="elevated"
    elevation="0"
    class="text-capitalize"
    @click="checkAction('CHAT')"
  >
    <v-icon size="small" class="me-2">mdi-message-text-outline</v-icon>
    <span>{{ $t("announcement.sendMessage") }}</span>
  </v-btn>
</template>

<script>
import useAnnounStatus from "./useAnnounStatus";

export default {
  props: {
    announcement: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { checkAction } = useAnnounStatus(props);
    return { checkAction };
  }
};
</script>

<style></style>
