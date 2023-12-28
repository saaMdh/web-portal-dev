<template>
  <component
    :is="isLink"
    v-if="showComponent"
    class="o-link d-flex justify-center mx-auto"
    :class="getClass()"
    :width="componentSize.width"
    :height="componentSize.height"
    :style="background"
    @click="event => handlePromotionClick(event)"
  >
    <pixel-img
      v-if="pixelUuid && promo"
      :key="pixelUuid + promo.id"
      payload-type="promotion_view"
      :promotions="promotionIds"
      :lazy="false"
    ></pixel-img>
    <component
      :is="is"
      v-if="promo && !adBlock && !isUnfilled"
      :promo="promo"
      :width="componentSize.width"
      :height="componentSize.height"
      :autoplay="autoplay"
      :no-adsense="noAdsense"
      :disable-pointer-events="hasTargetLink"
      :eager="eager"
      :lazy-src="url()"
      class="mx-auto"
      :style="getStyle()"
      @load="load"
      @unfilled="unfilled"
    ></component>
    <a v-else-if="!collapse" :href="fallbackHref">
      <v-img
        :width="width"
        :height="height"
        :src="fallbackImage"
        :lazy-src="url()"
        cover
        @load="load"
      ></v-img
    ></a>
  </component>
</template>

<script>
import get from "lodash/get";
import { detectAnyAdblocker } from "vue-adblock-detector";
import PromoPlaceholder from "./PromoPlaceholder.vue";
import { defineAsyncComponent } from "vue";
import pixelImg from "@/components/Announcement/pixelImg.vue";

const DESKTOP_COVERS = ["DESKTOP_HOME_COVER", "DESKTOP_LISTING_COVER"];

const PromoComponents = {
  IMAGE: defineAsyncComponent(() => import("./PromoContent/PromoImage")),
  IFRAME: defineAsyncComponent(() => import("./PromoContent/PromoIframe")),
  SCRIPT: defineAsyncComponent(() => import("./PromoContent/PromoScript")),
  VIDEO: defineAsyncComponent(() => import("./PromoContent/PromoVideo"))
};

export default {
  components: { PromoPlaceholder, pixelImg },
  props: {
    width: {
      type: [Number, String],
      required: true
    },
    height: {
      type: [Number, String],
      required: true
    },
    promo: {
      type: Object,
      default: null
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    noAdsense: {
      type: Boolean,
      default: false
    },
    location: {
      type: String,
      default: null
    },
    eager: {
      type: Boolean,
      default: false
    },
    collapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      adBlock: false,
      isLoaded: false,
      isUnfilled: false,
      pixelUuid: Math.random().toString()
    };
  },

  computed: {
    showComponent() {
      return !(DESKTOP_COVERS.includes(this.location) && !this.promo);
    },
    background() {
      var style = "";
      if (
        this.promo &&
        this.promo.currentVisual &&
        this.promo.currentVisual.mediaBackground
      ) {
        if (
          this.promo.currentVisual.mediaBackground.media &&
          this.promo.currentVisual.mediaBackground.mimeType == "IMAGE"
        )
          style =
            style +
            "background:url(" +
            this.promo.currentVisual.mediaBackground.media +
            ") no-repeat center top;";

        if (this.promo.currentVisual.mediaBackground.background)
          style =
            style +
            "background-color:" +
            this.promo.currentVisual.mediaBackground.background +
            ";";
      }
      return style;
    },
    fallbackImage() {
      var src = "";
      var size = this.width + "x" + this.height;
      switch (size) {
        case "300x600":
          src =
            "https://cdn.ouedkniss.com/medias/images/YEWGkM/yibgXK7Z3BWCDwaMVKlPiEr3pmMCnF1FLnCKV3lm.jpg";
          break;
        case "1300x150":
          src =
            "https://cdn.ouedkniss.com/medias/images/YEWGkM/j0THwGgp4hvgO5L36Xb1q9eY9dNCFzGQcj1HXUAJ.jpg";
          break;
        case "300x250":
          src =
            "https://cdn.ouedkniss.com/medias/images//YEWGkM//oozJmAGBl0Aadvha6jg6I22AAFG3ONBbCEBSJpaS.jpg";
          break;
        case "336x90":
          src =
            "https://cdn.ouedkniss.com/medias/images//YEWGkM//B4qWQQ8sn8ISsfXhrz96nUebGs1Gsovoteu9lJ1j.jpg";
          break;
        case "360x90":
          src =
            "https://cdn.ouedkniss.com/medias/images//YEWGkM//B4qWQQ8sn8ISsfXhrz96nUebGs1Gsovoteu9lJ1j.jpg";
          break;
        case "960x200":
          src =
            "https://cdn.ouedkniss.com/medias/images//YEWGkM//RdTkMdkoKRTu9OYPYPzpvjFfRYZzyiEc5K2m8v1o.jpg";
          break;
      }
      return src;
    },
    fallbackHref() {
      var href = "";
      var size = this.width + "x" + this.height;
      switch (size) {
        case "300x600":
          href = "https://www.ouedkniss.com/store/19047/ouedkniss?q=store";
          break;
        case "1300x150":
          href =
            "https://www.ouedkniss.com/store/19047/ouedkniss/annonce/31306815";
          break;
        case "300x250":
          href = "https://www.ouedkniss.com/store/19047/ouedkniss?q=store";
          break;
        case "336x90":
          href =
            "https://www.ouedkniss.com/store/19047/ouedkniss/annonce/31307595";
          break;
        case "360x90":
          href =
            "https://www.ouedkniss.com/store/19047/ouedkniss/annonce/31307595";
          break;
        case "960x200":
          href = "https://www.ouedkniss.com/store/19047/ouedkniss?q=store";
          break;
      }
      return href;
    },
    targetLink() {
      return get(this.promo, "targetLink", "#");
    },

    checkInternalLink() {
      if (this.targetLink === "#" || !this.targetLink) {
        return false;
      } else {
        const url = this.targetLink;
        let domain = new URL(url);
        domain = domain.hostname;
        return domain.includes("ouedkniss");
      }
    },
    isLink() {
      if (this.promo && this.promo.targetLink) return "a";
      else return "div";
    },
    hasTargetLink() {
      if (this.promo && this.promo.targetLink) return true;
      else return false;
    },
    is() {
      if (get(this.promo, "currentVisual.media", null))
        return PromoComponents[this.promo.currentVisual.media.mimeType];
      else {
        this.$emit("load", true);
        return null;
      }
    },
    promoSize() {
      let width =
        get(this.promo, "currentVisual.media.width") || this.width || "100%";
      let height = get(this.promo, "currentVisual.media.height") || this.height;
      height = getMinValue(height, this.height) || "auto";
      return {
        width,
        height
      };
    },
    componentSize() {
      return {
        width: addPxSuffix(this.promoSize.width),
        height: addPxSuffix(this.promoSize.height)
      };
    },
    promotionIds() {
      return [this.promo.id];
    }
  },
  activated() {
    if (!this.pixelUuid) {
      this.pixelUuid = Math.random().toString();
    }
  },
  deactivated() {
    this.pixelUuid = null;
  },
  beforeMount() {
    detectAnyAdblocker().then(detected => {
      if (detected) {
        this.adBlock = false;
      }
    });
  },
  methods: {
    handlePromotionClick(event = null) {
      if (!this.isLink && event) {
        event.preventDefault();
      }
      this.recordPromotion();
      if (this.targetLink) {
        window.open(
          this.targetLink,
          this.checkInternalLink ? "_self" : "_blank"
        );
      }
    },
    getStyle() {
      if (get(this.promo, "currentVisual.media.mimeType", "IMAGE") === "IFRAME")
        return "width:" + this.componentSize.width;
      else
        return this.$isMobile
          ? "width: 100%"
          : "width:" + this.componentSize.width;
    },
    getClass() {
      return DESKTOP_COVERS.includes(this.location) ? "desktop-cover" : null;
    },
    unfilled() {
      this.isUnfilled = true;
    },
    recordPromotion() {
      if (!this.promo) return;
      let context = {};
      if (this.$route.query.c) context.category = this.$route.query.c;
      if (this.$route.query.keywords)
        context.keywords = this.$route.query.keywords;
      this.$stats.recordPromotion(location.href, this.promo.id, context);
    },
    url() {
      if (this.$vuetify.theme.current.dark)
        return require("@/assets/empty-dark.svg");
      else return require("@/assets/empty-light.svg");
    },
    load(v) {
      this.isLoaded = true;
      this.$emit("load", v);
    }
  }
};

function getMinValue(var1, var2) {
  if (!var1) return var2;
  var num1 = parseInt(var1);
  var num2 = parseInt(var2);
  return Math.min(num1, num2);
}

function addPxSuffix(size) {
  if (
    typeof size !== "string" ||
    (size !== "px" &&
      !size.includes("%") &&
      !size.includes("auto") &&
      !size.includes("px"))
  ) {
    return size + "px";
  }
  return size;
}
</script>

<style lang="scss">
.o-link {
  z-index: 2;
  display: block;
  position: relative;
  max-width: 100%;
  overflow: hidden;
}
.desktop-cover {
  left: 0;
  right: 0;
  top: 0;
  height: 764px;
  position: absolute;
}
</style>
