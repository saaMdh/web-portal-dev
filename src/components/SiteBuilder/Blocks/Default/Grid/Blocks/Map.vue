<template>
  <v-card class="elevation-0">
    <v-skeleton-loader v-if="loading" :loading="!siteBuildMap" height="100%">
    </v-skeleton-loader>
    <a
      v-else-if="siteBuildMap"
      :href="!$store.state.builder.editor.enable ? createLinkToMap() : null"
      target="_blank"
    >
      <v-img :src="siteBuildMap.link" height="100%"></v-img>
    </a>
    <v-card v-else :image="require('@/assets/map.png')">
      <v-container class="ma-4">
        <v-row
          ><v-spacer></v-spacer><v-icon size="150px">mdi-alert-outline</v-icon
          ><v-spacer></v-spacer
        ></v-row>
        <v-row
          ><v-spacer></v-spacer
          ><v-card-title>{{ $t("components.mapsBlock.noMap") }}</v-card-title
          ><v-spacer></v-spacer
        ></v-row>
      </v-container>
    </v-card>
  </v-card>
</template>

<script>
import BlockHelperMixinGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockHelperMixinGrid";

import { mapGetters } from "vuex";
import toString from "lodash/toString";
import get from "lodash/get";
import gql from "graphql-tag";

export default {
  components: {},
  mixins: [BlockHelperMixinGrid],

  data() {
    return {
      config: {
        storeLocation: null,
        siteBuildMap: null
      },
      firstLocation: null,
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
    if (!this.config.storeLocation) {
      this.config.storeLocation = get(
        this.store,
        "mainLocation",
        this.firstLocation
      );
      this.setAttrValue("storeLocation", this.config.storeLocation);
    }
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
        return (
          !this.store ||
          this.config.storeLocation ||
          get(this.store, "mainLocation")
        );
      },
      result({ data }) {
        this.firstLocation = get(data, "storeGet.locations[0]");
      }
    }
  }
};
</script>

<style lang="scss"></style>
