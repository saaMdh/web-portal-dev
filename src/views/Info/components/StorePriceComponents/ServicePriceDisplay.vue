<template>
  <div>
    <div v-if="$apollo.queries.priceGet.loading" class="text-center">
      <v-progress-circular
        :indeterminate="true"
        color="primary"
      ></v-progress-circular>
    </div>
    <template v-else>
      <div class="text-right headline pa-2">
        {{ $t("_.price") }} :

        <span>
          <announ-price :price="price" :unit="'UNIT'"></announ-price>
        </span>
      </div>
      <template v-if="bonuses.length > 0">
        <v-divider></v-divider>
        <v-list-subheader>{{
          $t("purchase.store.purchaseForm.step1.fields.offer.bonuses.title")
        }}</v-list-subheader>
        <service-bonuses-list :bonuses="bonuses"></service-bonuses-list>
      </template>
    </template>
  </div>
</template>
<script>
import gql from "graphql-tag";
import ServiceBonusesList from "./ServiceBonusesList.vue";
import AnnounPrice from "@/components/Announcement/AnnounPrice.vue";
const QUERY_FOR_SERVICE = gql`
  query(
    $serviceId: ID!
    $categoryGroupIds: [ID!]
    $duration: Int!
    $durationType: ServiceDurationType
  ) {
    priceGet: servicePriceGet(
      serviceId: $serviceId
      categoryGroupIds: $categoryGroupIds
      duration: $duration
      durationType: $durationType
    ) {
      price
      bonuses {
        value
        type
        serviceParameter {
          id
          title
        }
      }
    }
  }
`;

export default {
  components: { ServiceBonusesList, AnnounPrice },
  props: {
    serviceId: { type: [Number, String], default: null },
    duration: { type: Number, default: 1, required: true },

    categoryIds: { type: Array, default: null }
  },
  data() {
    return {
      loading: false,
      price: 0,
      bonuses: [],
      haveDomainNameBonus: false
    };
  },
  apollo: {
    priceGet: {
      loadingKey: "loading",
      debounce: 1000,
      query: QUERY_FOR_SERVICE,
      skip() {
        return !this.serviceId;
      },
      variables() {
        let categoriesToSendToCalculate =
          this.categoryIds.length > 0 ? this.categoryIds : undefined;
        return {
          serviceId: this.serviceId,
          categoryGroupIds: categoriesToSendToCalculate,
          duration: this.duration
        };
      },
      result({ data }) {
        this.$emit("domainNameSet", false);
        if (data.priceGet) {
          this.price = data.priceGet.price;
          this.bonuses = data.priceGet.bonuses;

          if (data && data.priceGet != null) {
            this.haveDomainNameBonus = data.priceGet.bonuses.some(
              b => b.type === "SERVICE_PARAMETER"
            );
          } else {
            this.haveDomainNameBonus = false;
          }
          this.$emit("domainNameSet", this.haveDomainNameBonus);
        } else {
          this.price = 0;
          this.bonuses = [];
        }
      }
    }
  }
};
</script>
