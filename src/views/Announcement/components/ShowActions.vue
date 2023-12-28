<template>
  <div class="d-flex justify-md-end mx-n2">
    <div class="d-flex justify-md-end">
      <announ-btn-bookmark
        size="small"
        class="mx-1"
        :disabled="loading > 0"
        :elevation="loading > 0 ? 0 : 1"
        :announcement="announcement"
      ></announ-btn-bookmark>
      <announ-btn-heart
        size="small"
        class="mx-1"
        :announcement="announcement"
        :disabled="loading > 0"
        :elevation="loading > 0 ? 0 : 1"
      ></announ-btn-heart>
    </div>
    <v-spacer></v-spacer>
    <div class="d-flex justify-md-end">
      <announ-btn-flag
        size="small"
        class="mx-1"
        :disabled="loading > 0"
        :elevation="loading > 0 ? 0 : 1"
        :announcement="announcement"
      ></announ-btn-flag>

      <announ-btn-share
        size="small"
        class="mx-1"
        :disabled="loading > 0"
        :elevation="loading > 0 ? 0 : 1"
        :announcement="announcement"
      ></announ-btn-share>

      <show-option
        v-if="toolsFlag"
        :is-admin="user.isAdmin"
        :announcement="announcement"
        :disabled="loading > 0"
        :elevation="loading > 0 ? 0 : 1"
        @refetch="v => $emit('refetch', v)"
      ></show-option>
    </div>
  </div>
</template>

<script>
import "animate.css";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import AnnounBtnBookmark from "@/components/Announcement/Buttons/AnnounBtnBookmark.vue";
import AnnounBtnHeart from "@/components/Announcement/Buttons/AnnounBtnHeart.vue";
import AnnounBtnFlag from "@/components/Announcement/Buttons/AnnounBtnFlag.vue";
import AnnounBtnShare from "@/components/Announcement/Buttons/AnnounBtnShare.vue";
import get from "lodash/get";
import env from "@/utils/env.js";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    AnnounBtnBookmark,
    AnnounBtnHeart,
    AnnounBtnFlag,
    AnnounBtnShare,
    ShowOption: defineAsyncComponent(() => import("./ShowOption.vue"))
  },

  props: {
    announcement: {
      type: Object
    },
    loading: {
      type: Number
    }
  },
  setup() {
    const { user } = useAuthFrame();
    return {
      user
    };
  },
  data() {
    return {
      DISABLE_MESSENGER: parseInt(env.VUE_APP_DISABLE_MESSENGER)
    };
  },
  computed: {
    toolsFlag() {
      return (
        this.user &&
        (this.user.isAdmin ||
          this.user.id == get(this.announcement, "user.id", null))
      );
    }
  }
};
</script>
