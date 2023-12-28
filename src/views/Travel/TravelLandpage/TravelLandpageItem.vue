<template>
  <v-card
    hover
    class="o-travel-item elevation-1 rounded-lg"
    :to="{
      name: 'travel_form',
      query: { destinationId: item.id, destinationSlug: item.slug }
    }"
  >
    <travel-img
      :destination="item"
      cover
      :aspect-ratio="1"
      gradient="to top, rgba(0, 0, 0, 0.8) 0%, transparent 75%"
    >
      <div
        class="d-flex full-h flex-column justify-end pa-3 pa-md-4 text-white"
      >
        <h1>{{ item.name }}</h1>
        <h2>{{ item.city.name }}</h2>
      </div>
    </travel-img>
  </v-card>
</template>

<script>
import TravelImg from "@/components/Travel/TravelImg.vue";

export default {
  components: { TravelImg },

  props: {
    item: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive.scss";

.o-travel-item {
  border-radius: 16px !important;

  h1 {
    font-size: 1.2rem;
    line-height: 1;
  }

  h2 {
    font-size: 1rem;
    line-height: 1;
    font-weight: 300;
  }

  @include isDesktop {
    h1 {
      font-size: 1.5rem;
      line-height: 1;
    }

    h2 {
      font-size: 1rem;
      line-height: 1;
      font-weight: 300;
    }
  }
}
</style>
