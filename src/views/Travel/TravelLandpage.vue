<template>
  <div class="o-travel-landpage">
    <v-fade-transition>
      <v-img
        v-if="backdropUrl"
        :key="backdropUrl"
        class="__backdrop"
        :src="backdropUrl"
        height="600"
        position="center top"
        gradient="to bottom, transparent, rgb(var(--v-theme-background))"
      >
      </v-img>
    </v-fade-transition>

    <div style="position: relative; z-index: 1">
      <v-container grid-list-xl>
        <travel-quote-card></travel-quote-card>
      </v-container>

      <v-container v-if="destinationsGroup" grid-list-xl class="mt-4">
        <travel-landpage-showcase
          v-for="(item, index) in destinationsGroup"
          :key="index"
          :class="index > 0 ? 'mt-12' : ''"
          :group="item"
        ></travel-landpage-showcase>
      </v-container>
    </div>
  </div>
</template>

<script>
import TravelQuoteCard from "@/components/Travel/TravelQuoteCard.vue";
import TravelLandpageShowcase from "./TravelLandpage/TravelLandpageShowcase.vue";

import sample from "lodash/sample";

export default {

  components: {
    TravelLandpageShowcase,
    TravelQuoteCard
  },

  data() {
    return {
      backdropUrl: "",
      destinationsGroup: [],
      timerId: null
    };
  },
  head() {
    return {
      title: this.$t("travel.meta.title"),
      titleTemplate: this.$t("travel.meta.titleTemplate")
    };
  },

  mounted() {
    this.timerId = setInterval(() => this.updateBackdrop(), 5000);
  },

  apollo: {
    destinationsGroup: {
      query: require("./Travel.graphql").DestinationGroup,
      result() {
        this.updateBackdrop();
      }
    }
  },
  beforeUnmount() {
    clearInterval(this.timerId);
  },

  methods: {
    updateBackdrop() {
      if (this.destinationsGroup.length > 0) {
        const g = sample(this.destinationsGroup);
        this.backdropUrl = sample(g.destinations.data).imageUrl;
      }
    }
  }
};
</script>

<style lang="scss">
.o-travel-landpage {
  .__backdrop {
    filter: blur(4px);
    transition-duration: 4s;
    transform: scale(1.01) translateY(-8px);
    position: absolute;
    z-index: 1;
    top: 0;
    width: 100%;
    height: 300px;
  }
}
</style>
