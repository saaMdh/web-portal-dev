<template>
  <v-container>
    <template v-if="user">
      <travel-departure ref="departure" @submit="merge"></travel-departure>

      <v-progress-linear
        indeterminate
        :active="loading > 0"
      ></v-progress-linear>

      <travel-destination-list
        ref="destinations"
        class="mt-4"
        :type="type"
        @submit="merge"
      ></travel-destination-list>

      <travel-people ref="people" class="mt-4" @submit="merge"></travel-people>

      <travel-extras ref="extras" class="mt-4" @submit="merge"></travel-extras>

      <travel-agency ref="agency" class="mt-4" @submit="merge"></travel-agency>

      <travel-sup-infos
        ref="supinfo"
        class="mt-4"
        @submit="merge"
      ></travel-sup-infos>

      <travel-action
        :loading="loading > 0"
        @submit="submit"
        @reset="reset"
      ></travel-action>
    </template>
  </v-container>
</template>

<script>
import merge from "lodash/merge";
import every from "lodash/every";
import { addMonths } from "date-fns";

import MessageBox from "@/mixins/MessageBox";

import TravelQueries from "./Travel.graphql";
import TravelDeparture from "./TravelForm/TravelFormDeparture.vue";
import TravelAgency from "./TravelForm/TravelFormAgency.vue";
import TravelExtras from "./TravelForm/TravelFormExtras.vue";
import TravelPeople from "./TravelForm/TravelFormPeople.vue";
import TravelAction from "./TravelForm/TravelFormAction.vue";
import TravelSupInfos from "./TravelForm/TravelSupInfos.vue";
import TravelDestinationList from "./TravelForm/TravelFormDestinationList.vue";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

export default {
  components: {
    TravelDestinationList,
    TravelPeople,
    TravelExtras,
    TravelAgency,
    TravelDeparture,
    TravelAction,
    TravelSupInfos
  },
  mixins: [MessageBox],

  props: {
    destinationId: {
      type: [Number, String],
      default: null
    }
  },

  setup() {
    const { user } = useAuthFrame();

    return {
      user
    };
  },

  data() {
    return {
      loading: 0,
      destination: null,
      type: "trip",
      form: {}
    };
  },

  head() {
    if (!this.destination) return {};

    return {
      title: this.destination.name,
      titleTemplate: this.$t("travel.meta.titleTemplate")
    };
  },
  mounted() {
    if (this.$route.query.type) this.type = this.$route.query.type;
  },

  apollo: {
    destination: {
      loadingKey: "loading",
      query: TravelQueries.DestinationGet,
      fetchPolicy: "cache-first",
      variables() {
        return {
          id: this.$route.query.destinationId || this.destinationId
        };
      },
      skip() {
        return !this.user;
      },
      result({ data, loading }) {
        if (loading) return;

        this.$nextTick(() => {
          this.$refs.destinations.addDestinationTrip({
            destination: data.destination,
            startAt: this.$route.query.startAt
              ? new Date(this.$route.query.startAt)
              : addMonths(new Date(), 1),
            endAt: this.$route.query.endAt
              ? new Date(this.$route.query.endAt)
              : addMonths(new Date(), 2)
          });
        });
      }
    }
  },

  methods: {
    merge(form) {
      merge(this.form, form);
    },

    reset() {
      this.$refs.departure.reset();
      this.$refs.destinations.reset();
      this.$refs.people.reset();
      this.$refs.extras.reset();
      this.$refs.agency.reset();
      this.$refs.supinfo.reset();

      this.goTo(0);
    },

    async submit() {
      const subform = [
        this.$refs.departure.validate(),
        this.$refs.destinations.validate(),
        this.$refs.people.validate(),
        this.$refs.extras.validate(),
        this.$refs.agency.validate(),
        this.$refs.supinfo.validate()
      ];

      const validations = await Promise.all(subform);

      if (!every(validations)) {
        this.goTo(0);
        return;
      }

      try {
        this.loading++;
        this.form.departureDestination = undefined;
        await this.$apollo.mutate({
          mutation: TravelQueries.Submit,
          variables: {
            request: this.form
          }
        });

        await this.$alert({
          icon: "mdi-wallet-travel",
          iconColor: "green",
          title: this.$t("travel.success.0"),
          message: this.$t("travel.success.1")
        });

        // TODO: Loading with overlay
        this.form.departureDestination = null;
        this.$router.push({ name: "home" });
      } catch (error) {
        await this.$alert({
          title: this.$t("travel.error.0"),
          message: this.$t("travel.error.1")
        });
      }

      this.loading--;
    }
  }
};
</script>

<style lang="scss"></style>
