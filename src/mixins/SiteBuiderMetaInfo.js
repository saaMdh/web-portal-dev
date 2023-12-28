import get from "lodash/get";
import reduce from "lodash/reduce";
import truncate from "lodash/truncate";

import { mapGetters } from "vuex";
import { sync } from "vuex-pathify";
export default {

  computed: {
    ...sync({ siteBuild: "builder/siteBuild" }),
    ...mapGetters({
      store: "builder/store",
      currentPage: "builder/currentPage",
      market: "builder/market"
    }),

    meta() {
      if (this.$route.name !== "store-announcement-show")
        return [
          {
            property: "og:title",
            content: this.store
              ? this.store.storeName
              : this.market
              ? this.market.marketName
              : ""
          },
          {
            property: "og:site_name",
            content: "Ouedkniss.com"
          },
          {
            property: "og:description",
            content: this.store
              ? get(
                  this.store,
                  "description",
                  truncate(this.$t("meta.description"), 200)
                )
              : this.market
              ? get(
                  this.market,
                  "descreption",
                  truncate(this.$t("meta.description"), 200)
                )
              : truncate(this.$t("meta.description"), 200)
          },
          {
            property: "og:url",
            content: location.href
          },
          {
            name: "description",
            content: this.metaDescription
          },
          {
            name: "keywords",
            content: this.metaKeywords
          }
        ];
      else return [];
    },
    metaDescription() {
      if (this.store) {
        const category = reduce(
          this.store.categories,
          (total, category) => {
            return total + category.name + " | ";
          },
          ""
        );
        let desc = this.store.description
          ? this.store.description.replace(/[\r\n]+/gm, " ")
          : "";

        let description = desc + " | " + category;

        return description.slice(0, 157).concat("...");
      } else if (this.market) {
        const category = reduce(
          this.market.metakeywords,
          (total, category) => {
            return total + category + " | ";
          },
          ""
        );
        let desc = this.market.descreption
          ? this.market.descreption.replace(/[\r\n]+/gm, " ")
          : "";

        let description = desc + " | " + category;

        return description.slice(0, 157).concat("...");
      } else return "";
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
      var name;
      var category;

      if (this.store) {
        name =
          this.$t("quickbar.ouedkniss.0") +
          this.$t("quickbar.ouedkniss.1") +
          " " +
          this.store.storeName +
          " ";

        category = reduce(
          this.store.categories,
          (total, category) => {
            return total + category.name + " | ";
          },
          ""
        );
      } else if (this.market) {
        name =
          this.$t("quickbar.ouedkniss.0") +
          this.$t("quickbar.ouedkniss.1") +
          " " +
          this.market.marketName +
          " ";

        category = reduce(
          this.market.metakeywords,
          (total, category) => {
            return total + category + " | ";
          },
          ""
        );
      }

      let keywords = name + country + " | " + extention + " | " + category;

      return keywords.slice(0, 157).concat("...");
    }
  }
};
