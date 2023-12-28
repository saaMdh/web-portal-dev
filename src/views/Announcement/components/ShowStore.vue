<template>
  <v-card
    v-if="announcement.isFromStore"
    elevation="1"
    class="o-announcement-store py-3 px-4 rounded-lg"
    :to="getStoreUrl(announcement.store)"
  >
    <v-row>
      <v-col cols="12" sm="3" md="3" lg="2" class="d-print-none text-center">
        <store-img
          :height="$isDesktop ? 110 : 150"
          class="mx-auto rounded"
          :store="announcement.store"
          position="top center"
          contain
        />
      </v-col>
      <v-col cols="12" sm="9" md="9" lg="10" class="pt-0 pt-sm-3">
        <h4 class="text-h6 font-weight-medium text-capitalize">
          {{ storeName }}
        </h4>

        <div class="font-weight-light">
          {{ storeDescription }}
        </div>

        <div v-if="locations" class="text-capitalize">
          <v-icon size="small">mdi-map-marker</v-icon>
          <span>{{ locations }}</span>
        </div>
        <div class="d-flex flex-wrap mt-2 d-print-none">
          <div class="d-flex flex-gap-2">
            <v-chip size="small" color="yellow-darken-3" dark label>
              {{ announcement.store.announcementsCount }}
              {{ $t("announcement.announcements") }}
            </v-chip>
            <v-chip size="small" color="red" dark label>
              {{ formatFollower(announcement.store.followerCount) }}
              {{ $t("announcement.subscriptions") }}
            </v-chip>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import map from "lodash/map";

import StoreUrlMixin from "@/components/Store/StoreUrlMixin";

export default {
  mixins: [StoreUrlMixin],

  props: {
    announcement: Object
  },

  computed: {
    locations() {
      const loc = map(
        this.announcement.store.locations,
        loc => `${loc.location.address} (${loc.location.region.name})`
      ).join(", ");

      return this.HTMLEncode(loc);
    },
    storeName() {
      return this.HTMLEncode(this.announcement.store.name);
    },
    storeDescription() {
      if (this.announcement.store.description === null) return "";
      return this.HTMLEncode(this.announcement.store.description);
    }
  },
  methods: {
    HTMLEncode(str) {
      return str.replace(/(&#(\d+);)/g, function (match, capture, charCode) {
        return String.fromCharCode(charCode);
      });
    }
  }
};
</script>
