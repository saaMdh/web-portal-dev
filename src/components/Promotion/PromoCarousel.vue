<template>
  <div ref="OCarouselPromotion" class="o-carousel">
    <template v-if="list.length === 0">
      <v-skeleton-loader
        boilerplate
        class="skeleton-loader"
        type="image"
        :width="dWidth"
        :height="dHeight"
      ></v-skeleton-loader>
    </template>

    <template v-else>
      <pixel-img
        v-if="pixelUuid && promos && promos.length > 0"
        :key="pixelKey"
        payload-type="promotion_view"
        :promotions="promotionIds"
        :lazy="false"
      ></pixel-img>
      <swiper
        v-slot="{ item }"
        :items="promos"
        :slides-per-view="1"
        autoplay
        :options="{ autoHeight: true }"
      >
        <a
          :aria-label="getAriaLabel(item.targetLink)"
          class="d-block"
          @click="event => handlePromotionClick(item, event)"
        >
          <template v-if="isVideo(item.currentVisual)">
            <ok-video
              :media="item.currentVisual.media"
              :height="dHeight"
              :width="dWidth"
              :style="{
                height: dHeight,
                width: dWidth
              }"
            >
            </ok-video>
          </template>
          <template v-else>
            <ok-img
              v-if="$isDesktop"
              :key="$isMobile"
              :media-url="item.currentVisual.media.mediaUrl"
              no-default-img
              class="d-block"
              :width="dWidth"
              :height="dHeight"
              cover
            ></ok-img>

            <template v-else>
              <ok-img
                :key="$isMobile"
                :width="dWidth"
                :height="dHeight"
                class="d-block"
                :media-url="item.currentVisual.mediaMobile.mediaUrl"
                no-default-img
                cover
              >
              </ok-img>
            </template>
          </template>
        </a>
      </swiper>
    </template>
  </div>
</template>

<script>
import shuffle from "lodash/shuffle";
import has from "lodash/has";
import { PromoSliderQuery } from "./PromoQuery.graphql";
import last from "lodash/last";
import pixelImg from "@/components/Announcement/pixelImg.vue";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    pixelImg,
    Swiper: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
    ),
    OkVideo: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/video/OkVideo.vue")
    )
  },

  props: {
    location: {
      type: String,
      required: true
    },
    width: {
      type: [Number, String],
      required: true
    },
    height: {
      type: [Number, String],
      required: true
    },
    category: {
      type: Object,
      default: () => ({ required: false, id: null, slug: null })
    },
    keepHeight: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      list: [],
      pixelUuid: Math.random().toString(),
      dWidth: this.width,
      dHeight: this.height
    };
  },
  computed: {
    pixelKey() {
      return this.pixelUuid + JSON.stringify(this.promos.map(i => i.id));
    },

    promos() {
      return this.list.filter(l => {
        if (this.$isDesktop) {
          return has(l, "currentVisual.media.mediaUrl");
        } else {
          return has(l, "currentVisual.mediaMobile.mediaUrl");
        }
      });
    },
    promotionIds() {
      return this.promos.map(i => i.id);
    }
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },

  activated() {
    if (!this.pixelUuid) {
      this.pixelUuid = Math.random().toString();
    }
  },

  deactivated() {
    this.pixelUuid = null;
  },

  apollo: {
    list: {
      query: PromoSliderQuery,
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
      variables() {
        return {
          location: this.location,
          count: 30,
          categoryId: this.category.id,
          categorySlug: this.category.slug
        };
      },
      skip() {
        return (
          this.category.required && !this.category.id && !this.category.slug
        );
      },
      result({ data }) {
        this.list = shuffle(data.list);
      }
    }
  },

  methods: {
    handleResize() {
      this.dWidth = this.getDynamicWidth();
      this.dHeight = this.getDynamicHeight();
    },
    getDynamicWidth() {
      return `${this.$refs.OCarouselPromotion.offsetWidth}px`;
    },
    getDynamicHeight() {
      return `${
        this.$isDesktop
          ? this.height
          : document.body.getClientRects()[0].width / (this.width / this.height)
      }px`;
    },
    handlePromotionClick(item, event = null) {
      if (event) {
        event.preventDefault();
      }
      this.recordPromotion(item);
      if (item.targetLink) {
        window.open(
          item.targetLink,
          this.checkInternalLink(item) ? "_self" : "_blank"
        );
      }
    },
    recordPromotion(item) {
      if (!item) return;
      let context = this.category
        ? {
            category: this.category.slug
          }
        : null;
      this.$stats.recordPromotion(location.href, item.id, context);
    },
    checkInternalLink(item) {
      if (!item.targetLink || item.targetLink === "#") {
        return false;
      } else {
        const url = item.targetLink;
        let domain = new URL(url);
        domain = domain.hostname;
        return domain.includes("ouedkniss");
      }
    },
    getAriaLabel(link) {
      if (!link) return this.$t("promoCarousel.ads");
      const splitedLink = link.split("/");
      return last(splitedLink).split("-").join(" ");
    },
    isVideo(item) {
      const defaultMedia = item.media;
      const mimeType = (defaultMedia && defaultMedia.mimeType) || null;
      if (/^video/gi.test(mimeType)) return true;
      else return false;
    }
  }
};
</script>

<style lang="scss">
.o-carousel {
  .v-skeleton-loader.skeleton-loader.v-skeleton-loader--is-loading {
    max-height: 100%;
  }
  .v-skeleton-loader__image.v-skeleton-loader__bone {
    height: 100% !important;
  }
}
</style>
