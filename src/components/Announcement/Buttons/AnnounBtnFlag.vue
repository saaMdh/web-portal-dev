<template>
  <v-btn
    v-bind="$attrs"
    :aria-label="$t('_.report')"
    icon
    elevation="1"
    @click="checkAction('FLAG')"
  >
    <div ref="table"></div>
    <v-icon size="large">mdi-flag</v-icon>
    <flag-dialog
      v-if="announcement"
      ref="flagDialog"
      :announcement="announcement"
    ></flag-dialog>
  </v-btn>
</template>

<script>
import FlagDialog from "../Dialog/FlagDialog.vue";
import useAnnounStatus from "./useAnnounStatus";

export default {
  components: { FlagDialog },

  props: {
    announcement: {
      type: Object,
      required: false
    }
  },
  setup(props) {
    const { checkAction, flagDialog } = useAnnounStatus(props);
    return { checkAction, flagDialog };
  }
};
</script>

<style></style>
