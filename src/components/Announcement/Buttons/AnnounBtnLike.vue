<template>
  <v-btn
    v-bind="$attrs"
    :aria-label="$t('_.like')"
    icon
    :size="card ? 'x-small' : 'default'"
    :style="card ? 'opacity:0.8' : ''"
    :elevation="card ? '1' : '0'"
    @click.stop.prevent="checkAction('LIKE')"
  >
    <v-badge
      overlap
      offset-y="3"
      offset-x="3"
      location="top start"
      color="red"
      floating
      :model-value="likeCount > 0"
    >
      <template #badge>
        <span>{{ formatFollower(likeCount) }}</span>
      </template>
      <v-icon :color="isLiked ? 'red' : ''">{{
        isLiked ? "mdi-heart" : "mdi-heart-outline"
      }}</v-icon>
    </v-badge>
  </v-btn>
</template>

<script>
import useAnnounStatus from "./useAnnounStatus";

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
    const { checkAction, likeCount, isLiked } = useAnnounStatus(props);

    return {
      checkAction,
      likeCount,
      isLiked
    };
  }
};
</script>

<style></style>
