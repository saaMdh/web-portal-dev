<template>
  <v-dialog
    v-if="isPortal"
    v-model="active"
    transition="none"
    eager
    persistent
    :width="width"
  >
    <v-card
      v-if="count > 0"
      class="card-intertitel"
      tile
      flat
      width="100%"
      height="100%"
    >
      <v-btn
        :aria-label="$t('_.close')"
        class="btn-close-intertitel"
        elevation="1"
        fab
        icon
        @click="active = false"
      >
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
      <promo-loader
        :width="width"
        :height="height"
        :location="location"
        :category="{
          required: category.required,
          id: category.id,
          slug: category.slug
        }"
        :no-adsense="noAdsense"
        :autoplay="active"
        @finish="v => exec(v)"
      ></promo-loader>
    </v-card>
  </v-dialog>
</template>

<script>
const EXPIRES = 10;
import Cookies from "js-cookie";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    PromoLoader: defineAsyncComponent(() =>
      import("@/components/Promotion/PromoLoader.vue")
    )
  },
  props: {
    location: {
      type: String,
      default: null
    },
    width: {
      type: [Number, String],
      default: 300
    },
    height: {
      type: [Number, String],
      default: 300
    },
    category: {
      type: Object,
      default: () => ({ required: false, id: null, slug: null })
    },
    noAdsense: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      active: false
    };
  },

  computed: {
    namePromo() {
      if (this.location) return "promoFlash_" + this.location;
      else return null;
    },
    storageKey() {
      return `ads.${this.location}`;
    },

    count: {
      get() {
        if (!this.namePromo) return 0;
        const count = parseInt(Cookies.get(this.namePromo) || 2);
        Cookies.set(this.namePromo, count, {
          expires: EXPIRES
        });
        return count;
      },
      set(v) {
        Cookies.set(this.namePromo, v, {
          expires: EXPIRES
        });
      }
    }
  },

  methods: {
    exec(isAvailable) {
      if (isAvailable && this.count > 0) {
        this.active = true;
        this.count = this.count - 1;
      } else this.done();
    },

    done() {
      this.active = false;
      this.isDone = true;
    }
  }
};
</script>

<style scoped>
.card-intertitel {
  position: relative;
  padding: 20px;
  background: transparent;
}

.o-right-carousel {
  display: flow-root !important;
}

.btn-close-intertitel {
  z-index: 55;
  color: rgb(255 255 255 / 50%);
  border: 1px solid rgb(255 255 255 / 50%);
  background: rgb(0 0 0 / 50%);
  position: absolute;
  top: 20px;
  right: 20px;
  margin: -14px;
  -webkit-box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 0%),
    0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%) !important;
  box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 0%), 0px 0px 1px 0px rgb(0 0 0 / 14%),
    0px 1px 3px 0px rgb(0 0 0 / 12%) !important;
  height: 30px !important;
  width: 30px !important;
}
</style>
