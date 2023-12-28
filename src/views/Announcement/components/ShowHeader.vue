<template>
  <header>
    <template v-if="loading > 0">
      <ok-text-loader width="60%" class="mt-2"></ok-text-loader>
      <ok-text-loader :width="130" class="mt-2"></ok-text-loader>
    </template>
    <template v-else>
      <h1 class="text-h5 text-capitalize">
        {{ title }}
      </h1>
      <div
        v-if="rangeVariants || price"
        class="mt-1 line-height-2 text-primary text-h6"
      >
        <span class="text-red-darken-1 old-price">
          <announ-price
            v-if="announcement.oldPricePreview"
            :price="announcement.oldPricePreview"
            :unit="announcement.priceUnit"
            old
            class="me-2"
          ></announ-price>
        </span>
        <span v-if="price">
          <announ-price
            :price="price"
            :unit="announcement.priceUnit"
          ></announ-price>
        </span>

        <span v-else-if="rangeVariants && rangeVariants.length > 0">
          <span
            dir="ltr"
            v-text="formatCurrency(rangeVariants[0], false)"
          ></span>
          {{ $t(`announcement.priceUnit.${announcement.priceUnit}`) }} -
          <span
            dir="ltr"
            v-text="formatCurrency(rangeVariants[1], false)"
          ></span>
          {{ $t(`announcement.priceUnit.${announcement.priceUnit}`) }}
        </span>

        <span v-else>
          <announ-price
            :price="rangeVariants"
            :unit="announcement.priceUnit"
          ></announ-price>
        </span>

        <span v-if="announcement.priceType" class="mx-1">{{
          $t(`announcement.priceType.${announcement.priceType}`)
        }}</span>
      </div>
      <span
        v-if="announcement.exchangeType === 'EXCHANGEABLE'"
        class="text-no-wrap d-block mt-1 line-height-2 text-h7"
      >
        {{ $t(`announcement.exchangeType.${announcement.exchangeType}`) }}
      </span>
      <v-alert
        v-if="
          alert && user && (user.id === announcement.user.id || user.isAdmin)
        "
        class="mt-2 mb-0"
        type="warning"
        variant="text"
      >
        {{ $t(`announcement.status.${announcement.status}`) }}
      </v-alert>
    </template>
  </header>
</template>

<script>
import AnnounPrice from "@/components/Announcement/AnnounPrice.vue";
import okTextLoader from "@/components/uiKit/loader/okTextLoader";
import maxBy from "lodash/maxBy";
import minBy from "lodash/minBy";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

const ANNOUN_WITH_ALERT = [
  "PENDING",
  "EXPIRED",
  "DELETED",
  "EDITED",
  "ARCHIVED"
];

export default {
  components: { AnnounPrice, okTextLoader },
  props: {
    announcement: {
      type: Object
    },
    loading: {
      type: Number
    }
  },
  setup() {
    const { user } = useAuthFrame();

    return {
      user
    };
  },

  computed: {
    alert() {
      return ANNOUN_WITH_ALERT.includes(this.announcement.status);
    },

    rangeVariants() {
      if (
        this.announcement.variants.length === 0 ||
        this.announcement.variants.every(item => {
          return !item.price;
        })
      )
        return null;

      const min = minBy(this.announcement.variants, "price").pricePreview;
      const max = maxBy(this.announcement.variants, "price").pricePreview;

      if (min && max && min !== max) return [min, max];

      return min;
    },

    price() {
      if (
        this.announcement.variants.length === 0 &&
        this.announcement.pricePreview
      )
        return this.announcement.pricePreview;

      return null;
    },

    title() {
      return this.HTMLEncode(this.announcement.title);
    }
  },

  methods: {
    HTMLEncode(str) {
      return str.replace(/(&#(\d+);)/g, function (match, capture, charCode) {
        return String.fromCharCode(charCode);
      });
    }
  }
};
</script>
<style lang="scss">
@import "src/scss/variables";
.v-skeleton-loader__text {
  border-radius: 6px;
  margin: 10px;
  height: 12px;
}
.announcement-details .old-price {
  font-family: var(--body-font-family);
  font-size: 1.1rem;
  line-height: 1;
  color: rgb(var(--v-theme-primary));
  margin-top: 4px;
}
</style>
