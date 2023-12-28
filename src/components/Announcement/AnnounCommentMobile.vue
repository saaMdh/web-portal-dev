<template>
  <v-card
    v-intersect="loadComments"
    class="mt-1 mt-md-3 rounded-lg elevation-1"
  >
    <v-card-text class="pa-0">
      <v-list class="pb-0 pt-0">
        <v-list-item v-if="user" :key="user.id" class="pl-2">
          <v-avatar size="36" class="align-self-start me-3">
            <ok-img
              v-if="scope.type === 'Store'"
              :media-url="scope.avatarUrl"
            ></ok-img>
            <user-avatar v-else :user="user"></user-avatar>
          </v-avatar>

          <span>
            <v-list-item-title
              class="comment-item__header body-2 font-weight-bold"
            >
              <router-link
                v-if="scope.type === 'Store'"
                :to="getStoreUrl(scope.entity)"
              >
                <v-icon
                  :color="$vuetify.theme.current.dark ? 'white' : 'black'"
                  size="small"
                  :class="$vuetify.locale.rtl ? 'ml-1' : 'mr-1'"
                  >mdi-store
                </v-icon>
                <strong
                  :class="
                    $vuetify.theme.current.dark ? 'text-white' : 'text-black'
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
                  $vuetify.theme.current.dark ? 'text-white' : 'text-black'
                "
                >{{ user.displayName }}
              </router-link>
            </v-list-item-title>
            <vv-form ref="form" v-slot="{ handleSubmit }" class="mt-1">
              <vv-field
                v-slot="{ field }"
                rules="required|min:3|max:255"
                mode="passive"
              >
                <v-textarea
                  v-bind="field"
                  v-model="commentForm.message"
                  hide-details="true"
                  no-resize
                  rows="2"
                  filled
                  rounded
                  class="rounded-lg mt-1"
                  :placeholder="$t('comment.placeholder')"
                >
                </v-textarea>
              </vv-field>

              <v-card-actions class="justify-end pr-0">
                <v-btn
                  :aria-label="$t('_.cancel')"
                  size="x-small"
                  variant="text"
                  rounded
                  @click.stop.prevent="clearInputs"
                >
                  {{ $t("_.cancel") }}
                </v-btn>
                <v-btn
                  :aria-label="$t('_.send')"
                  size="x-small"
                  depressed
                  rounded
                  color="primary"
                  :loading="commentForm.loading > 0"
                  :disabled="commentForm.message === ''"
                  @click="handleSubmit(submitAnnouncementComment)"
                >
                  {{ $t("_.send") }}
                </v-btn>
              </v-card-actions>
            </vv-form>
          </span>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-progress-linear indeterminate :active="loading > 0"></v-progress-linear>

    <v-alert
      v-if="!commentsList.data.length && !loading"
      variant="text"
      tile
      class="ma-0"
    >
      {{ $t("comment.empty") }}
    </v-alert>

    <div>
      <div
        v-for="item in commentsList.data.slice(0, 2)"
        :key="item.id"
        class="comment-entry"
      >
        <v-divider></v-divider>

        <comment-list-item
          :announcement="announcement"
          :item="item"
          reply-enabled
          @refresh="refresh"
        ></comment-list-item>

        <div class="comment-entry__reply">
          <comment-list-item
            v-for="reply in item.replies"
            :key="reply.id"
            :announcement="announcement"
            :item="reply"
          ></comment-list-item>
        </div>
      </div>
      <div v-if="commentsList.data.length > 2">
        <v-divider></v-divider>
        <v-alert dense tile class="ma-0">
          <router-link
            :to="{
              name: 'announcement_show',
              params: { id: announcement.id, slug: announcement.slug }
            }"
            class="text-decoration-underline text-grey"
          >
            {{ $t("comment.more") }}
          </router-link>
        </v-alert>
      </div>
    </div>

    <v-progress-linear indeterminate :active="loading > 0"></v-progress-linear>
  </v-card>
</template>

<script>
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

import CommentListItem from "../../views/Announcement/components/ShowCommentListItem.vue";
import StoreUrlMixin from "@/components/Store/StoreUrlMixin";

import CommentItemMixin from "../../views/Announcement/mixins/CommentItemMixin";
import gql from "graphql-tag";

export default {

  components: {
    CommentListItem
  },
  mixins: [CommentItemMixin, StoreUrlMixin],

  props: {
    announcement: {
      type: Object,
      required: true
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
      commentForm: {
        loading: false,
        message: "",
        active: false
      },
      commentsList: {
        data: [],
        paginatorInfo: {
          lastPage: 0
        }
      },
      enabled: true
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
      this.commentForm.active = !this.commentForm.active;
    },

    loadComments() {
      this.trigger = true;
    }
  },

  apollo: {
    commentsList: {
      loadingKey: "loading",
      fetchPolicy: "network-only",
      query: gql`
        query ($id: ID!) {
          commentsList: announcementCommentList(
            announcementId: $id
            orderBy: { column: CREATED_AT, order: DESC }
          ) {
            paginatorInfo {
              hasMorePages
            }
            data {
              id
              createdAt
              content
              likesCount
              dislikesCount
              user {
                id
                username
                displayName
                avatarUrl
              }
              store {
                id
                name
                slug
                imageUrl
              }
              announcement {
                id
                isCommentEnabled
              }
              replies {
                id
                createdAt
                content
                likesCount
                dislikesCount
                iReported
                user {
                  id
                  username
                  displayName
                  avatarUrl
                }
                store {
                  id
                  name
                  slug
                  imageUrl
                }
              }
            }
          }
        }
      `,
      variables() {
        return {
          id: this.announcement.id
        };
      },
      skip() {
        return !this.trigger;
      },
      result({ data, loading }) {
        if (loading) return;
        this.commentsList = data.commentsList;
      }
    }
  }
};
</script>

<style lang="scss">
.comment-entry {
  &__reply {
    padding-left: 0;
    padding-right: 0;
    margin-left: 36px;
  }
}
</style>
