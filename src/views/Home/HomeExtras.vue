<template>
  <v-container grid-list-lg>
    <v-row row wrap fill-height>
      <v-col cols="12" md="3">
        <!-- Suggested -->
        <home-widget-store
          :list="suggestedStoreList.data"
          color="primary"
          :title="$t('home.extras.stores')"
          icon="mdi-account-heart"
        ></home-widget-store>
      </v-col>

      <v-col cols="12" md="3">
        <!-- Like -->
        <home-widget-anno
          :list="likedList.data"
          color="red"
          :title="$t('home.extras.likes')"
          icon="mdi-heart-circle"
        >
          <template #empty>
            <data-placeholder icon="mdi-cards-heart" :scale="0.5" class="pa-5">
              {{ $t("home.extras.likesEmpty") }} <br />
            </data-placeholder>
          </template>

          <template #anonymous>
            <data-placeholder icon="mdi-cards-heart" :scale="0.5" class="pa-5">
              {{ $t("home.extras.likesAnon") }} <br />
              <router-link class="text-caption" :to="{ name: 'login' }">{{
                $t("_.login")
              }}</router-link>
            </data-placeholder>
          </template>
        </home-widget-anno>
      </v-col>

      <v-col cols="12" md="3">
        <!-- History -->
        <home-widget-anno
          :list="historyList.data"
          :title="$t('home.extras.history')"
          icon="mdi-history"
        >
          <template #empty>
            <data-placeholder icon="mdi-history" :scale="0.5" class="pa-5">
              {{ $t("home.extras.historyEmpty") }} <br />
            </data-placeholder>
          </template>

          <template #anonymous>
            <data-placeholder icon="mdi-history" :scale="0.5" class="pa-5">
              {{ $t("home.extras.historyAnon") }} <br />
              <router-link class="text-caption" :to="{ name: 'login' }">{{
                $t("_.login")
              }}</router-link>
            </data-placeholder>
          </template>
        </home-widget-anno>
      </v-col>

      <v-col cols="12" md="3">
        <!-- Facebook -->
        <home-widget-base
          :list="historyList.data"
          color="#3b5998"
          :title="$t('home.extras.facebook')"
          icon="mdi-facebook"
        >
          <iframe
            title="facebook iframe"
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fouedkniss%2F&amp;tabs=timeline&amp;height=400&amp;small_header=true&amp;adapt_container_width=true&amp;hide_cover=false&amp;show_facepile=true&amp;appId=162550964393592"
            :width="$isDesktop ? 300 : 328"
            height="350"
            style="border:none;overflow:hidden"
            scrolling="no"
            frameborder="0"
            allowTransparency="true"
            allow="encrypted-media"
          ></iframe>
        </home-widget-base>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import HomeWidgetStore from "./components/HomeWidgetStore.vue";
import HomeWidgetBase from "./components/HomeWidgetBase.vue";
import HomeWidgetAnno from "./components/HomeWidgetAnno.vue";

import { gql } from "graphql-tag";

const LIKED_QUERY = gql`
  query LikedQuery($limit: Int!) {
    likedList: announcementLikeList(count: $limit, page: 1) {
      data {
        id
        title
        slug
        price
        defaultMedia(size: THUMB) {
          mediaUrl
        }
      }
    }
  }
`;
const HISTORY_QUERY = gql`
  query HistoryQuery($limit: Int!) {
    historyList(count: $limit, page: 1) {
      data {
        id
        title
        slug
        price
        defaultMedia(size: THUMB) {
          mediaUrl
        }
      }
    }
  }
`;
const SUGGESTED_STORE_QUERY = gql`
  query SuggestedStoreQuery($limit: Int!) {
    suggestedStoreList(count: $limit, page: 1) {
      data {
        id
        name
        followerCount
        imageUrl
        description
        url
      }
    }
  }
`;

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

export default {
  components: {
    HomeWidgetAnno,
    HomeWidgetBase,
    HomeWidgetStore
  },

  setup() {
    const { user } = useAuthFrame();

    return {
      user
    };
  },

  data() {
    return {
      likedList: { data: [] },
      historyList: { data: [] },
      suggestedStoreList: { data: [] }
    };
  },

  apollo: {
    likedList: {
      query: LIKED_QUERY,
      skip() {
        return this.user === null;
      },
      variables() {
        return { limit: 6 };
      }
    },

    historyList: {
      query: HISTORY_QUERY,
      skip() {
        return this.user === null;
      },
      variables() {
        return { limit: 6 };
      }
    },

    suggestedStoreList: {
      query: SUGGESTED_STORE_QUERY,
      variables() {
        return { limit: 6 };
      }
    }
  }
};
</script>

<style></style>
