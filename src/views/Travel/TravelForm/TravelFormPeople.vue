<template>
  <v-card elevation="1" variant="elevated" rounded="lg">
    <travel-title icon="mdi-account-group" color="deep-orange">
      {{ $t("travel.people.title") }}
    </travel-title>

    <vv-form ref="form">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="form.peopleAdults"
              variant="outlined"
              hide-details
              :items="adults"
              :label="$t('travel.people.form.peopleAdults')"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="form.peopleBabies"
              clearable
              variant="outlined"
              hide-details
              :items="babies"
              :label="$t('travel.people.form.peopleBabies')"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="form.peopleChildren"
              clearable
              hide-details
              variant="outlined"
              :items="childs"
              :label="$t('travel.people.form.peopleChildren')"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </vv-form>
  </v-card>
</template>

<script>
import times from "lodash/times";
import TravelTitle from "./TravelFormTitle.vue";

const formDefault = {
  peopleAdults: 1,
  peopleBabies: null,
  peopleChildren: null
};

export default {
  components: { TravelTitle },
  emits: ["submit"],

  data() {
    return {
      adults: times(10, i => ({
        title: this.$t(`travel.people.adults`, i + 1),
        value: i + 1
      })),
      babies: times(5, i => ({
        title: this.$t(`travel.people.babies`, i + 1),
        value: i + 1
      })),
      childs: times(10, i => ({
        title: this.$t(`travel.people.children`, i + 1),
        value: i + 1
      })),

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
