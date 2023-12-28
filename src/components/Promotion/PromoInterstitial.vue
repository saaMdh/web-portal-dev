<template>
  <div v-if="isPortal">
    <template v-if="isDone">
      <slot></slot>
    </template>

    <template v-else>
      <v-dialog
        v-model="active"
        fullscreen
        persistent
        scrollable
        transition="none"
        eager
      >
        <v-card v-if="count > 0" tile flat>
          <v-card-title class="pa-0">
            <v-toolbar
              :color="$vuetify.theme.current.dark ? '#464646' : '#eeeeee'"
              class="v-toolbar-interstitial"
              tile
              dense
              flat
            >
              <img
                height="32px"
                src="@/assets/logomark-h-w.svg"
                @click="done"
              />

              <v-spacer></v-spacer>

              <v-btn
                v-if="$isDesktop"
                :aria-label="$t('_.continue')"
                color="blue"
                :disabled="disabled"
                depressed
                class="skip-btn-icon text-capitalize"
                @click="done"
              >
                <template v-if="disabled">
                  {{ skipTimeout }} {{ $t("time.second") }}
                </template>
                <template v-else>{{ $t("_.continue") }}</template>
              </v-btn>

              <v-btn
                v-if="$isMobile"
                :aria-label="$t('_.access')"
                :disabled="disabled"
                depressed
                class="skip-btn-icon"
                color="blue"
                @click="done"
              >
                <template v-if="disabled">
                  {{ skipTimeout }} {{ $t("time.second") }}
                </template>
                <template v-else>
                  {{ $t("_.access") }}
                  <v-icon size="small">mdi-arrow-right</v-icon>
                </template>
              </v-btn>
            </v-toolbar>
          </v-card-title>

          <v-card-text class="align-center">
            <div class="promo-loader-interstitial">
              <promo-loader
                :location="location"
                :category="{
                  required: category.required,
                  id: category.id,
                  slug: category.slug
                }"
                :no-adsense="noAdsense"
                :width="width"
                :height="height"
                :autoplay="active"
                eager
                @finish="v => exec(v)"
                @timeout="v => countTime(v)"
              ></promo-loader>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
  </div>
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
      active: false,
      isDone: false,
      disabled: true,
      skipTimeout: 3
    };
  },

  computed: {
    namePromo() {
      if (this.location) return "promoInterstitial_" + this.location;
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
    load() {
      this.countDownTimer();
    },
    isEmpty(v) {
      if (v) this.done();
    },
    exec(isAvailable) {
      this.countDownTimer();
      if (isAvailable && this.count > 0) {
        this.active = true;
        this.count = this.count - 1;
      } else this.done();
    },

    done() {
      this.active = false;
      this.isDone = true;
    },
    open() {
      this.disabled = true;
      this.active = true;
      this.categorySlug = null;

      setTimeout(() => this.$refs.searchField.focus(), 400);
    },
    countDownTimer() {
      if (this.skipTimeout > 0) {
        setTimeout(() => {
          this.skipTimeout -= 1;
          this.countDownTimer();
        }, 1000);
      } else {
        this.disabled = false;
      }
    },
    countTime(timeout) {
      if (timeout > 0 && !this.isDone) {
        setTimeout(() => {
          timeout -= 1;
          this.countTime(timeout);
        }, 1000);
      } else {
        this.isDone = true;
      }
    }
  }
};
</script>

<style>
.promo-loader-interstitial {
  max-width: 96%;
  margin: 10px auto 0;
}
.v-theme--dark svg path:first-child {
  fill: #eee;
}
.v-toolbar-interstitial {
  max-height: 56px;
}
svg {
  outline: none;
}

.skip-btn-icon {
  background: #007aff;
  color: white !important;
  animation: from-left 0.2s ease;
}

@keyframes from-left {
  0% {
    transform: translateX(-50%);
  }
}
</style>
