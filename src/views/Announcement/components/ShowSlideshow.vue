<template>
  <!-- avoid shifting caused by lazy-load of swiper-->
  <div class="theater-box" :style="withoutImg ? '' : 'width:100%;height:290px'">
    <template v-if="loading > 0">
      <v-divider class="mt-2 mb-2"></v-divider>
      <div style="overflow: hidden">
        <div style="width: 1200px">
          <v-skeleton-loader
            v-for="n in 3"
            :key="'theater-box-skeleton' + n"
            type="image"
            :style="'height: 280px;width:' + ($isMobile ? '300px;' : '350px;')"
            class="me-2 d-inline-block"
          ></v-skeleton-loader>
        </div>
      </div>
    </template>
    <template v-else>
      <template v-if="orderdMedias.length > 0">
        <v-divider class="mt-2 mb-2"></v-divider>
        <lazy render-on-idle>
          <theater-box
            ref="lightbox"
            v-slot="{ item }"
            v-model:index="lightbox.selected"
            v-model="lightbox.active"
            :items="orderdMedias"
          >
            <img v-if="type.images.test(item.mimeType)" :src="item.mediaUrl" />
            <video
              v-else-if="type.videos.test(item.mimeType)"
              autoplay
              loop
              controls
              width="100%"
              height="auto"
            >
              <source :src="item.mediaUrl" :type="item.mimeType" />
              Format de vidéo non supporté
            </video>
          </theater-box>
        </lazy>
      </template>

      <swiper
        v-if="orderdMedias.length > 1"
        v-slot="{ item, index }"
        v-bind="swiperBind"
        class="o-show-slideshow"
      >
        <ok-img
          v-if="type.images.test(item.mimeType)"
          v-bind="imgProps"
          lazy
          :media-url="item.mediaUrl"
          @click="() => lightboxFor(index)"
          @srcError="onImgSrcFail(item)"
        ></ok-img>

        <div v-else-if="type.videos.test(item.mimeType)" class="__video">
          <ok-img v-bind="imgProps" lazy :media-url="item.thumbnail"></ok-img>
          <v-icon
            class="__video-play-icon"
            size="80"
            color="grey-lighten-2"
            @click.stop="lightboxFor(index)"
          >
            mdi-play-circle-outline
          </v-icon>
        </div>
      </swiper>
      <div
        v-else-if="orderdMedias.length == 1"
        class="o-show-slideshow __video"
        :style="'width:' + ($isMobile ? '100%;' : '400px;')"
      >
        <ok-img
          v-bind="imgProps"
          lazy
          :media-url="
            type.images.test(orderdMedias[0].mimeType)
              ? orderdMedias[0].mediaUrl
              : orderdMedias[0].thumbnail
          "
          @click="() => lightboxFor(0)"
          @srcError="onImgSrcFail(orderdMedias[0])"
        ></ok-img>

        <v-icon
          v-if="type.videos.test(orderdMedias[0].mimeType)"
          class="__video-play-icon"
          size="80"
          color="grey-lighten-2"
          @click.stop="lightboxFor(lightbox.selected)"
        >
          mdi-play-circle-outline
        </v-icon>
      </div>
    </template>
  </div>
</template>

<script>
import sortBy from "lodash/sortBy";
import { defineAsyncComponent } from "vue";
export default {
  components: {
    Swiper: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
    ),
    TheaterBox: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Dialog/TheaterBox.vue")
    )
  },
  props: {
    announcement: {
      type: Object
    },
    loading: {
      type: Number
    }
  },

  data() {
    return {
      type: {
        videos: /^video/,
        images: /^image/
      },
      lightbox: {
        active: false,
        selected: 0
      },
      brokenLinkImgs: []
    };
  },
  computed: {
    popStateChanged() {
      return this.$store.state.app.popStateChanged;
    },
    swiperBind() {
      return {
        items: this.loading > 0 ? [...new Array(3)] : this.orderdMedias,
        slidesPerView:
          this.loading > 0 || this.orderdMedias.length > 1 ? "auto" : "1",
        spaceBetween: this.$isDesktop ? 12 : 8,
        zoom: !this.$isDesktop
      };
    },
    imgProps() {
      return {
        width: this.$isMobile
          ? this.singleImg
            ? "100%"
            : 300
          : this.singleImg
          ? "100%"
          : 350,
        height: 280,
        cover: true,
        class: "__slide rounded"
      };
    },
    singleImg() {
      return this.loading <= 0 && this.announcement.medias.length == 1;
    },
    withoutImg() {
      return this.loading <= 0 && this.announcement.medias.length == 0;
    },

    orderdMedias() {
      if (!this.announcement.medias) return [];
      return sortBy(
        this.announcement.medias.filter(
          media => !this.brokenLinkImgs.includes(media.mediaUrl)
        ),
        c => c.mimeType
      );
    }
  },

  watch: {
    "lightbox.active"(val) {
      this.$store.commit("app/setblockPrevious", val);
    },
    popStateChanged(val) {
      if (val) this.lightbox.active = false;
    }
  },
  methods: {
    lightboxFor(index) {
      this.lightbox.active = true;
      this.lightbox.selected = index;
    },
    onImgSrcFail(img) {
      this.brokenLinkImgs.push(img.mediaUrl);
    }
  }
};
</script>

<style lang="scss">
@import "@/scss/responsive";

.theater-box .v-skeleton-loader__image {
  height: 100%;
}

.__slide {
  cursor: zoom-in;
}

.o-show-slideshow video {
  object-fit: cover;
}
.__video-small {
  position: relative;
  @include isDesktop {
    height: 60px;
  }
}
.__video {
  position: relative;
  @include isDesktop {
    width: 100%;
    height: 280px;
  }

  @include isMobile {
    width: 100%;
    height: 280px;
  }
}
.__video-play-icon {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  bottom: 0;
}
.__video-play-icon::after {
  height: auto !important;
}
@media print {
  .swiper-wrapper {
    display: block;
  }

  .ok-swiper .__slide {
    display: inline-block;
    height: 200px !important;
  }
  .ok-swiper .swiper-slide.swiper-slide-auto,
  .o-show-slideshow.__video {
    display: inline-block;
    width: 31%;
    height: 200px !important;
  }
}
</style>
