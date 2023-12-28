<template>
  <div v-if="announcement.isCommentEnabled">
    <section-heading icon="mdi-comment" icon-color="primary">
      <template #title>{{ $t("comment.title") }}</template>
    </section-heading>
    <v-card
      v-intersect.quiet.once="loadComments"
      elevation="1"
      class="pa-2 mt-1 mt-md-3 rounded-lg"
    >
      <!-- Main comment inputs -->
      <template v-if="user">
        <v-list class="pb-0 pt-0">
          <v-list-item :key="user.id" class="px-2">
            <v-list-item-title
              class="comment-item__header body-2 font-weight-bold"
            >
              <router-link
                v-if="scope.type === 'Store'"
                :to="getStoreUrl(scope.entity)"
              >
                <v-avatar v-if="scope.type === 'Store'" size="25" class="me-2">
                  <ok-img
                    v-if="scope.type === 'Store'"
                    :media-url="scope.avatarUrl"
                  ></ok-img>
                </v-avatar>

                <user-avatar v-else :user="user"></user-avatar>
                <strong
                  :class="
                    $vuetify.theme.current.dark || dark
                      ? 'text-white'
                      : 'text-black'
                  "
                  size="small"
                >
                  {{ scope.name }}
                </strong>
              </router-link>
              <router-link
                v-else
                :to="{ name: 'profile', params: { id: user.id } }"
                :class="
                  $vuetify.theme.current.dark || dark
                    ? 'text-white'
                    : 'text-black'
                "
              >
                <user-avatar :user="user" class="me-2"></user-avatar>
                {{ user.displayName }}
              </router-link>
            </v-list-item-title>
            <vv-form ref="form" v-slot="{ handleSubmit }" class="mt-1">
              <vv-field
                v-slot="{ field }"
                v-model="commentForm.message"
                name="message"
                rules="required|min:3|max:255"
              >
                <v-textarea
                  v-bind="field"
                  :model-value="commentForm.message"
                  hide-details
                  no-resize
                  rows="2"
                  variant="outlined"
                  :bg-color="
                    $vuetify.theme.current.dark || dark
                      ? 'grey-darken-3'
                      : 'grey-lighten-4'
                  "
                  class="rounded mt-2"
                  :placeholder="$t('comment.placeholder')"
                >
                </v-textarea>
              </vv-field>

              <div class="d-flex justify-end py-2">
                <v-btn
                  v-show="commentForm.message !== ''"
                  :aria-label="$t('_.cancel')"
                  size="small"
                  variant="text"
                  rounded
                  @click="clearInputs"
                >
                  {{ $t("_.cancel") }}
                </v-btn>
                <v-btn
                  :aria-label="$t('_.send')"
                  size="small"
                  depressed
                  rounded
                  color="primary"
                  :loading="commentForm.loading > 0"
                  :disabled="commentForm.message === ''"
                  @click="handleSubmit(submitAnnouncementComment)"
                >
                  {{ $t("_.send") }}
                </v-btn>
              </div>
            </vv-form>
          </v-list-item>
        </v-list>
        <v-divider class="mb-2"></v-divider>
      </template>

      <!-- Replies items -->
      <v-progress-linear
        indeterminate
        :active="loading > 0"
      ></v-progress-linear>

      <div
        v-if="!commentsList.data.length && !loading"
        class="text-body-2 pa-2"
      >
        {{ $t("comment.empty") }}
      </div>

      <div
        v-for="(item, index) in commentsList.data"
        :key="item.id"
        class="comment-entry"
      >
        <v-divider v-if="index > 0"></v-divider>
        <comment-list-item
          :announcement="announcement"
          :item="item"
          reply-enabled
          class="ma-1"
          @refresh="refresh"
        ></comment-list-item>

        <div class="comment-entry__reply">
          <comment-list-item
            v-for="reply in item.replies"
            :key="reply.id"
            :announcement="announcement"
            :item="reply"
            class="ma-1 ms-4"
          ></comment-list-item>
        </div>
      </div>

      <div
        v-if="commentsList.paginatorInfo.hasMorePages"
        class="d-flex justify-center mt-2"
      >
        <v-btn
          :aria-label="$t('comment.more')"
          variant="tonal"
          size="small"
          class="my-2"
          @click="fetchMore"
        >
          {{ $t("comment.more") }}
        </v-btn>
      </div>

      <v-progress-linear
        indeterminate
        :active="loading > 0"
      ></v-progress-linear>
    </v-card>
  </div>
</template>

<script>
import SectionHeading from "@/components/Content/SectionHeading.vue";
import StoreUrlMixin from "@/components/Store/StoreUrlMixin";

import CommentItemMixin from "../mixins/CommentItemMixin";

import Queries from "../Announcement.graphql";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { defineAsyncComponent } from "vue";
export default {
  components: {
    CommentListItem: defineAsyncComponent(() =>
      import("./ShowCommentListItem.vue")
    ),
    SectionHeading
  },
  mixins: [CommentItemMixin, StoreUrlMixin],

  props: {
    announcement: {
      type: Object,
      required: true
    },
    dark: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const { user, scope } = useAuthFrame();

    return {
      user,
      scope
    };
  },

  data() {
    return {
      trigger: false,
      loading: 0,
      pagination: {
        page: 1,
        first: 10
      },
      commentForm: {
        loading: false,
        message: ""
      },
      commentsList: {
        data: [],
        paginatorInfo: { hasMorePages: false }
      },
      showMoreEnabled: true
    };
  },

  computed: {
    canComment() {
      const STATUS = ["PUBLISHED", "EDITED"];
      return STATUS.includes(this.announcement.status);
    }
  },

  methods: {
    async submitAnnouncementComment() {
      this.commentForm.loading++;

      await this.submitComment(this.announcement.id, this.commentForm.message);

      this.clearInputs();

      this.commentForm.loading--;

      this.refresh();
    },

    refresh() {
      return this.$apollo.queries.commentsList.refetch();
    },

    clearInputs() {
      this.commentForm.message = "";
    },

    loadComments() {
      this.trigger = true;
    },

    fetchMore() {
      this.pagination.page++;

      this.$apollo.queries.commentsList.fetchMore({
        variables: {
          announcementId: this.announcement.id,
          first: this.pagination.first,
          page: this.pagination.page
        },

        updateQuery: (previousResult, { fetchMoreResult }) => {
          return {
            commentsList: {
              __typename: previousResult.commentsList.__typename,

              data: [
                ...previousResult.commentsList.data,
                ...fetchMoreResult.commentsList.data
              ],
              paginatorInfo: fetchMoreResult.commentsList.paginatorInfo
            }
          };
        }
      });
    }
  },
  apollo: {
    commentsList: {
      loadingKey: "loading",
      fetchPolicy: "network-only",
      query: Queries.AnnouncementCommentsGet,
      skip() {
        return !this.trigger;
      },
      variables() {
        return {
          id: this.announcement.id,
          page: 1,
          first: this.pagination.first
        };
      },
      result({ data, loading }) {
        if (loading) return;
        this.commentsList = data.commentsList;
      }
    }
  }
};
</script>
