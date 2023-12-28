<template>
  <v-row class="mt-1">
    <v-col cols="12" md="3">
      <div>
        <search-field
          v-model="filter.searchKeywords"
          class="mb-5"
          solo
        ></search-field>

        <v-card
          class="mt-2"
          elevation="1"
          :style="{
            maxHeight: '1440px',
            overflowY: 'auto'
          }"
        >
          <category-list-field
            v-model="filter.categorySlug"
            return-slug
          ></category-list-field>
        </v-card>
      </div>
    </v-col>

    <v-col cols="12" md="9">
      <template v-if="loading">
        <v-row class="mt-n3" dense>
          <v-col v-for="item in 12" :key="item" cols="12" sm="6" md="4">
            <ok-card-loader
              :target="
                $isMobile
                  ? 'MobileAnnouncementStore'
                  : 'DesktopAnnouncementStore'
              "
            ></ok-card-loader>
          </v-col>
        </v-row>
      </template>

      <template v-else-if="items && items.data && items.data.length">
        <v-row class="mt-n3" dense>
          <v-col
            v-for="item in items.data"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
          >
            <announcement-card
              :announcement="item"
              :store-page="true"
              :dark="config.theme === 'dark'"
            ></announcement-card>
          </v-col>
        </v-row>
      </template>

      <template v-else>
        <v-alert type="info" icon="mdi-magnify">
          {{ $t("components.announBrowser.noAnnouncements") }}
        </v-alert>
      </template>

      <div v-if="items.paginatorInfo.lastPage > 1" class="text-center mt-4">
        <pagination
          v-if="items.paginatorInfo && items.paginatorInfo.lastPage"
          v-model="pagination.page"
          :length="items.paginatorInfo.lastPage"
        ></pagination>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import okCardLoader from "@/components/uiKit/loader/okCardLoader";

import AnnouncementCard from "@/components/Announcement/AnnouncementCard.vue";
import CategoryListField from "@/components/SiteBuilder/Fields/CategoryListField.vue";
import SearchField from "@/components/SiteBuilder/Fields/SearchField.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import AnnounBrowserMixin from "@/components/SiteBuilder/Blocks/Store/AnnounBrowser/AnnounBrowserMixin.js";

export default {
  components: {
    okCardLoader,
    AnnouncementCard,
    SearchField,
    CategoryListField,
    Pagination
  },

  mixins: [BlocksHelperMixin, AnnounBrowserMixin]
};
</script>
<style scoped></style>
