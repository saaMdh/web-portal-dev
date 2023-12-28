<template>
  <div
    class="v-card o-announ-card elevation-1 rounded"
    :class="{
      'o-announ-card-mini': mini,
      'o-announ-card-full': !mini,
      'v-theme--dark': $vuetify.theme.current.dark,
      'v-theme--light': !$vuetify.theme.current.dark
    }"
  >
    <div
      ref="announcementCard"
      class="d-flex flex-column o-announ-card-column"
      @click="v => $emit('click', v)"
    >
      <router-link
        class="d-flex flex-column flex-grow-1 v-card v-card--link o-announ-card-content pb-1"
        :to="to"
      >
        <div class="o-announ-card-image" style="flex-grow: 1">
          <ok-video v-if="isVideo()" :media="announcement.defaultMedia" cover>
          </ok-video>
          <ok-img
            v-else
            height="100%"
            aspect-ratio="1"
            cover
            lazy
            :media-url="getMediaUrl()"
            :fallback="fallback"
          >
          </ok-img>
        </div>

        <div class="mx-2" style="flex-grow: 0">
          <div
            v-if="
              announcement.store &&
              announcement.store.isOfficial &&
              !hideOfficial
            "
            style="height: 22px"
          >
            <v-chip label outlined size="x-small" color="primary">{{
              $t("components.announcementsCard.official")
            }}</v-chip>
          </div>
          <h2 class="mb-1" :class="mini ? 'announ-title-mini' : ''">
            {{ truncate(announTitle()(announcement.title)) }}

            <pixel-img
              :key="announcement.id"
              payload-type="announcement_appear"
              :announcement="announcement"
              :lazy="true"
            ></pixel-img>
          </h2>
          <div
            v-if="announcement.pricePreview > 0"
            class="d-flex flex-wrap flex-gap-1 align-center mb-1"
          >
            <span
              v-if="announcement.pricePreview > 0"
              class="text-primary price"
            >
              <announ-price
                :price="announcement.pricePreview"
                :unit="announcement.priceUnit"
              ></announ-price>
            </span>
            <span
              v-if="announcement.oldPricePreview > 0"
              class="text-grey-darken-1 old-price"
            >
              <announ-price
                :price="announcement.oldPricePreview"
                :unit="announcement.priceUnit"
                old
              ></announ-price>
            </span>
          </div>

          <div
            v-if="
              !hideDescription &&
              !hideDetails &&
              announcement.smallDescription &&
              announcement.smallDescription.length
            "
            class="col py-0 px-0 my-1"
          >
            <span
              v-for="(v, i) in announcement.smallDescription"
              :key="i"
              class="v-chip me-1 mb-1 px-2 text-caption"
              :class="{
                'bg-grey-darken-3': $vuetify.theme.current.dark,
                'bg-grey-lighten-2': !$vuetify.theme.current.dark
              }"
            >
              {{ v.valueText[0] }}
            </span>
          </div>

          <template v-if="!hideDetails">
            <delivery-type-chip
              v-if="announcement.hasDelivery && announcement.deliveryType"
              :announcement="announcement"
              class="my-1"
              :mini="mini"
            ></delivery-type-chip>
            <div
              v-if="!mini"
              class="mb-1 d-flex flex-column flex-gap-1 line-height-1"
            >
              <span
                v-if="announcement.cities && announcement.cities.length > 0"
              >
                <i
                  aria-hidden="true"
                  class="v-icon notranslate mdi mdi-map-marker me-1"
                  style="font-size: 16px"
                  :class="{
                    'v-theme--dark': $vuetify.theme.current.dark,
                    'v-theme--light': !$vuetify.theme.current.dark
                  }"
                ></i>
                {{ announcement.cities[0].name }},
                {{ announcement.cities[0].region.id }}
              </span>

              <span v-if="announcement.createdAt">
                <i
                  aria-hidden="true"
                  class="v-icon notranslate mdi mdi-update me-1"
                  style="font-size: 16px"
                  :class="{
                    'v-theme--dark': $vuetify.theme.current.dark,
                    'v-theme--light': !$vuetify.theme.current.dark
                  }"
                ></i>
                {{ formatDateTimeNow(announcement.createdAt) }}
              </span>
            </div>
          </template>
        </div>
      </router-link>

      <div class="d-inline flex-grow-0">
        <router-link
          v-if="announcement.isFromStore && !hideStore && !storePage"
          :to="getStoreUrl(announcement.store)"
          :class="{
            'v-theme--dark': $vuetify.theme.current.dark,
            'v-theme--light': !$vuetify.theme.current.dark
          }"
          class="v-card px-2 d-inline-flex align-center flex-row text-decoration-none"
        >
          <store-img
            style="border-radius: 50%"
            :store="announcement.store"
            contain
            width="28"
            height="28"
            :aspect-ratio="1"
          ></store-img>
          <div
            style="line-height: 1rem; margin-top: 2px"
            class="text-capitalize font-weight-bold ms-2"
          >
            {{ announcement.store.name }}
          </div>
          <v-tooltip
            v-if="announcement.store && announcement.store.isVerified"
            bottom
          >
            <template #activator="{ props }">
              <v-icon v-bind="props" small color="secondary" class="ms-1"
                >mdi-check-circle</v-icon
              >
            </template>
            <span>{{ $t("components.announcementsCard.verified") }}</span>
          </v-tooltip>
        </router-link>
      </div>
    </div>
    <announcement-action
      v-if="!hideActions"
      :announcement="announcement"
      :hide-actions="hideActions"
      :mini="mini || storePage"
      :show-cart="showCart"
      :dark="dark"
      @call="$emit('call', announcement.id)"
    ></announcement-action>
  </div>
</template>

<script>
import CommentItemMixin from "../../views/Announcement/mixins/CommentItemMixin";
import StoreUrlMixin from "@/components/Store/StoreUrlMixin";
import pixelImg from "@/components/Announcement/pixelImg.vue";
import { isExternalDomain, isLandingPath, isStorePath } from "@/utils/location";
import { defineAsyncComponent } from "vue";
import get from "lodash/get";

export default {
  components: {
    pixelImg,
    AnnounPrice: defineAsyncComponent(() => import("./AnnounPrice.vue")),
    AnnouncementAction: defineAsyncComponent(() =>
      import("./AnnouncemmentAction.vue")
    ),
    DeliveryTypeChip: defineAsyncComponent(() =>
      import("./AnnouncementCard/DeliveryTypeChip.vue")
    ),
    OkVideo: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/video/OkVideo.vue")
    )
  },
  mixins: [CommentItemMixin, StoreUrlMixin],

  props: {
    announcement: {
      type: Object,
      required: true
    },
    hideActions: {
      type: Boolean,
      default: false
    },
    hideDetails: {
      type: Boolean,
      default: false
    },
    hideOfficial: {
      type: Boolean,
      default: false
    },
    hideDescription: {
      type: Boolean,
      default: false
    },
    hideStore: {
      type: Boolean,
      default: false
    },
    storePage: {
      type: Boolean,
      default: false
    },
    fallback: {
      type: String,
      default: undefined
    },
    mini: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      readInterval: null,
      onReadPositionTime: null
    };
  },

  computed: {
    showCart() {
      return this.storePage && this.announcement.hasDelivery;
    },
    cached() {
      return this.storePage && this.announcement.hasDelivery;
    },
    to() {
      let routeName = "announcement_show";
      let routeParams = {
        id: this.announcement.id,
        slug: this.announcement.slug
      };
      if (this.storePage && !this.isPortal)
        if (isLandingPath(this.$route)) {
          routeName = "land-announcement-show";
          routeParams = { id: this.announcement.id };
        } else if (isStorePath(this.$route) || isExternalDomain()) {
          routeName = "store-announcement-show";
          routeParams = { id: this.announcement.id };
        }

      return {
        name: routeName,
        params: routeParams
      };
    }
  },
  methods: {
    isStorePath,
    isLandingPath,
    isExternalDomain,

    getMediaUrl() {
      return get(this.announcement, "defaultMedia.mediaUrl", null);
    },
    isVideo() {
      const defaultMedia = this.announcement.defaultMedia;
      const mimeType = (defaultMedia && defaultMedia.mimeType) || null;
      if (/^video/.test(mimeType)) return true;
      else return false;
    },
    announTitle() {
      const HTMLEncode = str => {
        return str.replace(/(&#(\d+);)/g, function (match, capture, charCode) {
          return String.fromCharCode(charCode);
        });
      };

      return HTMLEncode;
    },
    truncate(str) {
      let _str = str || "";
      return _str.slice(0, this.$isDesktop ? 80 : 70);
    }
  }
};
</script>

<style lang="scss">
@import "src/scss/variables";

.o-announ-card-full .o-announ-card-column {
  height: 100%;
  box-sizing: border-box;
}

.o-announ-card-full {
  height: 100%;
}

.o-announ-card-mini .o-announ-card-content {
  height: 234px;
}

.o-announ-card-mini {
  height: 270px;
}

.v-theme--light.o-announ-card {
  background: #fff;
  h2,
  a {
    color: rgba(0, 0, 0, 0.87);
  }
}

.v-theme--dark.o-announ-card {
  background: #1e1e1e;
  h2,
  a {
    color: #ffffff;
  }
}

.o-announ-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 4px 4px 0px 0px;

  .o-announ-card-image {
    border-radius: 4px 4px 0 0;
    margin: 1px 1px 5px 1px;
    overflow: hidden;
  }

  h2 {
    font-family: var(--body-font-family);
    font-size: 1.1rem;
    font-weight: bold;
    line-height: 1.15;
    text-transform: capitalize;
  }

  .price {
    font-family: var(--body-font-family);
    font-size: 1rem;
    font-weight: bold;
    line-height: 1;
    color: rgb(var(--v-theme-primary));
  }

  .old-price {
    font-family: var(--body-font-family);
    font-size: 0.9rem;
    line-height: 1;
    color: rgb(var(--v-theme-primary));
  }
}

.o-announ-card-full {
  .o-announ-card-image {
    aspect-ratio: 1/1;
    max-height: 450px;
  }
}

.o-announ-card-mini {
  .o-announ-card-image {
    margin: 1px 1px 6px 1px;
    overflow: hidden;
  }
  h2 {
    font-weight: 400;
    font-size: 1rem;
  }
}

.announ-title-mini {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 1.7vmax;
  font-weight: 400;
}
</style>
