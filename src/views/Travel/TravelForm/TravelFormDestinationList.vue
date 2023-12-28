<template>
  <div>
    <div v-for="item in destinationsTrip" :key="item.id">
      <travel-form-destination-item
        ref="destinations"
        :destination="item.destination"
        :start-at="item.startAt"
        :type="type"
        :end-at="item.endAt"
        :enable-delete="destinationsTrip.length > 1"
        class="mt-4"
        @remove="removeDestinationTrip(item)"
        @submit="submitDestinationForm"
      ></travel-form-destination-item>
    </div>

    <div v-if="createForm.active" class="mt-4">
      <travel-destination-field
        variant="solo"
        :label="$t('travel.destination.title')"
        @update:modelValue="createDestinationTrip"
      ></travel-destination-field>
    </div>

    <div v-else class="mt-4 d-flex align-center">
      <v-divider></v-divider>
      <v-btn
        :aria-label="$t('travel.destination.new')"
        color="primary"
        rounded
        @click="createForm.active = true"
      >
        <v-icon start>mdi-plus</v-icon>
        {{ $t("travel.destination.new") }}
      </v-btn>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
import without from "lodash/without";
import every from "lodash/every";
import findIndex from "lodash/findIndex";
import last from "lodash/last";
import { addMonths } from "date-fns";

import TravelDestinationField from "@/components/Travel/TravelDestinationField.vue";
import TravelFormDestinationItem from "./TravelFormDestinationItem.vue";

export default {
  components: { TravelFormDestinationItem, TravelDestinationField },
  props: {
    type: {
      type: String,
      required: true
    }
  },
  emits: ["submit"],
  data() {
    return {
      destinationsTrip: [],
      createForm: {
        active: false
      },
      form: {
        destinations: []
      }
    };
  },

  methods: {
    addDestinationTrip(destinationTrip) {
      const index = findIndex(
        this.destinationsTrip,
        d => d.destination.id === destinationTrip.destination.id
      );

      if (index !== -1) this.destinationsTrip[index] = destinationTrip;
      else this.destinationsTrip.push(destinationTrip);
    },

    createDestinationTrip(destination) {
      let d = new Date();

      if (this.destinationsTrip.length > 0) {
        const lastTrip = last(this.destinationsTrip);
        if (lastTrip) d = lastTrip.endAt;
      }

      this.addDestinationTrip({
        destination,
        startAt: d,
        endAt: addMonths(d, 1)
      });

      this.createForm.active = false;
    },

    removeDestinationTrip(item) {
      this.destinationsTrip = without(this.destinationsTrip, item);
    },

    submitDestinationForm(form) {
      this.form.destinations.push(form);
    },

    async validate() {
      this.form.destinations = [];

      const allValide = await Promise.all(
        this.$refs.destinations.map(d => d.validate())
      );

      if (!every(allValide)) return false;

      this.$emit("submit", {
        destinations: this.form.destinations
      });

      return true;
    },

    reset() {
      this.$refs.destinations.forEach(d => d.reset());
    }
  }
};
</script>

<style></style>
