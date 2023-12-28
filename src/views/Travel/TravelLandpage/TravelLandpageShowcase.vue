<template>
  <div class="o-travel-showcase">
    <h1 class="d-flex justify-space-between">
      {{ group.continent.name }}

      <div v-if="$isDesktop">
        <v-btn
          :aria-label="$t('travel.tile.explore')"
          color="primary"
          variant="text"
          :to="{
            name: 'search',
            query: { keywords: group.continent.name, c: 'voyages' }
          }"
        >
          {{ $t("travel.tile.explore") }}
        </v-btn>
      </div>
    </h1>

    <div class="__grid">
      <div
        v-for="(item, index) in group.destinations.data"
        :key="index"
        class="__item"
        :class="{ '--featured': index == 0 }"
      >
        <travel-landpage-item :item="item"></travel-landpage-item>
      </div>
    </div>

    <div v-if="$isMobile" class="mt-4">
      <v-btn
        :aria-label="$t('travel.tile.explore')"
        color="primary"
        rounded
        block
        :to="{
          name: 'search',
          query: { keywords: group.continent.name, c: 'voyages' }
        }"
      >
        {{ $t("travel.tile.explore") }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import TravelLandpageItem from "./TravelLandpageItem.vue";

export default {
  components: { TravelLandpageItem },
  props: {
    group: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive.scss";

.o-travel-showcase {
  > h1 {
    font-weight: 300;
    border-bottom: 1px solid rgb(var(--v-border-color));
    margin-bottom: 4px * 4;
  }

  > .__grid {
    display: grid;

    grid-gap: 8px 8px;
    grid-template-columns: repeat(2, minmax(100px, 1fr));

    @include isDesktop {
      grid-gap: 16px 16px;
      grid-template-columns: repeat(4, minmax(300px, 1fr));

      > .--featured {
        grid-column-end: span 2;
        grid-row-end: span 2;
      }
    }
  }
}
</style>
