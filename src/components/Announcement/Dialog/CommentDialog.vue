<template>
  <div>
    <v-dialog
      v-model="active"
      max-width="600px"
      scrollable
      width="95%"
      @update:modelValue="close"
    >
      <v-card>
        <v-card-title class="px-3 d-flex justify-space-between align-center">
          <span>{{ $t("comment.title") }}</span>
          <v-btn :aria-label="$t('_.close')" icon @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-0 px-2">
          <v-list class="pb-0 pt-0">
            <v-list-item v-if="user" :key="user.id" class="px-4">
              <v-list-item-title
                class="comment-item__header body-2 font-weight-bold"
                @click="close()"
              >
                <router-link
                  v-if="scope.type === 'Store'"
                  :to="getStoreUrl(scope.entity)"
                >
                  <v-avatar class="me-2" size="25">
                    <ok-img :media-url="scope.avatarUrl"></ok-img>
                  </v-avatar>
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
                >
                  <user-avatar :user="user" class="me-2"></user-avatar>
                  {{ user.displayName }}
                </router-link>
              </v-list-item-title>
              <vv-form ref="form" v-slot="{ handleSubmit }">
                <vv-field
                  v-slot="{ field }"
                  v-model="commentForm.message"
                  name="comment"
                  rules="required|min:3|max:255"
                  mode="passive"
                >
                  <v-textarea
                    v-bind="field"
                    :model-value="commentForm.message"
                    hide-details="true"
                    no-resize
                    rows="2"
                    variant="outlined"
                    :bg-color="
                      $vuetify.theme.current.dark
                        ? 'grey-darken-3'
                        : 'grey-lighten-4'
                    "
                    class="mt-2"
                    :placeholder="$t('comment.placeholder')"
                  >
                  </v-textarea>
                </vv-field>

                <div class="d-flex justify-end py-2">
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
          <v-progress-linear
            indeterminate
            :active="loading > 0"
          ></v-progress-linear>
          <div v-if="loading">
            <v-skeleton-loader
              v-for="n in new Array(2)"
              :key="n"
              style="min-height: 70px"
              type="list-item-avatar"
            ></v-skeleton-loader>
          </div>
          <div
            v-else-if="notFound || (!loading && commentsList.data.length === 0)"
            class="text-caption text-center"
          >
            <v-divider class="mb-2"></v-divider>
            {{ $t("comment.empty") }}
          </div>
          <template v-else>
            <!--  eslint-disable vue/attribute-hyphenation -->
            <v-infinite-scroll
              style="
                height: 100%;
                width: 100%;
                overflow: hidden;
                padding-left: 1px;
                padding-right: 1px;
              "
              :items="commentsList.data"
              :onLoad="fetchMore"
            >
              <template v-for="item in commentsList.data" :key="item.id">
                <div class="comment-entry">
                  <v-divider></v-divider>
                  <lazy
                    min-height="70"
                    unrender
                    :unrender-delay="15000"
                    :root-margin="'0px'"
                  >
                    <template #skeleton>
                      <v-skeleton-loader
                        type="list-item-avatar"
                      ></v-skeleton-loader>
                    </template>
                    <template #default>
                      <comment-list-item
                        class="ma-1"
                        :announcement="announcement"
                        :item="item"
                        reply-enabled
                        @injectComment="injectComment"
                        @deleteComment="({ id }) => deleteComment({ id })"
                        @close="close"
                      ></comment-list-item>
                      <div class="comment-entry__reply">
                        <comment-list-item
                          v-for="reply in item.replies"
                          :key="reply.id"
                          :announcement="announcement"
                          :item="reply"
                          class="ma-1 ms-4"
                          @deleteComment="
                            ({ id }) => deleteComment({ id, parentId: item.id })
                          "
                          @close="close"
                        ></comment-list-item>
                      </div>
                    </template>
                  </lazy>
                </div>
              </template>
              <template #empty> </template>
            </v-infinite-scroll>
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import Queries from "@/views/Announcement/Announcement.graphql";
import { VInfiniteScroll } from "vuetify/labs/VInfiniteScroll";

import StoreUrlMixin from "@/components/Store/StoreUrlMixin";
import CommentItemMixin from "@/views/Announcement/mixins/CommentItemMixin";
import CommentListItem from "@/views/Announcement/components/ShowCommentListItem.vue";
import env from "@/utils/env";
import { get } from "lodash";

const STATUS = ["PUBLISHED", "EDITED"];

export default {
  components: { VInfiniteScroll, CommentListItem },
  mixins: [CommentItemMixin, StoreUrlMixin],
  props: {
    modelValue: {
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
      active: false,
      loading: 0,
      isEmpty: false,
      notFound: false,
      pagination: {
        page: 1,
        first: 10
      },
      commentForm: {
        loading: false,
        message: "",
        active: false
      },
      commentsList: {
        data: []
      },
      announcement: null,
      showMoreEnabled: true
    };
  },

  computed: {
    modelComment() {
      return this.$store.state.dialog.modelComment;
    },
    canDoActions() {
      return STATUS.includes(this.announcement.status);
    }
  },
  watch: {
    modelComment(value) {
      if (value) {
        this.open();
        this.active = true;
      }
    }
  },

  methods: {
    async submitAnnouncementComment() {
      this.commentForm.loading++;

      const comment = await this.submitComment(
        this.announcement.id,
        this.commentForm.message
      );

      this.clearInputs();

      this.commentForm.loading--;

      if (comment) this.injectComment({ comment });
    },

    injectComment({ comment, parentId }) {
      try {
        if (parentId) {
          const index = this.commentsList.data.findIndex(
            c => c.id === parentId
          );
          if (index > -1) this.commentsList.data[index].replies.push(comment);
        } else this.commentsList.data.unshift(comment);
        this.isEmpty = false;
        this.notFound = false;
      } catch (error) {
        if (env.isDev) console.error(error);
      }
    },
    deleteComment({ id, parentId }) {
      try {
        if (parentId) {
          const index = this.commentsList.data.findIndex(
            c => c.id === parentId
          );
          if (index > -1)
            this.deleteItemPerId(this.commentsList.data[index].replies, id);
        } else this.deleteItemPerId(this.commentsList.data, id);
        this.isEmpty = false;
        this.notFound = false;
      } catch (error) {
        if (env.isDev) console.error(error);
      }
    },
    deleteItemPerId(list, id) {
      const index = list.findIndex(c => c.id === id);
      if (index > -1) list.splice(index, 1);
    },

    open() {
      this.announcement = this.$store.getters.announcement;
      this.loadComment();
    },

    async loadComment() {
      this.commentsList.data = await this.fetchComment();
      if (this.commentsList.data.length === 0) this.notFound = true;
    },

    close() {
      this.active = false;
      this.reset();
      this.$store.commit("dialog/closeDialog", { name: "modelComment" });
    },

    reset() {
      this.commentsList.data = [];
      this.announcement = null;
      this.pagination.page = 1;
      this.$store.commit("app/setAnnouncement", null);
      this.isEmpty = false;
      this.notFound = false;
    },

    clearInputs() {
      this.commentForm.message = "";
    },

    async fetchMore({ done }) {
      if (this.isEmpty) return done("empty");
      this.pagination.page++;
      const newComments = await this.fetchComment(true);
      if (newComments.length > 0) done("ok");
      else {
        this.isEmpty = true;
        done("empty");
      }
      this.commentsList.data.push(...newComments);
    },
    async fetchComment(disableLoading = false) {
      if (!disableLoading) this.loading = 1;
      try {
        const { data } = await this.$apollo.query({
          fetchPolicy: "no-cache",
          query: Queries.AnnouncementCommentsGet,
          variables: {
            id: this.announcement.id,
            page: this.pagination.page,
            first: this.pagination.first
          }
        });
        this.loading = 0;
        return get(data, "commentsList.data", []);
      } catch (error) {
        this.loading = 0;
        if (env.isDev) console.error(error);
        return [];
      }
    }
  }
};
</script>
