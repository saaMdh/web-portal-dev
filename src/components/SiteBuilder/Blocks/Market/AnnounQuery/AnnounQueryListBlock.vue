<template>
  <v-container fluid class="s-annon-query-list-block-market">
    <text-editor
      v-if="config.caption"
      v-model="config.name"
      class="mb-4"
      @update:modelValue="update"
    >
      <h1 class="font-weight-bold s-annon-query-list-block-market__title">
        {{ config.name ? config.name[$i18n.locale] : "" }}
      </h1>
    </text-editor>
    <v-row>
      <v-col cols="12" md="12">
        <template v-if="loading">
          <v-row class="mt-n3">
            <v-col
              v-for="item in 8"
              :key="item"
              :cols="$isMobile ? 12 : 3"
              :sm="$isMobile && !$store.state.builder.editor.phone ? 6 : null"
            >
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

        <template v-else-if="items && items.length">
          <v-row class="mt-n3">
            <v-col
              v-for="(item, index) in showItems"
              :key="`${item.id}-${index}`"
              :cols="$isMobile ? 12 : 3"
              :sm="$isMobile && !$store.state.builder.editor.phone ? 6 : null"
              class="pa-2"
            >
              <announcement-card
                show-store
                :store-page="true"
                :announcement="item"
                :dark="config.theme === 'dark'"
              ></announcement-card>
            </v-col>
          </v-row>
        </template>
        <template
          v-else-if="!config.value || !config.value.sourceValue.length > 0"
        >
          <v-alert type="info" icon="mdi-magnify">
            {{ $t("components.announBrowser.noAnnouncements") }}
          </v-alert>
        </template>
      </v-col>
    </v-row>
    <div class="d-flex justify-center">
      <v-btn
        v-if="!showAll && items && items.length > 8"
        :aria-label="$t('home.feed.showMore')"
        depressed
        size="small"
        class="mt-4"
        color="primary"
        variant="text"
        @click="showAll = !showAll"
      >
        {{ $t("home.feed.showMore") }}
        <v-icon end :class="{ 'mt-n1': !$vuetify.locale.rtl }"
          >mdi-chevron-down</v-icon
        >
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import okCardLoader from "@/components/uiKit/loader/okCardLoader";
import AnnouncementCard from "@/components/Announcement/AnnouncementCard.vue";
import TextEditor from "@/components/SiteBuilder/Editors/TextEditor.vue";

import AnnounQueryMixin from "@/components/SiteBuilder/Blocks/Market/AnnounQuery/AnnounQueryMixin.js";

export default {
  components: {
    okCardLoader,
    TextEditor,
    AnnouncementCard
  },
  mixins: [AnnounQueryMixin]
};
</script>
<style lang="scss">
@import "~@/scss/responsive";
.s-annon-query-list-block-market {
  &__title {
    font-family: inherit !important;
    text-decoration: underline;
    text-underline-offset: 8px;
    text-decoration-color: rgb(var(--v-theme-primary));
  }
}
</style>
