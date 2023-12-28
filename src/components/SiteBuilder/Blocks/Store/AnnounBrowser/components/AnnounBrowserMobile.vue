<template>
  <div>
    <div class="mb-3">
      <search-field v-model="filter.searchKeywords" solo></search-field>
      <sub-category-select-field
        v-model="filter.categorySlug"
        return-slug
        hide-icon
      ></sub-category-select-field>
    </div>

    <template v-if="loading">
      <v-row dense>
        <v-col
          v-for="item in 12"
          :key="item"
          cols="12"
          :sm="$isMobile && !$store.state.builder.editor.phone ? 6 : null"
        >
          <ok-card-loader
            :target="
              $isMobile ? 'MobileAnnouncementStore' : 'DesktopAnnouncementStore'
            "
          ></ok-card-loader>
        </v-col>
      </v-row>
    </template>

    <template v-else-if="items.data && items.data.length">
      <v-row dense>
        <v-col
          v-for="item in items.data"
          :key="item.id"
          cols="12"
          :sm="$isMobile && !$store.state.builder.editor.phone ? 6 : null"
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import okCardLoader from "@/components/uiKit/loader/okCardLoader";

import AnnouncementCard from "@/components/Announcement/AnnouncementCard.vue";
import SubCategorySelectField from "@/components/SiteBuilder/Fields/SubCategorySelectField.vue";
import SearchField from "@/components/SiteBuilder/Fields/SearchField.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import AnnounBrowserMixin from "@/components/SiteBuilder/Blocks/Store/AnnounBrowser/AnnounBrowserMixin.js";

export default {
  components: {
    okCardLoader,
    AnnouncementCard,
    SearchField,
    SubCategorySelectField,
    Pagination
  },

  mixins: [BlocksHelperMixin, AnnounBrowserMixin]
};
</script>
