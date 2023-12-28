<template>
  <div>
    <hr
      data-v-7f4f9215=""
      role="separator"
      aria-orientation="horizontal"
      class="v-divider"
      :class="{
        'v-theme--dark': $vuetify.theme.current.dark || dark,
        'v-theme--light': !$vuetify.theme.current.dark || !dark
      }"
    />
    <div class="spacer"></div>
    <div class="d-flex pa-1 announcement-actions">
      <template v-if="showCart">
        <announ-btn-cart
          :announcement="announcement"
          :mini="mini"
          class="me-1"
          :class="mini ? 'px-1' : 'px-2'"
        ></announ-btn-cart>
      </template>
      <announ-btn-call
        :announcement="announcement"
        :mini="mini"
        type="call"
        :class="mini ? 'px-1' : 'px-2'"
      ></announ-btn-call>
      <v-spacer></v-spacer>
      <announ-btn-call
        :announcement="announcement"
        :mini="mini"
        type="message"
        :class="mini ? 'px-1' : 'px-2'"
      ></announ-btn-call>
      <v-spacer v-if="!mini"></v-spacer>
      <announ-btn-comment
        :disabled="announcement.isCommentEnabled === false"
        :announcement="announcement"
        :mini="mini"
        class="px-2"
        @showComment="commentFormActive = !commentFormActive"
      ></announ-btn-comment>
      <div class="announcement-actions-top">
        <announ-btn-like
          style="z-index: 2"
          :mini="mini"
          class="me-1"
          :card="true"
          :announcement="announcement"
        ></announ-btn-like>
        <announ-btn-bookmark
          style="z-index: 1"
          :mini="mini"
          :card="true"
          :announcement="announcement"
        ></announ-btn-bookmark>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { defineAsyncComponent } from "vue";
export default {
  components: {
    AnnounBtnCart: defineAsyncComponent(() =>
      import("./Buttons/AnnounBtnCart.vue")
    ),
    AnnounBtnCall: defineAsyncComponent(() =>
      import("./Buttons/AnnounBtnCall.vue")
    ),
    AnnounBtnBookmark: defineAsyncComponent(() =>
      import("./Buttons/AnnounBtnBookmark.vue")
    ),
    AnnounBtnComment: defineAsyncComponent(() =>
      import("./Buttons/AnnounBtnComment.vue")
    ),
    AnnounBtnLike: defineAsyncComponent(() =>
      import("./Buttons/AnnounBtnLike.vue")
    )
  },
  props: {
    announcement: {
      type: Object,
      required: true
    },
    mini: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    },
    showCart: {
      type: Boolean,
      default: false
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
      commentFormActive: false
    };
  }
};
</script>

<style lang="scss">
.announcement-actions .v-btn {
  min-width: 28px !important;
  letter-spacing: -0.2px;
}
.announcement-actions-top {
  position: absolute;
  top: 5px;
  right: 5px;
}
.v-locale--is-rtl .announcement-actions-top {
  right: auto;
  left: 5px;
}
</style>
