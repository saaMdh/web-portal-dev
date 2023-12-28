<template>
  <v-container class="py-0">
    <component :is="is">
      <promo-carousel
        v-if="$isDesktop"
        location="CROSS_HOME_SLIDER"
        :width="'100%'"
        height="250"
        :keep-height="true"
        :category="{ required: false, id: null, slug: null }"
      ></promo-carousel>
      <promo-carousel
        v-if="$isMobile"
        location="CROSS_HOME_SLIDER"
        width="336"
        height="155"
        class="home-slider-mobile"
      ></promo-carousel>
      <template v-if="$isDesktop && !cover" #sidebar>
        <promo-loader
          location="DESKTOP_HOME_SQUARE"
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
import SidebarLayout from "@/components/SidebarLayout.vue";

export default {
  components: { PromoCarousel, PromoLoader, SidebarLayout },
  props: {
    cover: {
      type: Boolean,
      default: false
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
