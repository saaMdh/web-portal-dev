<template>
  <v-card
    hover
    class="o-service-card"
    :class="{
      '--active': active
    }"
    @click="$emit('toggle')"
  >
    <v-card-title class="justify-center">
      {{ plan.title }}
    </v-card-title>
    <v-list density="compact">
      <v-list-subheader>
        {{ $t("purchase.store.purchaseForm.step1.fields.offer.options") }}
      </v-list-subheader>
      <v-divider inset></v-divider>
      <service-prameteres-list
        v-show="show"
        :params="params"
        :index="index"
      ></service-prameteres-list>
      <template v-if="bonuses.length > 0">
        <v-list-subheader>
          {{
            $t("purchase.store.purchaseForm.step1.fields.offer.bonuses.title") +
            "(" +
            bonuses.length +
            ")"
          }}
        </v-list-subheader>
        <v-divider inset></v-divider>
        <v-list density="compact">
          <v-list-item v-for="(bonuse, i) in bonuses" :key="i" three-line>
            <v-list-item-title>
              {{
                bonuse.type === "DURATION"
                  ? $t(
                      "purchase.store.purchaseForm.step1.fields.offer.offredMonth",
                      { n: bonuse.value }
                    )
                  : bonuse.serviceParameter.title
              }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="bonuse.minDuration">
              {{
                $t(
                  "purchase.store.purchaseForm.step1.fields.offer.bonuses.minDuration",
                  { n: bonuse.minDuration }
                )
              }}
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="bonuse.maxDuration">
              {{
                $t(
                  "purchase.store.purchaseForm.step1.fields.offer.bonuses.maxDuration",
                  { n: bonuse.maxDuration }
                )
              }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </template>
      <service-price-display
        v-if="showPrice"
        :service-id="plan.id"
        :category-ids="categories"
        :duration="duration"
      ></service-price-display>
    </v-list>
  </v-card>
</template>
<script>
import ServicePrameteresList from "./ServicePrameteresList.vue";
import ServicePriceDisplay from "./ServicePriceDisplay.vue";
export default {
  components: {
    ServicePrameteresList,
    ServicePriceDisplay
  },

  props: {
    plan: { type: Object, default: null },
    params: { type: Array, default: null },
    bonuses: { type: Array, default: null },
    categories: { type: Array, default: null },
    index: { type: Number, default: 0 },
    duration: { type: Number, default: 1 },
    active: { type: Boolean, default: false }
  },
  data() {
    return {
      show: true,
      showBonuses: false
    };
  },

  computed: {
    showPrice() {
      return this.duration && this.categories && this.categories.length > 0;
    }
  }
};
</script>
<style lang="scss">
.o-service-card {
  &.--active {
    outline: rgb(var(--v-theme-primary)) 3px solid;
  }
}
</style>
