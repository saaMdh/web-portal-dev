<template>
  <div class="o-announ-specs-travel-destination">
    <v-row dense>
      <show-specs-travel-destination-item
        v-if="destination"
        :icon="'mdi-google-maps'"
        :label="destination.label"
        :value-text="destination.valueText"
      ></show-specs-travel-destination-item>

      <show-specs-travel-destination-item
        v-if="etablissementType"
        :icon="'mdi-office-building-outline'"
        :label="etablissementType.label"
        :value-text="etablissementType.valueText"
      ></show-specs-travel-destination-item>

      <show-specs-travel-destination-item
        v-if="etablissementCategorie"
        :icon="'mdi-star'"
        :label="etablissementCategorie.label"
        :value-text="etablissementCategorie.valueText"
      ></show-specs-travel-destination-item>

      <show-specs-travel-destination-item
        v-if="etablissementDesignation"
        :icon="'mdi-rename-box'"
        :label="etablissementDesignation.label"
        :value-text="etablissementDesignation.valueText"
      ></show-specs-travel-destination-item>

      <show-specs-travel-destination-item
        v-if="departureDate"
        :icon="'mdi-airplane-takeoff'"
        :label="departureDate.label"
        :value-text="departureDate.valueText"
      ></show-specs-travel-destination-item>
    </v-row>
  </div>
</template>

<script>
import ShowSpecsTravelDestinationItem from "./ShowSpecsTravelDestinationItem.vue";
export default {
  components: { ShowSpecsTravelDestinationItem },

  props: {
    label: {
      type: String,
      required: true
    },
    specs: {
      type: Object,
      required: true
    }
  },

  computed: {
    labelIndex() {
      return this.label.substr(this.label.length - 1);
    },

    etablissementType() {
      return this.specs[`etablissement_type_${this.labelIndex}`];
    },

    etablissementCategorie() {
      return this.specs[`etablissement_categorie_${this.labelIndex}`];
    },

    etablissementDesignation() {
      return this.specs[`etablissement_designation_${this.labelIndex}`];
    },
    departureDate() {
      return this.specs[`departure_date_${this.labelIndex}`];
    },
    destination() {
      return this.specs[`destination_${this.labelIndex}`];
    }
  }
};
</script>

<style lang="scss"></style>
