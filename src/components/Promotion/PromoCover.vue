<template>
  <promo-loader
    v-if="count > 0"
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
    collapse
    @finish="v => load(v)"
  ></promo-loader>
</template>

<script>
const EXPIRES = 1;
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
      required: true
    },
    width: {
      type: [Number, String],
      default: 1360
    },
    height: {
      type: [Number, String],
      default: 190
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
      namePromo: "promoCover_" + this.location
    };
  },
  computed: {
    storageKey() {
      return `ads.${this.location}`;
    },
    count: {
      get() {
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
    load(available) {
      if (available) {
        this.active = true;
        this.count = this.count - 1;
        this.$emit("finish", true);
      }
    }
  }
};
</script>
<style scoped></style>
