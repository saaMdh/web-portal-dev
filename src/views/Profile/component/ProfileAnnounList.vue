<template>
  <div>
    <template v-if="loading">
      <v-skeleton-loader type="list-item-avatar@2"></v-skeleton-loader>
    </template>

    <template v-else-if="list.data.length > 0">
      <v-list density="comfortable" class="bookmark-desktop">
        <template v-for="(item, index) in list.data">
          <v-list-item
            v-if="item.id"
            :key="item.id"
            :to="{
              name: 'announcement_show',
              params: { slug: item.slug, id: item.id }
            }"
            @click="$emit('click')"
          >
            <template #prepend>
              <v-avatar>
                <ok-img :media-url="getMediaUrl(item)" />
              </v-avatar>
            </template>

            <v-list-item-title class="text-capitalize">
              {{ item.title }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-primary mb-1">
              <announ-price
                v-if="item.pricePreview"
                :price="item.pricePreview"
                :unit="item.priceUnit"
              ></announ-price>
              <div v-show="!item.pricePreview"></div>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ formatDateTime(item.createdAt) }}
            </v-list-item-subtitle>
            <template #append>
              <v-btn
                v-if="showRemovebtn"
                :aria-label="$t('_.delete')"
                color="red"
                icon
                variant="text"
                density="comfortable"
                @click.stop.prevent="$emit('remove', item.id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
          <v-divider
            v-if="index < list.data.length - 1"
            :key="'d' + item.id"
          ></v-divider>
        </template>
      </v-list>

      <div v-if="list.paginatorInfo.lastPage > 1" class="text-center pb-2">
        <pagination
          v-model="pagination"
          :length="list.paginatorInfo.lastPage"
          size="x-small"
        ></pagination>
      </div>
    </template>
    <div v-else class="d-flex justify-center align-center">
      <data-placeholder
        icon="mdi-bullhorn"
        class="pa-4"
        :scale="$isDesktop ? 0.6 : 0.6"
      >
        {{ $t("extras.AnyAnnouncement") }}
      </data-placeholder>
    </div>
  </div>
</template>

<script>
import AnnounPrice from "@/components/Announcement/AnnounPrice.vue";
import Pagination from "@/components/Pagination.vue";
import get from "lodash/get";

export default {
  components: { AnnounPrice, Pagination },
  props: {
    list: {
      type: Object,
      required: true
    },
    page: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    showRemovebtn: { type: Boolean, default: false }
  },
  emits: ["update:page", "remove"],
  computed: {
    pagination: {
      get() {
        return this.page;
      },
      set(v) {
        this.$emit("update:page", v);
      }
    }
  },
  methods: {
    getMediaUrl(announcement) {
      return get(announcement, "defaultMedia.mediaUrl", null);
    }
  }
};
</script>

<style scoped>
.bookmark-desktop .v-list-item-title {
  white-space: normal;
  line-height: 1.2em;
  font-size: 1rem;
}
</style>
