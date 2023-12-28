<template>
  <v-card elevation="1" variant="elevated" rounded="lg">
    <travel-title icon="mdi-airplane" color="blue">
      {{ $t("travel.departure.title") }}
    </travel-title>

    <vv-form ref="form">
      <v-card-text>
        <vv-field
          v-slot="{ field, errors }"
          v-model="form.departureDestination"
          name="departureDestination"
          rules="required"
        >
          <travel-departure-field
            v-bind="excludeValueField(field)"
            :model-value="form.departureDestination"
            variant="outlined"
            hide-details
            :label="$t('travel.departure.form.departureDestination')"
            :error-messages="errors"
          ></travel-departure-field>
        </vv-field>
      </v-card-text>
    </vv-form>
  </v-card>
</template>

<script>
import gql from "graphql-tag";

import TravelTitle from "./TravelFormTitle.vue";
import TravelDepartureField from "@/components/Travel/TravelDepartureField.vue";
const formDefault = {
  departureDestination: null
};

export default {
  components: { TravelTitle, TravelDepartureField },

  data() {
    return {
      regions: [],
      form: {
        ...formDefault
      }
    };
  },

  apollo: {
    regions: gql`
      {
        regions: regionList {
          name
          slug
        }
      }
    `
  },

  methods: {
    async validate() {
      const { valid: isValid } = await this.$refs.form.validate();
      if (!isValid) return false;

      this.$emit("submit", {
        departureDestinationId: this.form.departureDestination.id
      });

      return true;
    },
    reset() {
      this.form = {
        ...formDefault
      };
      this.$emit("submit", this.form);
    }
  }
};
</script>

<style></style>
