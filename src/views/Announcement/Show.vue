<template>
  <div>
    <json-ld v-if="jsonld" :jsonld="jsonld" type="product"></json-ld>
    <template v-if="error">
      <wrong-turn
        :id="currentId"
        :title="$t('announcement.notFound.0')"
        :text="$t('announcement.notFound.1')"
      ></wrong-turn>
    </template>

    <ShowContent
      v-else
      :key="currentId"
      :announcement="announcementData"
      :pixel-payload="pixelPayload"
      :dark="
        blockAttrs && blockAttrs.theme ? blockAttrs.theme === 'dark' : null
      "
      :loading="loading"
      @refetch="refetchAnnouncement"
    ></ShowContent>
  </div>
</template>

<script>
import Queries from "./Announcement.graphql";
import jsonLd from "@/components/jsonLd.vue";

import { reduce, get, truncate, upperCase, without, sortBy } from "lodash";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { defineAsyncComponent } from "vue";
import env from "@/utils/env.js";

export default {
  components: {
    WrongTurn: defineAsyncComponent(() =>
      import("@/components/Content/WrongTurn.vue")
    ),
    ShowContent: defineAsyncComponent(() => import("./ShowContent.vue")),
    jsonLd
  },
  provide() {
    return {
      editAnnouncement: v => {
        this.announcement = { ...this.announcement, ...v };
        this.dispatchAnnouncement(this.announcementData);
      }
    };
  },
  props: {
    id: [String, Number],
    blockAttrs: {
      type: Object,
      required: false
    }
  },
  setup() {
    const { locale } = useAuthFrame();

    return {
      locale
    };
  },

  data() {
    return {
      loading: 0,
      error: null,
      announcement: null,
      reactions: null,
      view: null,
      activeTheaterBox: { value: false },
      pixelPayload: null
    };
  },

  head() {
    const alternateLocals = without(["fr", "ar", "en"], this.locale);

    if (!this.announcement) return {};

    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", this.metaDescription);

    const keywords = document.querySelector('meta[name="keywords"]');
    keywords?.setAttribute("content", this.metaKeywords);

    return {
      title: `${this.announcement.title} - ${get(
        this.announcement,
        "cities[0].region.name",
        ""
      )}`,
      meta: [
        {
          property: "og:title",
          content: this.announcement.title
        },
        {
          property: "og:site_name",
          content: "Ouedkniss.com"
        },
        {
          property: "og:description",
          content: this.announcement.description
            ? truncate(this.announcement.description, 200)
            : truncate(this.$t("meta.description"), 200)
        },
        {
          property: "og:image",
          content: get(
            this.announcement,
            "defaultMedia.mediaUrl",
            require("@/assets/default-no-image.svg")
          )
        },
        {
          property: "og:url",
          content: location.href
        },
        {
          property: "product:price:amount",
          content: this.announcement.price
        },
        {
          property: "product:price:currency",
          content: "DZD"
        },
        {
          property: "og:locale",
          content: this.locale + "_" + upperCase(this.locale)
        },
        {
          property: "og:locale:alternate",
          content: alternateLocals[0] + "_" + upperCase(alternateLocals[0])
        },
        {
          property: "og:locale:alternate",
          content: alternateLocals[1] + "_" + upperCase(alternateLocals[1])
        },
        {
          property: "og:type",
          content: "og:product"
        },
        {
          name: "description",
          content: this.metaDescription
        },
        {
          name: "keywords",
          content: this.metaKeywords
        }
      ]
    };
  },

  computed: {
    metaDescription() {
      const price = this.announcement.pricePreview
        ? "Prix: " +
          this.announcement.pricePreview +
          " " +
          this.$t(`announcement.priceUnit.${this.announcement.priceUnit}`) +
          " " +
          this.$t(`announcement.priceType.${this.announcement.priceType}`) +
          " | "
        : "";
      const category = this.announcement.category.name + " | ";
      let desc = this.announcement.description
        ? this.announcement.description.replace(/[\r\n]+/gm, " ")
        : "";

      let description = price + category + desc;

      return description.slice(0, 157).concat("...");
    },

    metaKeywords() {
      const countryLang = ["Algérie", "Algeria", "الجزائر"];

      const country =
        this.locale === "fr"
          ? countryLang[0]
          : this.locale === "en"
          ? countryLang[1]
          : countryLang[2];

      const extensionLang = ["Vente Achat", "Sale purchase", "بيع شراء"];

      const extention =
        this.locale === "fr"
          ? extensionLang[0]
          : this.locale === "en"
          ? extensionLang[1]
          : extensionLang[2];

      const title = this.announcement.title + " ";
      let cities = [...this.announcement.cities].map(city => {
        return {
          name: city.name,
          region: city.region.name
        };
      });

      let address =
        reduce(
          cities,
          (total, city) => {
            return total + city.region + " " + city.name + " ";
          },
          ""
        ) + country;

      let keywords = title + address + " | " + extention;

      return keywords;
    },
    announcementData() {
      return {
        ...this.reactions,
        ...this.announcement
      };
    },
    jsonld() {
      if (!this.announcement) return null;
      let _jsonld = {
        name: this.announcement.title,
        description: this.announcement.description,
        offers: {
          url: location.href,
          priceCurrency: "DZD",
          price: this.announcement.price
        }
      };
      const mediaUrl = get(this.announcement.defaultMedia, "mediaUrl", null);
      if (mediaUrl) _jsonld["image"] = mediaUrl;
      return _jsonld;
    },
    currentId() {
      if (this.id) return this.id;
      else return this.$route.params.id || null;
    }
  },
  watch: {
    currentId: {
      handler(val) {
        if (val) {
          this.fetchFullAnnouncement();
        }
      },
      immediate: true
    },
    announcement: {
      immediate: true,
      deep: true,
      handler() {
        if (this.announcement === null) return;
        let categories = sortBy(this.announcement.categories, c =>
          parseInt(c.id)
        ).map(c => c.slug);
        this.showPixel({ categories });
        if (window.fbq)
          window.fbq("track", "ViewContent", {
            content_name: this.announcement.title,
            content_category: this.announcement.category.slug,
            content_type: "product",
            content_ids: this.announcement.id,
            value:
              this.announcement.price > 0 ? this.announcement.price : undefined,
            currency: "DZD"
          });
        if (typeof window.fbq === "undefined") {
          this.fbqcheck();
        }
      }
    }
  },
  mounted() {
    this.injectCbRouteWatcher(() => {
      this.error = null;
    });
    this.goTo(0, {}, false);
  },
  unmounted() {
    this.dispatchAnnouncement(null);
    this.clearCbRouteWatcher();
  },
  methods: {
    async fetchFullAnnouncement() {
      this.fetchAnnouncement();
      this.fetchAnnouncementReactions();
    },
    async fetchAnnouncement() {
      try {
        this.loading = 1;
        const { data, errors } = await this.$apollo.query({
          query: Queries.AnnouncementGet,
          fetchPolicy: "network-only",
          variables: {
            id: this.currentId
          }
        });

        if (!data.announcement || errors) {
          this.error = true;
        } else if (data && data.announcement) {
          this.announcement = data.announcement;
          let newData = this.mergeAnnouncementData(
            Object.assign({}, data.announcement)
          );
          this.dispatchAnnouncement(newData);
        }
        this.loading = 0;
      } catch (error) {
        this.loading = 0;
        if (env.isDev) console.error(error);
      }
    },
    async fetchAnnouncementReactions() {
      try {
        const { data } = await this.$apollo.query({
          query: Queries.AnnouncementReactions,
          fetchPolicy: "network-only",
          variables: {
            id: this.currentId
          }
        });

        if (data && data.reactions) {
          this.reactions = data.reactions;
          let newData = this.mergeAnnouncementData(
            Object.assign({}, data.reactions)
          );
          this.dispatchAnnouncement(newData);
        }
      } catch (error) {
        if (env.isDev) console.error(error);
      }
    },
    fbqcheck() {
      if (typeof fbq === "undefined") {
        setTimeout(this.fbqcheck, 5);
      } else {
        if (this.announcement === null) return;
        if (window.fbq)
          window.fbq("track", "ViewContent", {
            content_name: this.announcement.title,
            content_category: this.announcement.category.slug,
            content_type: "product",
            content_ids: this.announcement.id,
            value:
              this.announcement.price > 0 ? this.announcement.price : undefined,
            currency: "DZD"
          });
      }
    },
    refetchAnnouncement() {
      this.$apollo.queries.announcement.refetch();
    },
    mergeAnnouncementData(dataToappend) {
      let newData;
      if (this.announcement) {
        newData = {
          ...this.announcement,
          ...dataToappend
        };
      } else {
        newData = {
          ...dataToappend
        };
      }
      return newData;
    },
    dispatchAnnouncement(announcement) {
      this.$store.commit("app/setAnnouncement", announcement);
    },
    showPixel(context) {
      this.canonicalHref = location.href.includes("lang")
        ? location.href
        : location.href.includes("?")
        ? location.href + "&lang=" + this.locale
        : location.href + "?lang=" + this.locale;
      const data = {
        announcementId: this.$route.params.id,
        slug: this.$route.params.slug,
        utmSource: this.$route.query.utm_source
          ? this.$route.query.utm_source
          : undefined,
        utmCampain: this.$route.query.utm_campain
          ? this.$route.query.utm_campain
          : undefined,
        utmMedium: this.$route.query.utm_medium
          ? this.$route.query.utm_medium
          : undefined,
        ...context
      };
      if (!this.pixelPayload || !Object.is(this.pixelPayload, data))
        this.pixelPayload = data;
    }
  }
};
</script>
