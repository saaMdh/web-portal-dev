<template>
  <div class="home-page">
    <div class="page-top" :class="cover ? 'cover' : ''">
      <lazy render-on-idle>
        <promo-cover
          v-if="$isDesktop"
          location="DESKTOP_HOME_COVER"
          @finish="v => (cover = v)"
        ></promo-cover>
      </lazy>
      <!-- Promo Slider -->
      <div class="page-top-1 pt-3">
        <section class="home-land-header">
          <home-land-header :cover="cover"></home-land-header>
        </section>

        <!-- Mega Menu -->
        <section class="home-mega-menu">
          <home-mega-menu :cover="cover"></home-mega-menu>
        </section>
      </div>
    </div>
    <!-- Promo HEADER -->
    <section class="home-promo-header">
      <v-container>
        <promo-loader
          v-if="$isDesktop"
          location="DESKTOP_HOME_HEADER"
          width="1300"
          height="150"
        ></promo-loader>

        <promo-loader
          v-if="$isMobile"
          location="MOBILE_HOME_HEADER"
          width="360"
          height="90"
        ></promo-loader>
      </v-container>
    </section>

    <!-- Top Announcement -->
    <section class="mt-2 mt-md-6">
      <v-container class="py-0 home-top-announcements">
        <section-heading icon="mdi-flash" icon-color="primary">
          <template #title>
            {{ $t("home.top.title") }}
          </template>
        </section-heading>
        <home-top-announcement></home-top-announcement>
      </v-container>
    </section>

    <!-- Front Store -->
    <section class="mt-4 mt-md-6 home-front-store">
      <v-container class="pb-0 mt-2">
        <home-front-store></home-front-store>
      </v-container>
    </section>

    <!-- Feed -->
    <section class="d-flex align-center flex-column">
      <v-container class="pb-0 mt-2">
        <home-feed
          v-for="(item, index) in $store.getters.categories"
          :key="item.id"
          :category="item.target"
          :index="index"
        ></home-feed>
      </v-container>
      <v-btn
        max-width="250"
        :aria-label="$t('home.feed.title')"
        class="mt-2 mb-0 mb-md-6"
        depressed
        :color="
          $vuetify.theme.current.dark ? 'grey-darken-4' : 'grey-lighten-3'
        "
        rounded
        @click="goTo(0)"
        ><h1 class="text-body-2 text-uppercase">
          {{ $t("home.feed.title") }}
        </h1>
        <v-icon end> mdi-arrow-up </v-icon></v-btn
      >
    </section>

    <!-- Ads -->
    <section v-if="$isMobile" class="home-promo-footer mb-2">
      <v-container>
        <lazy render-on-idle>
          <promo-loader width="360" height="90" location="MOBILE_HOME_FOOTER">
          </promo-loader>
        </lazy>
      </v-container>
    </section>
  </div>
</template>

<script>
import SectionHeading from "@/components/Content/SectionHeading.vue";
import HomeLandHeader from "./HomeLandHeader.vue";
import HomeMegaMenu from "./HomeMegaMenu.vue";
import { defineAsyncComponent } from "vue";
import truncate from "lodash/truncate";

export default {
  name: "Home",
  components: {
    SectionHeading,
    HomeLandHeader,
    HomeMegaMenu,
    HomeTopAnnouncement: defineAsyncComponent(() =>
      import(/* webpackPrefetch: true */ "./HomeTopAnnouncement")
    ),
    HomeFrontStore: defineAsyncComponent(() =>
      import(/* webpackPrefetch: true */ "./HomeFrontStore")
    ),
    HomeFeed: defineAsyncComponent(() =>
      import(/* webpackPrefetch: true */ "./HomeFeed")
    ),
    PromoLoader: defineAsyncComponent(() =>
      import("@/components/Promotion/PromoLoader.vue")
    ),
    PromoCover: defineAsyncComponent(() =>
      import("@/components/Promotion/PromoCover")
    )
  },
  data() {
    return {
      cover: false
    };
  },
  head() {
    return {
      title: this.$t("home.meta.title"),
      meta: [
        {
          property: "og:title",
          content: this.$t("home.meta.title")
        },
        {
          property: "og:image",
          content:
            "https://www.ouedkniss.com" + require("@/assets/logo-h-w.svg")
        },
        {
          property: "og:site_name",
          content: "Ouedkniss.com"
        },
        {
          property: "og:description",
          content: truncate(this.$t("home.meta.description"), 200)
        },
        {
          property: "og:url",
          content: location.href
        }
      ]
    };
  },
  mounted() {
    const PREFIX_LOCATION = `${this.$isDesktop ? "DESKTOP" : "MOBILE"}`;

    if (this.$isDesktop)
      this.$store.commit("dialog/setFlash", {
        width: 600,
        height: 470,
        location: "DESKTOP_HOME_FLASH",
        key: "DESKTOP_HOME_FLASH"
      });
    this.$store.commit("dialog/setInterstitial", {
      width: this.$isDesktop ? 900 : 360,
      height: this.$isDesktop ? 470 : 640,
      location: `${PREFIX_LOCATION}_HOME_INTERSTITIAL`,
      key: `${PREFIX_LOCATION}_HOME_INTERSTITIAL`
    });
  },
  deactivated() {
    this.$store.commit("dialog/setFlash", {});
    this.$store.commit("dialog/setInterstitial", {});
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/responsive";
.page-top.cover {
  @include isDesktop {
    padding-top: 190px;
    height: 770px;
    .page-top-1,
    .page-top-2 {
      z-index: 3;
      width: 960px;
      margin: 0 auto;
      position: relative;
    }
  }
}
.v-theme--light {
  .page-top-1 {
    background: #f1f1f1;
  }
}
.v-theme--dark {
  .page-top-1 {
    background: #191919;
  }
}
.home-land-header {
  @include isLG {
    height: 270px;
  }
  @include isMD {
    height: 270px;
  }
  @include isSM {
    height: calc(((100vw) / 2.1677) + 14px);
  }
  @include isXS {
    height: calc(((100vw) / 2.1677) + 14px);
  }
}

.home-mega-menu {
  @include isLG {
    height: 272px;
  }
  @include isMD {
    height: 272px;
  }
  @include isSM {
    height: 250px;
  }
  @include isXS {
    height: 220px;
  }
}

.home-promo-header,
.home-promo-footer {
  @include isLG {
    height: 174px;
  }
  @include isMD {
    height: 174px;
  }
  @include isSM {
    height: 114px;
  }
  @include isXS {
    height: 114px;
  }
}
.home-top-announcements {
  height: 325px;
}
.home-front-store {
  min-height: 300px;
}
</style>
