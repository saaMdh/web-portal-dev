<template>
  <div class="d-flex flex-gap-2 flex-grow-1 justify-md-end">
    <announ-btn-call
      :announcement="announcement"
      type="message"
      variant="elevated"
      :disabled="loading > 0"
      :elevation="loading > 0 ? 0 : 1"
      :style="
        $isMobile && (announcement.hasPhone || loading) ? 'width:48.8%' : ''
      "
      :block="$isMobile && !announcement.hasPhone && !loading"
      :size="$isMobile ? 'large' : 'default'"
      :color="loading > 0 ? null : 'blue-lighten-1 text-white'"
    ></announ-btn-call>
    <announ-btn-call
      v-if="announcement.hasPhone || loading"
      :announcement="announcement"
      type="call"
      :size="$isMobile ? 'large' : 'default'"
      :color="loading > 0 ? null : 'blue-darken-2 text-white'"
      :disabled="loading > 0"
      :style="$isMobile ? 'width:50%' : ''"
      :elevation="loading > 0 ? 0 : 1"
      variant="elevated"
    ></announ-btn-call>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  components: {
    AnnounBtnCall: defineAsyncComponent(() =>
      import("@/components/Announcement/Buttons/AnnounBtnCall.vue")
    )
  },
  props: {
    announcement: Object,
    loading: {
      type: Number
    }
  }
};
</script>
