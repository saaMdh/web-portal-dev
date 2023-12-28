<template>
  <div>
    <v-container grid-list-lg class="ok-profile">
      <v-row>
        <v-col cols="12" lg="3">
          <profile-user-card
            v-if="user"
            :user="user"
            class="ok-profile__aside"
          ></profile-user-card>
          <ok-card-loader v-else style="height: 300px"></ok-card-loader>
        </v-col>
        <v-col cols="12" lg="9" class="ps-lg-0 pt-0 pt-lg-3">
          <v-card
            v-if="user"
            class="ok-profile__content rounded-lg"
            elevation="1"
          >
            <v-tabs
              v-if="isMyProfile"
              v-model="tab.content"
              grow
              slider-color="primary"
            >
              <v-tab ripple href="#announcements">
                <v-icon>mdi-bullhorn</v-icon>
                <span v-if="$isDesktop">{{
                  $t("profile.tabs.announcements")
                }}</span>
              </v-tab>
              <v-tab ripple href="#likes">
                <v-icon>mdi-heart</v-icon>
                <span v-if="$isDesktop">{{ $t("profile.tabs.likes") }}</span>
              </v-tab>

              <!--<v-tab ripple href="#history">-->
              <!--  <v-icon>mdi-history</v-icon>-->
              <!--  <span v-if="$isDesktop">{{ $t("profile.tabs.history") }}</span>-->
              <!--</v-tab>-->

              <v-tab ripple href="#bookmarks">
                <v-icon>mdi-bookmark</v-icon>
                <span v-if="$isDesktop">{{
                  $t("profile.tabs.bookmarks")
                }}</span>
              </v-tab>

              <v-tab ripple href="#subscriptions">
                <v-icon>mdi-account-star</v-icon>
                <span v-if="$isDesktop">{{
                  $t("profile.tabs.subscriptions")
                }}</span>
              </v-tab>

              <v-tab ripple href="#followers">
                <v-icon>mdi-account-heart</v-icon>
                <span v-if="$isDesktop">{{
                  $t("profile.tabs.followers")
                }}</span>
              </v-tab>
            </v-tabs>

            <v-window v-model="tab.content" class="pt-3">
              <v-window-item value="announcements">
                <template v-if="$isMobile || !isMyProfile">
                  <div class="px-4 text-overline">
                    {{ $t("profile.tabs.announcements") }}
                  </div>
                  <v-divider></v-divider>
                </template>
                <profile-announ :user="user"></profile-announ>
              </v-window-item>

              <template v-if="isMyProfile">
                <v-window-item value="likes">
                  <template v-if="$isMobile">
                    <div class="px-4 text-overline">
                      {{ $t("profile.tabs.likes") }}
                    </div>
                    <v-divider></v-divider>
                  </template>
                  <profile-likes v-if="user" :user="user"></profile-likes>
                </v-window-item>

                <!--<v-window-item value="history">-->
                <!--  <template v-if="$isMobile">-->
                <!--    <div class="px-4 text-overline">-->
                <!--      {{ $t("profile.tabs.history") }}-->
                <!--    </div>-->
                <!--    <v-divider></v-divider>-->
                <!--  </template>-->
                <!--  <profile-history v-if="user" :user="user"></profile-history>-->
                <!--</v-window-item>-->

                <v-window-item value="bookmarks">
                  <template v-if="$isMobile">
                    <div class="px-4 text-overline">
                      {{ $t("profile.tabs.bookmarks") }}
                    </div>
                    <v-divider></v-divider>
                  </template>
                  <profile-bookmarks
                    v-if="user"
                    :user="user"
                  ></profile-bookmarks>
                </v-window-item>
              </template>
              <template v-if="isMyProfile">
                <v-window-item value="subscriptions">
                  <template v-if="$isMobile">
                    <div class="px-4 text-overline">
                      {{ $t("profile.tabs.subscriptions") }}
                    </div>
                    <v-divider></v-divider>
                  </template>
                  <profile-subscriptions :user="user"></profile-subscriptions>
                </v-window-item>

                <v-window-item value="followers">
                  <template v-if="$isMobile">
                    <div class="px-4 text-overline">
                      {{ $t("profile.tabs.followers") }}
                    </div>
                    <v-divider></v-divider>
                  </template>
                  <profile-followers :user="user"></profile-followers>
                </v-window-item>
              </template>
            </v-window>
          </v-card>
          <ok-card-loader v-else style="height: 200px"></ok-card-loader>
        </v-col>
      </v-row>
    </v-container>
    <template v-if="$apollo.queries.user.loading === false && !user">
      <wrong-turn
        :title="$t('profile.userNotFound.0')"
        :text="$t('profile.userNotFound.1')"
      ></wrong-turn>
    </template>
  </div>
</template>

<script>
import ProfileFollowers from "./ProfileFollowers.vue";
import ProfileSubscriptions from "./ProfileSubscriptions.vue";
import ProfileBookmarks from "./ProfileBookmarks.vue";
// import ProfileHistory from "./ProfileHistory.vue";
import ProfileLikes from "./ProfileLikes.vue";
import ProfileAnnoun from "./ProfileAnnoun.vue";
import ProfileUserCard from "./ProfileUserCard.vue";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import WrongTurn from "@/components/Content/WrongTurn.vue";
import okCardLoader from "@/components/uiKit/loader/okCardLoader";
export default {
  components: {
    ProfileUserCard,
    ProfileAnnoun,
    ProfileLikes,
    // ProfileHistory,
    ProfileBookmarks,
    ProfileSubscriptions,
    ProfileFollowers,
    okCardLoader,
    WrongTurn
  },
  setup() {
    const { user } = useAuthFrame();

    return {
      current: user
    };
  },

  data() {
    return {
      tab: {
        content:
          this.$route.params.tab == "bookmarks" ? "bookmarks" : "announcements"
      },
      user: null,

      announPagination: {
        page: 1,
        count: 8
      }
    };
  },

  head() {
    if (!this.user) return {};

    return {
      title: this.user.displayName
    };
  },

  computed: {
    isMyProfile() {
      return this.current ? this.current.id === this.user.id : false;
    }
  },

  watch: {
    user() {
      this.tab.content =
        this.$route.params.tab == "bookmarks" ? "bookmarks" : "announcements";
    },
    current() {
      this.$apollo.queries.user.refetch();
    }
  },

  apollo: {
    user: {
      query: require("./Profile.graphql").Profile,
      fetchPolicy: "network-only",
      variables() {
        return {
          id: this.$route.params.id,
          page: this.announPagination.page,
          count: this.announPagination.count
        };
      }
    }
  }
};
</script>
<style lang="scss">
.ok-profile .v-tab {
  min-width: 40px;
  padding: 0 10px;
  letter-spacing: 0;
}
.ok-profile .text-overline {
  letter-spacing: 0 !important;
}
</style>
