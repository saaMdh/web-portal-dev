<template>
  <div class="text-center d-flex justify-center align-center promo-loader">
    <promo-content
      v-if="showPromo"
      :promo="promo"
      :width="width"
      :height="height"
      :location="location"
      :autoplay="autoplay"
      :collapse="collapse"
      :eager="eager"
      class="ma-auto"
      @load="load"
    ></promo-content>
    <div
      v-else-if="!collapse"
      class="promo-skeleton-loader"
      :style="'width:' + width + 'px;height:' + height + 'px'"
    ></div>
  </div>
</template>

<script>
import get from "lodash/get";
import { PromoContentQuery } from "./PromoQuery.graphql";
import PromoContent from "./PromoContent.vue";
export default {
  components: { PromoContent },
  props: {
    width: {
      type: [Number, String],
      required: true
    },
    height: {
      type: [Number, String],
      required: true
    },
    location: {
      type: String,
      default: null
    },
    category: {
      type: Object,
      default: () => ({ required: false, id: null, slug: null })
    },
    fetchPolicy: {
      type: String,
      default: "no-cache"
    },
    noAdsense: {
      type: Boolean,
      default: false
    },
    autoplay: {
      type: Boolean,
      default: false
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
      promo: null,
      ready: false,
      loading: 0
    };
  },
  computed: {
    showPromo() {
      return (
        (!this.category.required || this.category.slug || this.category.id) &&
        !this.loading > 0 &&
        this.ready
      );
    }
  },
  activated() {
    if (this.$route.name === "home") this.$apollo.queries.promo.refetch();
  },
  methods: {
    setReady() {
      this.ready = true;
    },
    load() {
      this.$emit("finish", this.promo !== null);
    }
  },
  apollo: {
    promo() {
      return {
        query: PromoContentQuery,
        fetchPolicy: this.fetchPolicy,
        errorPolicy: "ignore",
        loadingKey: "loading",
        manual: true,
        variables() {
          return {
            location: this.location,
            count: 1,
            categoryId: this.category.id,
            categorySlug: this.category.slug,
            withoutAdSense: this.noAdsense
          };
        },
        error() {
          this.$emit("finish", false);
        },
        skip() {
          return (
            !this.location ||
            (this.category.required && !this.category.id && !this.category.slug)
          );
        },
        result({ data }) {
          this.promo = get(data, "promo[0]", null);
          if (this.promo) {
            if (this.promo.isAdsense) {
              setTimeout(this.setReady, 1000);
            } else {
              this.ready = true;
            }
          } else {
            this.ready = true;
          }
          if (this.promo) {
            if (this.promo.timeout) {
              this.$emit("timeout", this.promo.timeout);
            }
          }
        }
      };
    }
  }
};
</script>
<style lang="scss">
.v-theme--light .promo-skeleton-loader {
  background: rgba(120, 120, 120, 0.12);
}
.v-theme--dark .promo-skeleton-loader {
  background: rgba(255, 255, 255, 0.12);
}
</style>
