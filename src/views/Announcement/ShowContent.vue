<template>
  <div
    class="announcement-details"
    :class="{
      'announcement-details-portal': isPortal,
      'announcement-details-builder': !isPortal,
      'v-theme--dark': $vuetify.theme.current.dark,
      'v-theme--light': !$vuetify.theme.current.dark
    }"
  >
    <div v-if="isPortal && $isDesktop" class="page-top d-print-none">
      <v-container>
        <promo-loader
          location="DESKTOP_DETAILS_HEADER"
          :no-adsense="announcement.noAdsense"
          :category="{
            required: true,
            id:
              announcement && loading == 0
                ? announcement.categories[0].id
                : null
          }"
          width="1300"
          height="150"
          class="mx-auto"
        ></promo-loader>
      </v-container>
    </div>
    <v-container fluid :class="{ 'pa-0': isPortal }">
      <div class="page-content">
        <div class="page-middle">
          <v-container :fluid="!isPortal" class="pt-2">
            <sidebar-layout
              id="sidebar-layout"
              :disable-side-bar="!isPortal"
              data-sticky-container
            >
              <show-categories
                :loading="loading"
                :categories="announcement.categories"
              ></show-categories>
              <show-header
                :loading="loading"
                :announcement="announcement"
                @refetch="v => $emit('refetch', v)"
              ></show-header>
              <pixel-img
                v-if="pixelShouldBeDisplayed"
                :key="announcement.id"
                payload-type="page_view"
                :payload="pixelPayload"
                :announcement="announcement"
                :lazy="false"
              ></pixel-img>
              <show-slideshow
                class="mt-2"
                :loading="loading"
                :announcement="announcement"
              ></show-slideshow>
              <v-divider class="mt-2 mb-2"></v-divider>
              <div class="d-block d-md-flex align-center d-print-none">
                <show-actions
                  v-if="announcement"
                  :loading="loading"
                  :announcement="announcement"
                  class="mb-3"
                  @refetch="v => $emit('refetch', v)"
                ></show-actions>
                <v-spacer v-if="$isDesktop"></v-spacer>
                <show-shortcut-buttons
                  :loading="loading"
                  :announcement="announcement"
                ></show-shortcut-buttons>
              </div>
              <show-delivery
                v-if="!hideDelivery() && announcement && loading == 0"
                outlined
                class="mt-4 d-print-none show-delivery"
                :announcement="announcement"
              ></show-delivery>
              <div v-if="isPortal && $isMobile" class="d-print-none mt-3">
                <promo-loader
                  id="promo-loader"
                  location="MOBILE_DETAILS_HEADER"
                  :no-adsense="announcement.noAdsense"
                  :category="{
                    required: true,
                    id:
                      announcement && loading == 0
                        ? announcement.categories[0].id
                        : null
                  }"
                  width="360"
                  height="90"
                  class="mt-2 mx-auto"
                ></promo-loader>
              </div>
              <lazy render-on-idle>
                <show-specs
                  class="mt-4"
                  :loading="loading"
                  :announcement="announcement"
                ></show-specs>
              </lazy>
              <lazy render-on-idle>
                <show-account
                  class="mt-6"
                  :loading="loading"
                  :announcement="announcement"
                ></show-account>
              </lazy>
              <template v-if="isPortal && $isDesktop" #sidebar>
                <sticky-area :width="300" class="d-print-none">
                  <promo-loader
                    location="DESKTOP_DETAILS_RECTANGLE"
                    :no-adsense="announcement.noAdsense"
                    :category="{
                      required: true,
                      id:
                        announcement && loading == 0
                          ? announcement.categories[0].id
                          : null
                    }"
                    width="300"
                    height="600"
                  ></promo-loader>
                </sticky-area>
              </template>
            </sidebar-layout>
            <promo-loader
              v-if="isPortal && announcement && loading == 0 && $isMobile"
              location="MOBILE_DETAILS_FOOTER"
              :no-adsense="announcement.noAdsense"
              :category="{
                required: true,
                id: getAnnouncementfirstCategoryId(announcement)
              }"
              width="336"
              height="90"
              class="mx-auto mt-4"
            >
            </promo-loader>
          </v-container>
        </div>
        <v-container class="py-0 d-print-none">
          <lazy render-on-idle>
            <show-comment-list
              v-if="announcement && loading == 0"
              :announcement="announcement"
              :dark="dark"
              class="mt-6 pb-2"
            ></show-comment-list>
          </lazy>
          <show-same-author
            v-if="isPortal && announcement && loading == 0"
            class="mt-6"
            :announcement="announcement"
          ></show-same-author>
          <show-suggested
            v-if="isPortal && announcement && loading == 0"
            :id="announcement.id"
            class="mt-6"
          ></show-suggested>
          <!-- Ads -->
        </v-container>
      </div>
    </v-container>
  </div>
</template>

<script>
import ShowActions from "./components/ShowActions.vue";
import SidebarLayout from "@/components/SidebarLayout.vue";
import ShowCategories from "./components/ShowCategories.vue";
import ShowSlideshow from "./components/ShowSlideshow.vue";
import ShowHeader from "./components/ShowHeader.vue";
import PromoLoader from "@/components/Promotion/PromoLoader.vue";
import pixelImg from "@/components/Announcement/pixelImg.vue";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    SidebarLayout,
    ShowCategories,
    ShowActions,
    ShowSlideshow,
    ShowHeader,
    PromoLoader,
    pixelImg,

    ShowSpecs: defineAsyncComponent(() => import("./components/ShowSpecs.vue")),
    ShowShortcutButtons: defineAsyncComponent(() =>
      import("./components/ShowShortcutButtons.vue")
    ),
    ShowAccount: defineAsyncComponent(() =>
      import("./components/ShowAccount.vue")
    ),
    ShowDelivery: defineAsyncComponent(() =>
      import(
        "@ouedkniss/web-cart-plugin/src/components/Announcement/ShowDelivery.vue"
      )
    ),
    ShowCommentList: defineAsyncComponent(() =>
      import("./components/ShowCommentList.vue")
    ),
    ShowSuggested: defineAsyncComponent(() =>
      import("./components/ShowSuggested.vue")
    ),
    ShowSameAuthor: defineAsyncComponent(() =>
      import("./components/ShowSameAuthor.vue")
    ),
    StickyArea: defineAsyncComponent(() =>
      import("@/components/Content/StickyArea.vue")
    )
  },
  props: {
    announcement: {
      type: Object
    },
    loading: {
      type: Number
    },
    pixelPayload: {
      type: Object,
      required: false
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  emits: ["refetch"],
  computed: {
    isTravel() {
      return this.announcement.category.slug.startsWith("voyages");
    },
    pixelShouldBeDisplayed() {
      const isAnnouncementShowRoute = [
        "store-announcement-show",
        "land-announcement-show",
        "store-annonce",
        "announcement_show"
      ].includes(this.$route.name);
      return (
        isAnnouncementShowRoute && !!this.pixelPayload && !!this.announcement
      );
    }
  },
  watch: {
    announcement() {
      if (this.announcement && this.loading === 0) this.bindPromoDialogs();
    }
  },
  deactivated() {
    this.$store.commit("dialog/setFlash", {});
    this.$store.commit("dialog/setInterstitial", {});
  },
  beforeUnmount() {
    this.$store.commit("dialog/setFlash", {});
    this.$store.commit("dialog/setInterstitial", {});
  },
  methods: {
    getAnnouncementfirstCategoryId(announcement) {
      return (
        announcement &&
        announcement.categories &&
        announcement.categories[0] &&
        announcement.categories[0].id
      );
    },
    hideDelivery() {
      const variants = this.announcement.variants;
      const pricePreview = this.announcement.pricePreview;
      if (!variants) return !pricePreview;
      return (
        this.announcement.category.deliveryType !== "SERVICE" &&
        !variants.some(v => v.price > 0) &&
        !pricePreview
      );
    },
    bindPromoDialogs() {
      const PREFIX_LOCATION = `${this.$isDesktop ? "DESKTOP" : "MOBILE"}`;
      const options = {
        width: this.$isDesktop ? 900 : 360,
        height: this.$isDesktop ? 470 : 640,
        noAdsense: this.announcement.noAdsense,
        category: {
          required: true,
          id: this.getAnnouncementfirstCategoryId(this.announcement)
        }
      };

      if (this.$isDesktop)
        this.$store.commit("dialog/setFlash", {
          key: `${PREFIX_LOCATION}_DETAILS_FLASH_${this.noAdsense}`,
          location: `${PREFIX_LOCATION}_DETAILS_FLASH`,
          ...options
        });
      this.$store.commit("dialog/setInterstitial", {
        location: `${PREFIX_LOCATION}_DETAILS_INTERSTITIAL`,
        key: `${PREFIX_LOCATION}_DETAILS_INTERSTITIAL_${this.noAdsense}`,
        ...options
      });
    }
  }
};
</script>
<style lang="scss">
.announcement-details .page-top {
  height: 174px;
}
.announcement-details .page-middle {
  min-height: 600px;
}
.announcement-details-builder .page-content {
  border-radius: 10px;
}
.v-theme--light.announcement-details.announcement-details-portal .page-top {
  background: #eee;
}
.v-theme--light.announcement-details.announcement-details-portal .page-middle {
  background: linear-gradient(#f5f5f5, #f5f5f5, #f5f5f5, #efefef);
}
.v-theme--light.announcement-details .page-middle .v-divider {
  border-color: rgba(0, 0, 0, 0.45) !important;
}
.v-theme--light.announcement-details-builder .page-content {
  background: linear-gradient(#f5f5f5, #f5f5f5, #f5f5f5, #efefef);
}

.v-theme--dark.announcement-details.announcement-details-portal .page-top {
  background: #191919;
}
.v-theme--dark.announcement-details.announcement-details-portal .page-middle {
  background: linear-gradient(#151515, #151515, #151515, #181818);
}
.v-theme--dark.announcement-details .page-middle .v-divider {
  border-color: #888;
}
.v-theme--dark.announcement-details-builder .page-content {
  background: linear-gradient(#151515, #151515, #151515, #181818);
}

.v-theme--light.announcement-details .page-middle .show-delivery {
  background: #fff;
}
.v-theme--dark.announcement-details .page-middle .show-delivery {
  background: #1e1e1e;
}

@media print {
  .v-image__image {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .v-card,
  .v-application .elevation-1,
  .v-application .elevation-2 {
    box-shadow: none !important;
  }
}
</style>
