import get from "lodash/get";
import { LandingType } from "@/utils/LandingSite";
import { isExternalDomain } from "@/utils/location";
import { defineOrganization, useSchemaOrg } from "@unhead/schema-org";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { getCurrentInstance } from "vue";
import { computed, watch } from "vue";
import { useStore } from "vuex";

export default () => {
  const vm = getCurrentInstance().appContext.config.globalProperties;
  const store = useStore();
  const { locale } = useAuthFrame();

  const getOkOrganizationSchema = () => {
    return {
      telephone: "0777 00 11 00",
      email: "contact@ouedkniss.com",
      url: "https://www.ouedkniss.com",
      name: "Ouedkniss",
      logo:
        locale.value === "ar"
          ? require("@/assets/logo-h-w-ar.svg")
          : require("@/assets/logo-h-w.svg"),
      foundingDate: "2006",
      description: vm.$t("meta.fullDescription"),
      address: {
        streetAddress: "346, Parc Ben Omar",
        addressLocality: "Kouba",
        addressRegion: "Alger",
        postalCode: "16000",
        addressCountry: "DZ"
      },
      location: {
        "@type": "Place",
        geo: {
          "@type": "GeoCoordinates",
          latitude: "36.726197",
          longitude: "3.097142"
        }
      },
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        minValue: "51",
        maxValue: "200"
      },
      sameAs: [
        "https://www.facebook.com/ouedkniss",
        "https://www.instagram.com/ouedkniss",
        "https://www.tiktok.com/@ouedkniss",
        "https://www.linkedin.com/company/ouedkniss"
      ]
    };
  };

  const getLandOrganizationSchema = land => {
    if (LandingType() === "market") return getOkOrganizationSchema();
    if (!land) return {};

    let str = {
      url: `https://www.ouedkniss.com/store/${land.id}/${land.slug}`,
      name: land.storeName,
      logo: land.imageurl,
      description: land.description
    };
    if (get(land, "mainLocation.location.address", null))
      str["address"] = land.mainLocation.location.address;
    if (
      get(land, "mainLocation.location.lat", null) &&
      get(land, "mainLocation.location.lng", null)
    )
      str["location"] = {
        "@type": "Place",
        geo: {
          "@type": "GeoCoordinates",
          latitude: `${land.mainLocation.location.lat}`,
          longitude: `${land.mainLocation.location.lng}`
        }
      };
    if (get(land, "mainLocation.socials.length", 0) > 0)
      str["sameAs"] = land.mainLocation.socials.map(s => s.url);

    return str;
  };

  const builderFetch = computed(() => {
    return store.state.builder?.editor.notice.fetch.loading;
  });
  watch(builderFetch, (newValue, oldValue) => {
    if (oldValue === 1 && newValue === 0) {
      const land = get(store.state, "builder.siteBuild.land");
      useSchemaOrg([defineOrganization(getLandOrganizationSchema(land))]);
    }
  });
  if (!(location.pathname.startsWith("/store") || isExternalDomain())) {
    useSchemaOrg([defineOrganization(getOkOrganizationSchema())]);
  }
};
