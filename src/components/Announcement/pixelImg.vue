<template>
  <span ref="pixelRef">
    <span style="width: 1px; height: 1px"></span>
    <img
      v-if="pixelIsVisible && enabled"
      height="1"
      width="1"
      :src="pixelUrl"
      style="position: absolute"
      alt=""
    />
  </span>
</template>

<script>
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { getTrackingHeaders } from "@ouedkniss/web-ui-plugin/src/utils/Tracking";
import { getVersioningHeaders } from "@ouedkniss/web-ui-plugin/src/utils/Versioning";
import env from "@/utils/env.js";
import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

export default {
  props: {
    lazy: {
      type: Boolean,
      default: true
    },
    payloadType: {
      type: String,
      required: true
    },
    payload: {
      type: Object,
      required: false,
      default: null
    },
    announcement: {
      type: Object,
      required: false
    },
    promotions: {
      type: Array,
      required: false
    },
    enablePixel: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const { user } = useAuthFrame();
    const pixelRef = ref(null);
    const pixelIsVisible = ref(false);
    let pixelStop = null;
    if (props.lazy === false) {
      setTimeout(() => {
        pixelIsVisible.value = true;
      }, 200);
    } else {
      const { stop } = useIntersectionObserver(
        pixelRef,
        ([{ isIntersecting }]) => {
          if (isIntersecting) {
            pixelIsVisible.value = isIntersecting;
          }
        }
      );
      pixelStop = stop;
    }

    return {
      pixelStop,
      pixelRef,
      pixelIsVisible,
      user
    };
  },
  computed: {
    pixelUrl() {
      let url = new URL(env.VUE_APP_PIXEL_API);
      const tracking = getTrackingHeaders();
      const versioning = getVersioningHeaders();
      let rand =
        Math.floor(Math.random() * 9000000000000000) + 1000000000000000;
      url.pathname += `pi${rand}xl`;
      let values = {
        payloadType: this.payloadType,
        url: location.href,
        xTrackId: tracking["X-Track-ID"],
        xTrackTimestamp: tracking["X-Track-Timestamp"],
        xAppVersion: versioning["X-App-Version"],
        ...(this.announcement && {
          announcementId: this.announcement.id,
          slug: this.announcement.slug
        }),
        ...(this.promotions && {
          promotionIds: this.promotions
        }),
        ...(this.user && { userId: this.user.id }),
        referer: document.referrer || null,
        locale: this.$i18n.locale,
        ...this.payload
      };
      for (const key in values) {
        if (key && values[key]) url.searchParams.set(key, values[key]);
      }
      return url.href;
    },
    enabled() {
      if (
        env.VUE_APP_DISABLE_OKPIXEL &&
        parseInt(env.VUE_APP_DISABLE_OKPIXEL) === 0
      )
        return true;
      return this.enablePixel;
    }
  },
  watch: {
    pixelIsVisible: {
      handler(isVisible) {
        if (this.lazy && isVisible && this.pixelStop) {
          this.pixelStop();
        }
      }
    }
  }
};
</script>

<style></style>
