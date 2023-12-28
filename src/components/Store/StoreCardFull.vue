<template>
  <router-link
    :class="{
      'v-theme--dark': $vuetify.theme.current.dark,
      'v-theme--light': !$vuetify.theme.current.dark
    }"
    class="o-store-card-full v-card v-card--link elevation-1 rounded"
    :to="getStoreUrl(store)"
    @click="event => handlePromotionClick(event)"
  >
    <div class="__head">
      <div class="__logo">
        <div class="v-card v-card--link d-flex rounded-circle elevation-2">
          <store-img
            :store="store"
            contain
            width="140"
            height="140"
          ></store-img>
        </div>
      </div>
      <div v-if="announcements.length == 0" class="__gallery"></div>
      <div v-if="announcements.length == 1" class="__galflery __gallery_1">
        <div class="__item">
          <ok-img
            :media-url="getMediaUrl(announcements[0])"
            cover
            :height="300"
          >
          </ok-img>
        </div>
      </div>
      <div
        v-if="announcements.length > 1 && announcements.length <= 3"
        class="__gallery __gallery_2"
      >
        <div
          v-for="(item, index) in announcements.slice(0, 2)"
          :key="index"
          class="__item"
        >
          <ok-img :media-url="getMediaUrl(item)" cover :height="300"> </ok-img>
        </div>
      </div>
      <div v-if="announcements.length >= 4" class="__gallery __gallery_4">
        <div
          v-for="(item, index) in announcements.slice(0, 4)"
          :key="index"
          class="__item"
        >
          <ok-img :media-url="getMediaUrl(item)" cover :height="150"> </ok-img>
        </div>
      </div>
    </div>

    <div class="__body pa-2">
      <v-chip
        v-if="store.isOfficial"
        label
        outlined
        class="px-2"
        size="x-small"
        color="primary"
        >{{ $t("components.storeCard.official") }}</v-chip
      >
      <div class="d-flex align-center">
        <h2 class="text-capitalize">
          {{ truncate(store.name, 50) }}
        </h2>
        <v-tooltip v-if="store.isVerified" bottom>
          <template #activator="{ props }">
            <v-icon v-bind="props" size="small" color="secondary" class="ms-1"
              >mdi-check-circle</v-icon
            >
          </template>
          <span>{{ $t("components.storeCard.verified") }}</span>
        </v-tooltip>
      </div>
      <h3 class="store-description mt-1">
        {{ truncate(store.description, 70) }}
      </h3>
      <div class="mt-1 __bottom">
        <div
          v-if="store.mainLocation && store.mainLocation.location"
          class="text-capitalize text-primary"
        >
          <v-icon color="primary" size="small" class="me-1"
            >mdi-map-marker</v-icon
          >
          <template
            v-if="
              store.mainLocation.location.city &&
              store.mainLocation.location.city.name
            "
          >
            {{ store.mainLocation.location.city.name + ", " }}
          </template>
          <template
            v-if="
              store.mainLocation.location.region &&
              store.mainLocation.location.region.name
            "
          >
            {{ store.mainLocation.location.region.name }}
          </template>
        </div>
        <v-divider class="mx-n2 mt-2 mb-2"></v-divider>
        <div class="d-flex align-center">
          <v-icon size="small" class="me-1">mdi-store</v-icon>
          {{ formatFollower(store.announcementsCount) }}
          {{ $t("_.products", store.announcementsCount) }}
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import truncate from "lodash/truncate";
import StoreUrlMixin from "./StoreUrlMixin";
import get from "lodash/get";

export default {
  mixins: [StoreUrlMixin],
  props: {
    store: { type: Object, required: true },
    recordPromo: { type: [Number, String], default: null }
  },

  computed: {
    announcements() {
      return this.store.announcements.data;
    }
  },

  methods: {
    handlePromotionClick() {
      this.recordPromotion();
    },
    truncate(str, max_length) {
      return truncate(str, { length: max_length });
    },
    recordPromotion() {
      if (!this.recordPromo) return;
      let context = this.store
        ? {
            store: this.store.id
          }
        : null;
      this.$stats.recordPromotion(
        location.href,
        parseInt(this.recordPromo),
        context
      );
    },
    getMediaUrl(announcement) {
      return get(announcement, "defaultMedia.mediaUrl", null);
    }
  }
};
</script>

<style lang="scss">
.o-store-card-full.v-card {
  position: relative;
  height: 420px;
  .__body {
    z-index: 2;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    > div > h2 {
      font-size: 1.1rem;
      line-height: 1.2rem;
    }
    > .store-description {
      line-height: 1.1rem;
      font-size: 0.9rem;
      font-weight: 400;
    }
    > .__bottom {
      font-size: 0.9rem;
      line-height: 1.2rem;
    }
  }

  .__head {
    position: relative;
    padding: 1px;
    > .__logo {
      z-index: 2;
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .v-card {
        background: #fff;
      }
    }

    > .__gallery {
      border-radius: 3px;
      overflow: hidden;
      opacity: 0.9;
      height: 300px;
      background: rgb(var(--v-background-darken1));
    }

    > .__gallery_1 > .__item {
      height: 300px;
      width: 100%;
    }

    > .__gallery_2 > .__item {
      height: 300px;
      float: left;
      width: 50%;
    }
    > .__gallery_4 > .__item {
      height: 150px;
      float: left;
      width: 50%;
    }
  }
}
.v-theme--light.o-store-card-full.v-card {
  background: #fff;
  color: rgba(0, 0, 0, 0.87);
  .__body {
    background: #fff;
  }
}
.v-theme--dark.o-store-card-full.v-card {
  background: #1e1e1e;

  .__body {
    background: #1e1e1e;
  }
  color: #ffffff;
}
</style>
