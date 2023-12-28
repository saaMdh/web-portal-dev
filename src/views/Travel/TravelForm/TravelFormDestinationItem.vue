<template>
  <v-card elevation="1" variant="elevated" rounded="lg">
    <travel-title icon="mdi-wallet-travel" color="orange">
      {{ destination.name }}

      <template #avatar>
        <v-avatar>
          <travel-img :destination="destination"></travel-img>
        </v-avatar>
      </template>
    </travel-title>

    <vv-form ref="form">
      <v-card-text>
        <template v-if="type == 'trip'">
          <v-checkbox v-model="form.requestTransport" class="mt-2" hide-details>
            <template #label>
              <v-icon class="me-2">mdi-airplane-takeoff</v-icon>
              <span :class="$vuetify.locale.rtl ? 'text-right' : 'text-left'">{{
                $t("travel.destination.form.requestTransport")
              }}</span>
            </template>
          </v-checkbox>
          <v-divider></v-divider>
          <v-checkbox v-model="form.requestHotel" hide-details>
            <template #label>
              <v-icon class="me-2">mdi-bed</v-icon>
              <span :class="$vuetify.locale.rtl ? 'text-right' : 'text-left'">{{
                $t("travel.destination.form.requestHotel")
              }}</span>
            </template>
          </v-checkbox>
        </template>
        <template v-if="type == 'trip' || type == 'hotel'">
          <v-expand-transition>
            <div v-if="form.requestHotel" class="mt-4">
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="form.hotelTarget"
                    variant="outlined"
                    :items="hotelTargetList"
                    :label="$t('travel.destination.form.hotelTarget')"
                    hide-details="auto"
                  ></v-select>
                </v-col>
              </v-row>
              <v-expand-transition>
                <v-row v-if="form.hotelTarget == 'PROPOSED'" key="proposed">
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="form.hotelStars"
                      variant="outlined"
                      :items="stars"
                      hide-details
                      :label="$t('travel.destination.form.hotelStars')"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="form.hotelPrice"
                      variant="outlined"
                      hide-details
                      :items="prices"
                      :label="$t('travel.destination.form.hotelPrice')"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" class="pt-0">
                    <v-checkbox
                      v-model="form.hotelOnSea"
                      class="mt-0"
                      hide-details
                      density="comfortable"
                      :label="$t('travel.destination.form.hotelOnSea')"
                    ></v-checkbox>

                    <v-checkbox
                      v-model="form.hotelWithPool"
                      class="mt-0"
                      density="comfortable"
                      hide-details
                      :label="$t('travel.destination.form.hotelWithPool')"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <div
                  v-else-if="form.hotelTarget == 'LIST'"
                  key="list"
                  class="mt-2"
                >
                  <travel-hotel-field
                    v-model="form.hotelById"
                    variant="outlined"
                    class="hotel-target-list"
                    hide-details="auto"
                    :label="$t('travel.destination.form.hotelById')"
                    :destination="destination"
                  ></travel-hotel-field>
                </div>
                <v-row v-else-if="form.hotelTarget == 'CUSTOM'" key="custom">
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.hotelByName"
                      variant="outlined"
                      hide-details
                      :label="$t('travel.destination.form.hotelByName')"
                      hint="Séparés par des virgules"
                    ></v-text-field>

                    <v-checkbox
                      v-model="form.hotelSuggestion"
                      class="mt-3"
                      density="comfortable"
                      hide-details
                      :label="$t('travel.destination.form.hotelSuggestion')"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-expand-transition>
              <v-row class="mt-2">
                <v-col cols="12" md="6">
                  <v-select
                    v-model="form.hotelRooms"
                    hide-details
                    variant="outlined"
                    :items="rooms"
                    :label="$t('travel.destination.form.hotelRooms')"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="form.hotelBoard"
                    hide-details
                    variant="outlined"
                    :items="food"
                    :label="$t('travel.destination.form.hotelBoard')"
                  ></v-select>
                </v-col>
              </v-row>

              <v-divider></v-divider>
              <v-checkbox
                v-model="form.hotelTransport"
                class="my-3"
                density="comfortable"
                hide-details
                :label="$t('travel.destination.form.hotelTransport')"
              >
              </v-checkbox>
            </div>
          </v-expand-transition>
          <v-divider></v-divider>
        </template>

        <v-checkbox
          v-if="form.requestTransport && !form.requestHotel"
          v-model="form.oneWayTrip"
          density="comfortable"
          :label="$t('travel.departure.form.oneWayTrip')"
          hide-details
        ></v-checkbox>

        <date-field
          v-model="form.startAt"
          class="mt-4"
          variant="outlined"
          hide-details
          :allowed-dates="allowedDepartureAt"
          :label="$t('travel.destination.form.startAt')"
        ></date-field>

        <date-field
          v-if="!form.oneWayTrip"
          v-model="form.endAt"
          class="mt-4"
          variant="outlined"
          hide-details
          :allowed-dates="allowedReturnAt"
          :label="$t('travel.destination.form.endAt')"
        ></date-field>
        <v-checkbox
          v-model="form.withOffbeatDate"
          class="mt-3"
          density="comfortable"
          hide-details
          :label="$t('travel.departure.form.withOffbeatDate')"
        ></v-checkbox>

        <template v-if="type == 'trip'">
          <v-divider></v-divider>
          <v-checkbox
            v-model="form.withVisa"
            class="mt-3"
            hide-details
            density="comfortable"
          >
            <template #label>
              <v-icon class="me-2">mdi-card-account-details-star</v-icon>
              <span>{{ $t("travel.extras.form.withVisa") }}</span>
            </template>
          </v-checkbox>
          <v-divider></v-divider>
          <v-checkbox
            v-model="form.withExcursion"
            class="mt-3"
            hide-details
            density="comfortable"
          >
            <template #label>
              <v-icon class="me-2">mdi-bus</v-icon>
              <span>{{ $t("travel.extras.form.withExcursion") }}</span>
            </template>
          </v-checkbox>
        </template>
      </v-card-text>
    </vv-form>

    <v-card-actions v-if="enableDelete" class="justify-end">
      <v-btn
        :aria-label="$t('travel.destination.remove')"
        variant="text"
        color="red"
        @click="$emit('remove')"
      >
        <v-icon start>mdi-delete</v-icon> {{ $t("travel.destination.remove") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import get from "lodash/get";
import { isFuture, isAfter, addMonths, parseISO } from "date-fns";

import DateField from "@/components/Field/DateField.vue";

import TravelHotelField from "@/components/Travel/TravelHotelField.vue";
import TravelImg from "@/components/Travel/TravelImg.vue";

import TravelTitle from "./TravelFormTitle.vue";
import DestinationMixin from "./DestinationMixin";

const formDefault = {
  startAt: new Date(),
  endAt: addMonths(new Date(), 1),
  oneWayTrip: false,
  withOffbeatDate: false,
  destinationId: null,
  requestTransport: true,
  requestHotel: true,
  hotelRooms: 1,
  hotelBoard: "ALL_INCLUSIVE",
  hotelTransport: false,
  hotelTarget: "PROPOSED",
  hotelStars: "STARS_3_OR_4",
  hotelPrice: "BEST_PRICE_QUALITY",
  hotelOnSea: false,
  hotelWithPool: false,
  hotelById: [],
  hotelByName: null,
  hotelSuggestion: true,
  withVisa: false,
  withExcursion: false
};

export default {
  components: { TravelTitle, TravelHotelField, TravelImg, DateField },
  mixins: [DestinationMixin],

  props: {
    destination: {
      type: Object,
      required: true
    },
    startAt: {
      type: Date,
      required: true
    },
    endAt: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    enableDelete: {
      type: Boolean,
      default: false
    }
  },
  emits: ["remove", "submit"],

  data() {
    return {
      rooms: this.getRoomList(),
      food: this.getFoodList(),
      stars: this.getStarList(),
      prices: this.getPriceList(),
      hotelTargetList: this.getHotelTargetList(),

      form: {
        ...formDefault,
        destinationId: this.destination.id,
        startAt: this.startAt,
        endAt: this.endAt
      }
    };
  },
  watch: {
    "form.requestHotel"() {
      if (this.form.requestHotel) this.form.oneWayTrip = false;
    },
    "form.requestTransport"() {
      this.form.oneWayTrip = false;
    }
  },
  mounted() {
    if (this.type == "flight") this.form.requestHotel = false;
    if (this.type == "hotel") this.form.requestTransport = false;
  },
  methods: {
    allowedDepartureAt(date) {
      return isFuture(parseISO(date));
    },

    allowedReturnAt(date) {
      return isAfter(parseISO(date), this.form.startAt);
    },

    async validate() {
      const { valid: isValid } = await this.$refs.form.validate();
      if (!isValid) return isValid;
      this.$emit("submit", this.form);
      return true;
    },

    reset() {
      this.form = {
        ...formDefault,
        destinationId: get(this.destination, "id", null),
        startAt: this.startAt,
        endAt: this.endAt
      };

      this.$emit("submit", this.form);
    }
  }
};
</script>
