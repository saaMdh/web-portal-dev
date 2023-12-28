<template>
  <div v-if="list.length > 0" class="o-show-suggested">
    <section-heading icon="mdi-folder-star" icon-color="primary">
      <template #title>{{ $t("announcement.suggested.title") }}</template>
    </section-heading>

    <v-row dense class="mt-0 mt-md-1">
      <v-col
        v-for="(item, i) in list"
        :key="`${item.id}-${i}`"
        cols="6"
        sm="3"
        md="3"
        lg="2"
      >
        <lazy
          min-height="270"
          unrender
          :unrender-delay="5000"
          :root-margin="'100px'"
        >
          <template #skeleton>
            <ok-card-loader :target="'AnnouncementMini'"></ok-card-loader>
          </template>
          <template #default>
            <announcement-card
              :announcement="item"
              hide-store
              hide-description
              mini
            ></announcement-card>
          </template>
        </lazy>
      </v-col>
    </v-row>

    <div v-intersect.quite="intersect" class="__trigger"></div>

    <div class="my-4 d-flex align-center justify-center">
      <v-progress-circular
        v-if="loading > 0"
        color="primary"
        rounded
        indeterminate
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
import okCardLoader from "@/components/uiKit/loader/okCardLoader";
import SectionHeading from "@/components/Content/SectionHeading.vue";
import gql from "graphql-tag";
import { defineAsyncComponent } from "vue";

const ANNOUNCEMENT_SUGGESTIONS = gql`
  query AnnouncementSuggestions(
    $id: ID!
    $count: Int
    $offset: Int
    $mediaSize: MediaSize = SMALL
  ) {
    list: announcementSuggestions(id: $id, count: $count, offset: $offset) {
      id
      title
      slug
      defaultMedia(size: $mediaSize) {
        mediaUrl
      }
      userReaction {
        isBookmarked
        isLiked
      }
      hasDelivery
      deliveryType
      likeCount
      status
      pricePreview
      priceUnit
      oldPrice
      store {
        id
      }
      user {
        id
      }
    }
  }
`;

export default {
  components: {
    okCardLoader,
    AnnouncementCard: defineAsyncComponent(() =>
      import("@/components/Announcement/AnnouncementCard.vue")
    ),
    SectionHeading
  },

  props: {
    id: [String, Number]
  },

  data() {
    return {
      loading: 0,
      list: [],
      pagination: {
        page: 0,
        offset: 0
      }
    };
  },

  computed: {
    //avoid massive elements on,mobile
    count() {
      return this.$isMobile ? 4 : 6 * 4;
    }
  },

  apollo: {
    list() {
      return {
        query: ANNOUNCEMENT_SUGGESTIONS,
        loadingKey: "loading",
        variables: {
          id: this.id,
          count: this.count,
          offset: this.pagination.offset
        }
      };
    }
  },

  methods: {
    intersect(_e, _o, isInteresecting) {
      if (!isInteresecting) return;
      if (this.loading > 0) return;
      this.fetchMore();
    },

    fetchMore() {
      this.pagination.page++;
      this.pagination.offset = this.pagination.page * this.count;

      this.$apollo.queries.list.fetchMore({
        variables: {
          count: this.count,
          offset: this.pagination.offset
        },
        updateQuery: (data, { fetchMoreResult }) => {
          return { list: [...data.list, ...fetchMoreResult.list] };
        }
      });
    }
  }
};
</script>

<style lang="scss">
.o-show-suggested {
  .__trigger {
    position: relative;
    top: -25vh;
  }
}
</style>
