<template>
  <div v-if="announcement.isFromStore && list.announcements.data.length > 4">
    <section-heading icon="mdi-store" icon-color="primary">
      <template #title>{{ $t("announcement.sameAuthor.title") }}</template>
    </section-heading>

    <lazy min-height="280" unrender :backend-loading="loading > 0">
      <template #skeleton>
        <v-row dense class="my-0 mx-n1">
          <v-col
            v-for="i in $r({
              lg: 6,
              md: 4,
              sm: 3,
              xs: 2
            })"
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
        <swiper
          v-if="list"
          v-slot="{ item }"
          class="mx-n1 mt-0 mt-md-1"
          :slides-per-view="$r({ xs: 2.1, sm: 4.1, md: 5.1, lg: 6.1 })"
          :space-between="0"
          :items="filteredItems"
          :navigation="$isDesktop"
          fill-height
        >
          <announcement-card
            class="ma-1"
            :announcement="item"
            hide-store
            hide-description
            mini
          ></announcement-card>
        </swiper>
      </template>
    </lazy>
  </div>
</template>

<script>
import SectionHeading from "@/components/Content/SectionHeading.vue";
import okCardLoader from "@/components/uiKit/loader/okCardLoader";
import AnnouncementQuery from "../Announcement.graphql";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    okCardLoader,
    SectionHeading,
    AnnouncementCard: defineAsyncComponent(() =>
      import("@/components/Announcement/AnnouncementCard.vue")
    ),
    Swiper: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
    )
  },

  props: {
    announcement: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      list: {
        announcements: {
          data: []
        }
      },
      loading: 0
    };
  },

  computed: {
    filteredItems() {
      return this.list.announcements.data.filter(
        l => l.id !== this.announcement.id
      );
    }
  },

  apollo: {
    list: {
      query: AnnouncementQuery.SameAuthor,
      fetchPolicy: "network-only",
      loadingKey: "loading",
      variables() {
        return {
          filter: {
            userId: this.announcement.user.id,
            count: 8,
            page: 1
          }
        };
      }
    }
  }
};
</script>

<style></style>
