<template>
  <v-card elevation="1" variant="elevated" rounded="lg">
    <travel-title icon="mdi-map-marker" color="green">
      {{ $t("travel.agencies.title") }}
    </travel-title>

    <vv-form ref="form">
      <v-card-text>
        <v-select
          v-model="form.target"
          :items="targets"
          variant="outlined"
          hide-details="auto"
          :label="$t('travel.agencies.form.target')"
        ></v-select>

        <div v-if="form.target == 'PROXIMITY'" key="proximity">
          <vv-field
            v-slot="{ field, errors }"
            name="targetRegionId"
            rules="required"
          >
            <travel-region-field
              v-bind="excludeValueField(field)"
              v-model="form.targetRegionId"
              class="mt-4"
              :error-messages="errors"
              variant="outlined"
            ></travel-region-field>
          </vv-field>
        </div>

        <div v-if="form.target == 'SELECTED'" key="selected">
          <vv-field
            v-slot="{ field, errors }"
            name="targetAgencies"
            rules="required"
          >
            <travel-agency-field
              v-bind="excludeValueField(field)"
              v-model="form.targetAgencies"
              class="mt-4"
              :error-messages="errors"
              variant="outlined"
              clearable
              multiple
            ></travel-agency-field>
          </vv-field>
        </div>
      </v-card-text>
    </vv-form>
  </v-card>
</template>

<script>
import TravelTitle from "./TravelFormTitle.vue";
import TravelRegionField from "@/components/Travel/TravelRegionField.vue";
import TravelAgencyField from "@/components/Travel/TravelAgencyField.vue";

const formDefault = {
  target: "ALL",
  targetRegionId: null,
  targetAgencies: []
};

export default {
  components: { TravelTitle, TravelRegionField, TravelAgencyField },

  data() {
    return {
      targets: [
        {
          title: this.$t("travel.agencies.target.0"),
          value: "PROXIMITY"
        },
        {
          title: this.$t("travel.agencies.target.1"),
          value: "SELECTED"
        },
        {
          title: this.$t("travel.agencies.target.2"),
          value: "ALL"
        }
      ],

      form: { ...formDefault }
    };
  },

  methods: {
    async validate() {
      const { valid: isValid } = await this.$refs.form.validate();
      if (!isValid) return isValid;
      this.$emit("submit", this.form);
      return true;
    },

    reset() {
      this.form = { ...formDefault };
      this.$emit("submit", this.form);
    }
  }
};
</script>

<style></style>
