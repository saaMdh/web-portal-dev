<template>
  <div class="o-home-feed py-0">
    <section-heading :category="category" tag="h2">
      <template #title>
        {{ category.name }}
      </template>
    </section-heading>
    <lazy
      min-height="325"
      unrender
      :backend-loading="!announcementFeed"
      @render="triggerLoad"
    >
      <template #skeleton>
        <v-row dense class="mb-5 py-1">
          <v-col
            v-for="i in $isMobile ? 6 : 12"
            :key="i"
            lg="2"
            md="3"
            sm="4"
            cols="6"
          >
            <ok-card-loader :target="'AnnouncementMini'"></ok-card-loader>
          </v-col>
        </v-row>
      </template>
      <template #default>
        <v-row dense class="mb-5 py-1">
          <v-col
            v-for="(item, i) in announcementFeed.announcements.data"
            :key="item.id + i"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <announcement-card
              :announcement="item"
              hide-store
              hide-description
              mini
            ></announcement-card>
          </v-col>
        </v-row>
      </template>
    </lazy>
  </div>
</template>

<script>
import SectionHeading from "@/components/Content/SectionHeading.vue";
import okCardLoader from "@/components/uiKit/loader/okCardLoader";
import { getFetchPolicyForKey } from "@ouedkniss/web-ui-plugin/src/utils/getFetchPolicyForKey";
import gql from "graphql-tag";
import { ANNOUNCEMENT_MINI_CONTENT } from "@/components/Announcement/fragement.js";
import { defineAsyncComponent } from "vue";

const FEED = gql`
  ${ANNOUNCEMENT_MINI_CONTENT}
  query Feed(
    $filter: SearchFilterInput
    $mediaSize: MediaSize = SMALL
    $hideStore: Boolean = false
  ) {
    announcementFeed(filter: $filter) {
      announcements {
        data {
          ...AnnouncementMiniContent
        }
        paginatorInfo {
          hasMorePages
        }
      }
    }
  }
`;

export default {
  components: {
    AnnouncementCard: defineAsyncComponent(() =>
      import("@/components/Announcement/AnnouncementCard")
    ),
    SectionHeading,
    okCardLoader
  },

  props: {
    category: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      trigger: false,
      announcementFeed: null,
      filter: {
        categorySlug: this.category.slug,
        hasPictures: true
      },
      data: []
    };
  },
  apollo: {
    announcementFeed: {
      query: FEED,
      fetchPolicy: getFetchPolicyForKey("announcementFeed", 1000 * 60 * 30),
      skip() {
        return !this.trigger && this.index > 2;
      },
      variables() {
        return {
          filter: {
            page: 1,
            count: this.$isMobile ? 6 : 12,
            ...this.filter
          }
        };
      }
    }
  },
  methods: {
    triggerLoad() {
      this.trigger = true;
    }
  }
};
</script>

<style lang="scss"></style>
