<template>
  <v-container fluid class="s-contact-block py-0">
    <v-row v-if="!hide">
      <v-col :cols="$isDesktop ? 6 : 12">
        <v-skeleton-loader
          v-if="!config.storeLocation"
          type="list-item-avatar-two-line@4"
        >
        </v-skeleton-loader>

        <v-list v-if="config.storeLocation" rounded class="elevation-1">
          <template v-if="config.storeLocation.location">
            <maps-info-item
              v-if="config.storeLocation.location.address"
              icon="mdi-map-marker-radius"
              :text="config.storeLocation.location.address"
            ></maps-info-item>
          </template>

          <maps-info-item
            v-if="config.storeLocation.worktime"
            icon="mdi-clock-outline"
            :text="config.storeLocation.worktime"
          ></maps-info-item>

          <maps-info-list
            icon="mdi-phone"
            scheme="tel:"
            :list="config.storeLocation.phones"
          ></maps-info-list>

          <maps-info-list
            icon="mdi-email"
            scheme="mail:"
            :list="config.storeLocation.emails"
          ></maps-info-list>

          <maps-info-social
            v-for="item in config.storeLocation.socials"
            :key="item.name"
            :social="item"
          ></maps-info-social>
        </v-list>
      </v-col>

      <v-col :cols="$isDesktop ? 6 : 12">
        <v-card
          :image="
            !loading && (!siteBuildMap || !siteBuildMap.key)
              ? require('@/assets/map.png')
              : ''
          "
          :height="config.dense ? 200 : 300"
          elevation="1"
        >
          <v-skeleton-loader
            v-if="loading"
            :loading="!siteBuildMap"
            :height="config.dense ? 200 : 300"
            type="image"
          >
          </v-skeleton-loader>
          <a
            v-else-if="siteBuildMap && siteBuildMap.link"
            :href="createLinkToMap()"
            target="_blank"
          >
            <v-img
              :src="siteBuildMap.link"
              width="100%"
              :height="config.dense ? 200 : 300"
              cover
            ></v-img>
          </a>
          <v-container v-else class="ma-4">
            <v-row
              ><v-spacer></v-spacer
              ><v-icon size="150px">mdi-alert-outline</v-icon
              ><v-spacer></v-spacer
            ></v-row>
            <v-row
              ><v-spacer></v-spacer
              ><v-card-title>{{
                $t("components.mapsBlock.noMap")
              }}</v-card-title
              ><v-spacer></v-spacer
            ></v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MapsInfoList from "@/components/SiteBuilder/Blocks/Default/Maps/MapsInfoList.vue";
import MapsInfoItem from "@/components/SiteBuilder/Blocks/Default/Maps/MapsInfoItem.vue";
import MapsInfoSocial from "@/components/SiteBuilder/Blocks/Default/Maps/MapsInfoSocial.vue";

import StoreLocationPropVue from "@/components/SiteBuilder/Props/StoreLocationProp.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";

import { mapGetters } from "vuex";
import toString from "lodash/toString";
import get from "lodash/get";

import gql from "graphql-tag";

export default {
  components: { MapsInfoList, MapsInfoItem, MapsInfoSocial },
  mixins: [BlocksHelperMixin],

  editableProps: [
    {
      icon: "mdi-map-marker-plus",
      label: "components.mapsBlock.props.storeLocation",
      key: "storeLocation",
      field: StoreLocationPropVue
    }
  ],

  data() {
    return {
      config: {
        storeLocation: null,
        dense: false,
        siteBuildMap: null
      },
      firstLocation: null,
      hide: false,
      loading: 0
    };
  },

  computed: {
    ...mapGetters({ store: "builder/store" }),
    location() {
      const alger = { lat: 36.727, lng: 3.096 };
      const location = get(this.config.storeLocation, "location", alger);
      return location.lat && location.lng ? location : alger;
    }
  },

  created() {
    if (!this.config.storeLocation)
      this.config.storeLocation = get(
        this.store,
        "mainLocation",
        this.firstLocation
      );
    if (!this.config.storeLocation) this.hide = true;
  },
  methods: {
    createLinkToMap() {
      const { lat, lng } = this.location;
      return `https://www.google.com/maps/place/${lat},${lng}`;
    }
  },

  apollo: {
    siteBuildMap: {
      loadingKey: "loading",
      query: gql`
        query ($mapInput: MapInput!) {
          siteBuildMap(MapInput: $mapInput) {
            link
          }
        }
      `,
      fetchPolicy: "network-only",
      skip() {
        return !this.config.storeLocation;
      },
      variables() {
        const { lat, lng } = this.location;
        return { mapInput: { lat: toString(lat), lng: toString(lng) } };
      }
    },
    locations: {
      query: gql`
        query ($id: ID!) {
          storeGet(id: $id) {
            locations {
              id
              worktime
              phones
              emails
              socials {
                name
                url
              }
              location {
                id
                address
                lat
                lng
              }
            }
          }
        }
      `,
      variables() {
        return { id: this.store.id };
      },
      skip() {
        return !(
          get(this.store, "mainLocation") &&
          !(this.store || this.config.storeLocation)
        );
      },
      result({ data }) {
        const locations = get(data, "storeGet.locations");
        if (locations && locations.length > 0) {
          this.firstLocation = locations[0];
        } else this.hide = true;
      }
    }
  }
};
</script>

<style lang="scss">
.s-contact-block {
  .v-list-item__content {
    direction: ltr;
  }

  .v-skeleton-loader__image {
    height: 100%;
  }
}
</style>
