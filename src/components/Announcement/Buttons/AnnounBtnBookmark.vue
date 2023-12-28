<template>
  <v-btn
    v-bind="$attrs"
    :aria-label="$t('profile.tabs.bookmarks')"
    :size="card ? 'x-small' : 'default'"
    :style="card ? 'opacity:0.8' : ''"
    icon
    elevation="1"
    @click.stop.prevent="checkAction('BOOKMARK')"
  >
    <v-icon v-if="isBookmarked" color="purple" size="large"
      >mdi-bookmark</v-icon
    >
    <v-icon v-else size="large">mdi-bookmark-outline</v-icon>
  </v-btn>
</template>

<script>
import useAnnounStatus from "./useAnnounStatus";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

export default {
  props: {
    announcement: {
      type: Object,
      required: false
    },
    mini: {
      type: Boolean,
      default: false
    },
    card: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const { user } = useAuthFrame();
    const { isBookmarked, checkAction } = useAnnounStatus(props);

    return {
      user,
      isBookmarked,
      checkAction
    };
  }
};
</script>

<style></style>
