<template>
  <div class="s-contact-layout">
    <v-skeleton-loader
      v-if="!config.storeLocation"
      type="list-item-avatar-two-line@4"
    >
    </v-skeleton-loader>

    <v-list v-if="config.storeLocation" dense nav rounded class="elevation-1">
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
  </div>
</template>

<script>
import MapsInfoSocial from "@/components/SiteBuilder/Blocks/Default/Maps/MapsInfoSocial.vue";
import MapsInfoItem from "@/components/SiteBuilder/Blocks/Default/Maps/MapsInfoItem.vue";
import MapsInfoList from "@/components/SiteBuilder/Blocks/Default/Maps/MapsInfoList.vue";

import BlockHelperMixinGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockHelperMixinGrid";

import { mapGetters } from "vuex";
import gql from "graphql-tag";
import get from "lodash/get";

export default {
  components: {
    MapsInfoItem,
    MapsInfoSocial,
    MapsInfoList
  },
  mixins: [BlockHelperMixinGrid],

  data() {
    return {
      config: {
        storeLocation: null
      },
      firstLocation: null
    };
  },

  computed: {
    ...mapGetters({ store: "builder/store" })
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

  apollo: {
    locations: {
      query: gql`
        query($id: ID!) {
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
        }
      }
    }
  }
};
</script>

<style lang="scss">
.s-contact-layout {
  display: flex;
  width: 100%;
  align-items: center;

  .v-list {
    width: 100%;
  }
  .v-list-item__content {
    direction: ltr;
  }
}
</style>
