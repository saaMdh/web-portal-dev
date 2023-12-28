<template>
  <v-card class="travel-card pa-3" elevation="1">
    <vv-form v-slot="{ meta }" @submit="submit">
      <v-row class="align-center">
        <v-col cols="12" sm="4" md="3" lg="3">
          <v-img
            :src="require('@/assets/travel-icon.svg')"
            contain
            style="margin: 0 auto"
            :style="$isDesktop ? 'max-width:250px' : 'max-width:250px;'"
            :aspect-ratio="3.4"
          />
        </v-col>
        <v-col cols="12" sm="8" md="9" lg="9">
          <v-row class="align-center" dense>
            <v-col cols="12">
              <div
                class="d-flex"
                :class="{ 'justify-center': $vuetify.display.xsOnly }"
              >
                <v-btn
                  :aria-label="$t('home.travelCallOut.trip')"
                  rounded="0"
                  :class="{ 'tab-selected': type == 'trip' }"
                  :color="type == 'trip' ? 'primary' : ''"
                  variant="text"
                  class="px-2"
                  @click="type = 'trip'"
                >
                  {{ $t("home.travelCallOut.trip") }}
                  <v-icon class="mx-1">mdi-earth</v-icon></v-btn
                >
                <v-btn
                  :aria-label="$t('home.travelCallOut.flight')"
                  rounded="0"
                  :class="{ 'tab-selected': type == 'flight' }"
                  :color="type == 'flight' ? 'primary' : ''"
                  variant="text"
                  class="px-3"
                  @click="type = 'flight'"
                >
                  {{ $t("home.travelCallOut.flight") }}
                  <v-icon class="mx-1">mdi-airplane</v-icon></v-btn
                >
                <v-btn
                  :aria-label="$t('home.travelCallOut.hotel')"
                  rounded="0"
                  :class="{ 'tab-selected': type == 'hotel' }"
                  :color="type == 'hotel' ? 'primary' : ''"
                  variant="text"
                  class="px-2"
                  @click="type = 'hotel'"
                >
                  {{ $t("home.travelCallOut.hotel") }}
                  <v-icon class="mx-1">mdi-bed</v-icon></v-btn
                >
              </div>
            </v-col>
          </v-row>
          <v-row class="travel-card-form" dense>
            <v-col cols="12" md="7" lg="5">
              <vv-field
                v-slot="{ errors }"
                v-model="form.destination"
                name="destination"
                rules="required"
              >
                <travel-destination-field
                  autocomplete="off"
                  v-model="form.destination"
                  prepend-inner-icon="mdi-flag"
                  :error-messages="errors"
                  variant="solo"
                  density="compact"
                  single-line
                  clearable
                  :label="$t('home.travelCallOut.destination')"
                  hide-details
                ></travel-destination-field>
              </vv-field>
            </v-col>
            <v-col cols="12" md="5" lg="4">
              <v-dialog
                ref="dialog"
                v-model="modal"
                max-width="360"
                content-class="ma-0 w-100"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="dateRangeText"
                    prepend-inner-icon="mdi-calendar"
                    variant="solo"
                    density="compact"
                    hide-details
                    readonly
                  ></v-text-field>
                </template>
                <v-date-picker
                  :model-value="form.date"
                  multiple
                  :title="$t('travel.dates.selectMultiple')"
                  show-adjacent-months
                  @update:modelValue="change"
                  @click:cancel="modal = false"
                ></v-date-picker>
              </v-dialog>
            </v-col>

            <v-col cols="12" md="4" lg="3">
              <v-btn
                v-if="!user"
                :aria-label="$t('travel.tile.estimate')"
                color="primary"
                size="large"
                density="compact"
                block
                elevation="1"
                class="travel-submit"
                :disabled="!meta.valid"
                @click="routeToTravel"
              >
                {{ $t("travel.tile.estimate") }}
              </v-btn>

              <v-btn
                v-else
                :aria-label="$t('travel.tile.estimate')"
                color="primary"
                class="travel-submit"
                size="large"
                density="compact"
                block
                elevation="1"
                type="submit"
                :disabled="!meta.valid"
              >
                {{ $t("travel.tile.estimate") }}
              </v-btn>
            </v-col>
          </v-row></v-col
        >
      </v-row>
    </vv-form>
  </v-card>
</template>

<script>
import { addWeeks, addHours, format } from "date-fns";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

import { VDatePicker } from "vuetify/labs/VDatePicker";
import TravelDestinationField from "@/components/Travel/TravelDestinationField.vue";

export default {
  components: { VDatePicker, TravelDestinationField },

  setup() {
    const { user } = useAuthFrame();

    return {
      user
    };
  },

  data() {
    const d = addWeeks(new Date(), 1);

    return {
      form: {
        destination: null,
        date: [d, addWeeks(d, 1)]
      },
      modal: false,
      type: "trip"
    };
  },

  computed: {
    dateRangeText() {
      if (this.form.date.length > 1)
        return [
          format(new Date(this.form.date[0]), "dd/MM/yyyy"),
          format(new Date(this.form.date[1]), "dd/MM/yyyy")
        ].join("  ~  ");
      else if (this.form.date.length == 1)
        return format(new Date(this.form.date[0]), "dd/MM/yyyy");
      else return "";
    }
  },

  methods: {
    checkDates() {
      let min = null;
      let max = null;
      if (this.form.date.length == 2) {
        max = Math.max(
          new Date(this.form.date[0]),
          new Date(this.form.date[1])
        );
        min = Math.min(
          new Date(this.form.date[0]),
          new Date(this.form.date[1])
        );
      } else {
        if (this.form.date.length == 1) {
          max = new Date(this.form.date[0]);
          min = new Date(this.form.date[0]);
        }
      }

      return { check: min !== null && max !== null, min, max };
    },
    async submit() {
      if (this.checkDates().check) {
        this.$router.push({
          path: "/travel/destination",
          query: {
            destinationId: this.form.destination.id,
            destinationSlug: this.form.destination.slug,
            type: this.type,
            startAt: format(this.checkDates().min, "yyyy-MM-dd"),
            endAt: format(this.checkDates().max, "yyyy-MM-dd")
          }
        });
      }
    },
    change(date) {
      this.form.date = [
        addHours(new Date(date[0]), 5),
        addHours(new Date(date[1]), 5)
      ];
      this.modal = false;
    },
    routeToTravel() {
      if (this.checkDates().check) {
        this.$router.push({
          name: "login",
          query: {
            EnablingAnonymous: true,
            route_name: "travel_form",
            destinationId: this.form.destination.id,
            destinationSlug: this.form.destination.slug,
            type: this.type,
            startAt: format(this.checkDates().min, "yyyy-MM-dd"),
            endAt: format(this.checkDates().max, "yyyy-MM-dd"),
            auth: true
          }
        });
      }
    }
  }
};
</script>
<style lang="scss">
.travel-card .tab-selected {
  border-bottom: 2px solid rgb(var(--v-theme-primary));
}
.travel-card .travel-submit {
  height: 44px !important;
}
</style>
