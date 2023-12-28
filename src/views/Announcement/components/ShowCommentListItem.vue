<template>
  <div class="comment-item" :class="{ '--reported': reported }">
    <v-list class="pb-0 pt-0" density="compact">
      <v-list-item :key="item.id" class="pa-0">
        <template #prepend>
          <v-avatar size="30" class="align-self-start">
            <store-img
              v-if="item.store"
              :store="item.store"
              contain
            ></store-img>
            <user-avatar v-else :user="item.user"></user-avatar>
          </v-avatar>
        </template>

        <v-list-item-title
          class="comment-item__header body-2"
          @click="$emit('close')"
        >
          <router-link
            v-if="item.store"
            :to="getStoreUrl(item.store)"
            class="me-2"
          >
            <v-icon
              :color="$vuetify.theme.current.dark ? 'white' : 'black'"
              size="x-small"
              class="font-weight-bold me-1 mt-1"
              >mdi-store
            </v-icon>
            <strong
              :class="$vuetify.theme.current.dark ? 'text-white' : 'text-black'"
              size="small"
            >
              {{ storeName }}
            </strong>
          </router-link>
          <router-link
            v-else
            :to="{ name: 'profile', params: { id: item.user.id } }"
            class="font-weight-bold me-2"
            :class="$vuetify.theme.current.dark ? 'text-white' : 'text-black'"
          >
            {{ item.user.displayName }}
          </router-link>
          <span class="text-grey caption d-inline-block">
            {{ formatDate(item.createdAt) }}
          </span>
        </v-list-item-title>
        <v-list-item-subtitle class="d-block">
          {{ content }}
        </v-list-item-subtitle>

        <div
          v-if="user && !isOwnUser && !reported"
          class="reply d-flex align-center mt-1"
        >
          <v-btn
            :aria-label="$t('_.like')"
            size="x-small"
            variant="text"
            class="text-green px-0"
            @click="like"
          >
            <v-icon color="green">mdi-thumb-up</v-icon>
            <div class="px-1">{{ likesCount }}</div>
          </v-btn>

          <v-btn
            :aria-label="$t('_.dislike')"
            size="x-small"
            variant="text"
            class="text-red px-0"
            @click="dislike"
          >
            <v-icon color="red">mdi-thumb-down</v-icon>
            <div class="px-1">{{ dislikesCount }}</div>
          </v-btn>

          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-btn
                :aria-label="$t('_.report')"
                size="x-small"
                v-bind="props"
                class="mx-1"
                @click="report"
              >
                <v-icon color="primary">mdi-flag</v-icon>
              </v-btn>
            </template>

            <span>{{ $t("_.report") }}</span>
          </v-tooltip>
          <div
            v-if="replyEnabled && isRoleGranted('COMMENTING')"
            class="d-inline-block"
          >
            <v-btn
              :aria-label="$t('_.reply')"
              size="x-small"
              variant="outlined"
              class="text-capitalize mx-1"
              @click="replyForm.active = !replyForm.active"
            >
              {{ $t("_.reply") }}
            </v-btn>

            <v-btn
              v-if="isOwnUser || user.isAdmin"
              :aria-label="$t('_.delete')"
              size="x-small"
              variant="outlined"
              color="red"
              @click="this.delete"
            >
              {{ $t("_.delete") }}
            </v-btn>
          </div>
        </div>
        <div v-else-if="user && isOwnUser && !reported" class="mt-1">
          <v-btn
            :aria-label="$t('_.delete')"
            size="x-small"
            variant="outlined"
            color="red"
            @click="this.delete"
          >
            {{ $t("_.delete") }}
          </v-btn>
        </div>

        <v-expand-transition v-if="replyEnabled">
          <vv-form
            v-if="replyForm.active"
            ref="form"
            v-slot="{ handleSubmit, meta }"
            class="mt-1"
          >
            <vv-field
              v-slot="{ field }"
              v-model="replyForm.message"
              name="comment"
              rules="required|min:3|max:255"
              mode="passive"
            >
              <v-textarea
                v-bind="field"
                :model-value="replyForm.message"
                hide-details
                no-resize
                rows="2"
                filled
                variant="outlined"
                class="rounded-lg mt-1"
                :placeholder="$t('comment.replyPlaceholder')"
              >
              </v-textarea>
            </vv-field>

            <v-card-actions class="justify-end pe-0">
              <v-btn
                :aria-label="$t('_.cancel')"
                size="small"
                text
                rounded="xl"
                @click="clearInputs"
              >
                {{ $t("_.cancel") }}
              </v-btn>
              <v-btn
                :aria-label="$t('_.send')"
                size="small"
                depressed
                rounded="xl"
                color="primary"
                :loading="replyForm.loading > 0"
                :disabled="!meta.valid || replyForm.message === ''"
                @click="handleSubmit(submitReply)"
              >
                {{ $t("_.send") }}
              </v-btn>
            </v-card-actions>
          </vv-form>
        </v-expand-transition>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import StoreUrlMixin from "@/components/Store/StoreUrlMixin";
import CommentItemMixin from "../mixins/CommentItemMixin";

import Queries from "../Announcement.graphql";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

export default {
  mixins: [CommentItemMixin, StoreUrlMixin],

  props: {
    announcement: {
      type: Object,
      required: true
    },

    item: {
      type: Object,
      required: true
    },

    replyEnabled: {
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
      reported: this.item.iReported,
      likesCount: this.item.likesCount,
      dislikesCount: this.item.dislikesCount,
      replyForm: {
        active: false,
        loading: 0,
        message: ""
      }
    };
  },

  computed: {
    isOwnUser() {
      return this.user && this.user.id === this.item.user.id;
    },

    storeName() {
      return this.HTMLEncode(this.item.store.name);
    },

    content() {
      return this.HTMLEncode(this.item.content);
    }
  },

  watch: {
    item: {
      deep: true,
      handler(item) {
        this.likesCount = item.likesCount;
        this.dislikesCount = item.dislikesCount;
      }
    }
  },

  methods: {
    async like() {
      const { data } = await this.$apollo.mutate({
        mutation: Queries.CommentReaction,
        variables: { commentId: this.item.id, type: "POSITIVE" }
      });

      this.likesCount = data.announcementCommentReact.comment.likesCount;
    },

    async dislike() {
      const { data } = await this.$apollo.mutate({
        mutation: Queries.CommentReaction,
        variables: { commentId: this.item.id, type: "NEGATIVE" }
      });

      this.dislikesCount = data.announcementCommentReact.comment.dislikesCount;
    },

    async report() {
      const confirm = await this.$confirm({
        message: this.$t("comment.alert.report.0"),
        icon: "mdi-flag",
        iconColor: "red"
      });

      if (!confirm) return;

      await this.$apollo.mutate({
        mutation: Queries.CommentReport,
        variables: { id: this.item.id }
      });

      this.reported = true;
    },

    async submitReply() {
      this.replyForm.loading++;

      const comment = await this.submitComment(
        this.announcement.id,
        this.replyForm.message,
        this.item.id
      );

      this.clearInputs();

      this.replyForm.loading--;
      if (comment)
        this.$emit("injectComment", { comment, parentId: this.item.id });
    },

    clearInputs() {
      this.replyForm.message = "";
      this.replyForm.active = false;
    },
    async delete() {
      const confirm = await this.$confirm({
        message: this.$t("comment.alert.delete.0"),
        icon: "mdi-delete",
        iconColor: "red"
      });

      if (!confirm) return;

      await this.$apollo.mutate({
        mutation: Queries.CommentDelete,
        variables: { id: this.item.id }
      });
      this.$emit("deleteComment", { id: this.item.id });
    },
    HTMLEncode(str) {
      return str.replace(/(&#(\d+);)/g, function (match, capture, charCode) {
        return String.fromCharCode(charCode);
      });
    }
  }
};
</script>

<style lang="scss">
.comment-item {
  &__header {
    white-space: normal;
    a {
      text-decoration: none;
    }
  }
  &:hover {
    background: rgb(var(--v-theme-background));
  }

  &.--reported {
    background: #ffd9d9;
    > * {
      filter: blur(4px);
      pointer-events: none;
      user-select: none;
    }
  }
}
.reply {
  white-space: normal;
}
</style>
