<template>
  <v-btn
    v-bind="$attrs"
    :aria-label="$t('_.like')"
    :size="mini ? 'x-small' : 'default'"
    icon
    elevation="1"
    :color="isLiked ? 'red' : ''"
    @click.stop.prevent="checkAction('LIKE')"
  >
    <v-badge
      :start="label == 'left'"
      :end="label == 'right'"
      style="z-index: 1;"
      overlap
      bordered
      color="red"
      floating
      :model-value="likeCount > 0"
    >
      <template #badge>
        <span>{{ formatFollower(likeCount) }}</span>
      </template>
      <v-icon size="large">{{
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
    label: {
      type: String,
      default: "right"
    },
    mini: {
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
