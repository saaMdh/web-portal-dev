<template>
  <v-container>
    <component :is="is">
      <promo-carousel
        v-if="$isDesktop"
        :key="'CROSS_LISTING_SLIDER' + noAdsense"
        location="CROSS_LISTING_SLIDER"
        :category="{
          required: true,
          id: slug ? '' : searchActive ? searchActive.category.id : '',
          slug: slug
        }"
        :no-adsense="noAdsense"
        :width="'100%'"
        height="250"
        keep-height
      ></promo-carousel>
      <promo-carousel
        v-if="$isMobile"
        :key="'CROSS_LISTING_SLIDER' + noAdsense"
        location="CROSS_LISTING_SLIDER"
        :category="{
          required: true,
          id: slug ? '' : searchActive ? searchActive.category.id : '',
          slug: slug
        }"
        :no-adsense="noAdsense"
        width="336"
        height="155"
      ></promo-carousel>
      <template v-if="$isDesktop && !cover" #sidebar>
        <promo-loader
          :key="'DESKTOP_LISTING_SQUARE' + noAdsense"
          location="DESKTOP_LISTING_SQUARE"
          :category="{
            required: true,
            id: slug ? '' : searchActive ? searchActive.category.id : '',
            slug: slug
          }"
          :no-adsense="noAdsense"
          width="300"
          height="250"
        ></promo-loader>
      </template>
    </component>
  </v-container>
</template>

<script>
import PromoCarousel from "@/components/Promotion/PromoCarousel.vue";
import PromoLoader from "@/components/Promotion/PromoLoader.vue";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    PromoCarousel,
    PromoLoader,
    SidebarLayout: defineAsyncComponent(() =>
      import("@/components/SidebarLayout.vue")
    )
  },
  props: {
    cover: {
      type: Boolean,
      default: false
    },
    noAdsense: {
      type: Boolean,
      default: false
    },
    slug: {
      type: String,
      default: null
    },
    searchActive: {
      type: Object,
      default: null
    }
  },
  data() {
    return {};
  },
  computed: {
    is() {
      if (this.cover) return "div";
      else return "sidebar-layout";
    }
  }
};
</script>
