<template>
  <div class="o-hotel-field">
    <v-row>
      <v-col cols="12" md="9">
        <v-text-field
          v-model="filter.name"
          dense
          hide-details
          clearable
          variant="outlined"
          :placeholder="$t('_.search')"
          @keydown.stop
        ></v-text-field>
      </v-col>
      <v-col>
        <v-select
          v-model="filter.price"
          cols="12"
          md="3"
          :items="priceList"
          item-title="text"
          item-value="value"
          dense
          hide-details
          single-line
          clearable
          variant="outlined"
          :label="$t('_.price')"
        ></v-select>
      </v-col>
    </v-row>
    <v-progress-linear
      :active="$apollo.queries.hotelList.loading"
      indeterminate
      class="mt-3"
    ></v-progress-linear>
    <div v-if="hotelList.data && hotelList.data.length > 0">
      <v-list class="hotels-list">
        <v-list-item
          v-for="item in hotelList.data"
          :key="item.id"
          style="cursor: pointer"
          class="px-0"
          @click="add(item.id)"
        >
          <template #prepend>
            <v-icon v-if="selected.includes(item.id)" color="primary"
              >mdi-checkbox-marked-outline</v-icon
            >
            <v-icon v-else>mdi-checkbox-blank-outline</v-icon>
          </template>

          <v-list-item-content>
            <v-list-item-title style="white-space: inherti">
              {{ item.name }}
            </v-list-item-title>
            <div v-if="item.price || item.location">
              <span v-if="item.price" class="text-primary">
                &asymp; {{ item.price.min }} - {{ item.price.max }}
              </span>
              <br />
              <span v-if="item.location"> {{ item.location }}</span>
            </div>
          </v-list-item-content>
          <template #append>
            <template v-if="$isDesktop && item.ratingImageUrl">
              <v-img contain :src="item.ratingImageUrl"></v-img>
            </template>
            <template v-if="item.webUrl">
              <v-btn
                :aria-label="$t('_.showMore')"
                :href="item.webUrl"
                target="_blank"
                icon
                @click.stop
              >
                <v-tooltip location="bottom">
                  <template #activator="{ props }">
                    <v-icon v-bind="props">mdi-open-in-new</v-icon>
                  </template>
                  <span>{{ $t("_.showMore") }}</span>
                </v-tooltip>
              </v-btn>
            </template></template
          >
        </v-list-item>

        <div
          v-if="hotelList.paginatorInfo.lastPage > 1"
          class="text-center py-4"
        >
          <pagination
            v-model="page"
            :length="hotelList.paginatorInfo.lastPage"
          ></pagination>
        </div>
      </v-list>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Pagination from "@/components/Pagination.vue";
export default {
  components: { Pagination },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    destination: {
      type: Object,
      required: true
    }
  },
  emits: ["input"],

  data() {
    return {
      selected: this.modelValue,
      priceList: [
        {
          text: this.$t("travel.destination.prices[4]"),
          value: "BEST_PRICE_QUALITY"
        },
        {
          text: this.$t("travel.destination.prices[0]"),
          value: "LESS_THAN_50"
        },
        {
          text: this.$t("travel.destination.prices[1]"),
          value: "BETWEEN_50_100"
        },
        {
          text: this.$t("travel.destination.prices[2]"),
          value: "BETWEEN_100_180"
        },
        {
          text: this.$t("travel.destination.prices[3]"),
          value: "GREATER_THAN_180"
        }
      ],
      hotelList: {
        data: [],
        paginatorInfo: {
          lastPage: 0
        }
      },
      filter: {
        name: "",
        price: null,
        orderBy: null
      },
      first: 20,
      page: 1
    };
  },
  watch: {
    "filter.price": {
      handler() {
        this.page = 1;
      }
    },
    "filter.name": {
      handler() {
        this.page = 1;
      }
    },
    page() {
      const el = document.querySelector(".o-hotel-field");
      el.scrollIntoView({ behavior: "smooth" });
    }
  },
  apollo: {
    hotelList: {
      query: gql`
        query ($first: Int, $page: Int, $filter: TripAdvisorFilter) {
          hotelList: travelHotelList(
            first: $first
            page: $page
            filter: $filter
          ) {
            paginatorInfo {
              lastPage
            }
            data {
              id
              name
              webUrl
              location
              rating
              ratingImageUrl

              photos {
                thumbnail {
                  url
                }
              }

              price {
                min
                max
              }
            }
          }
        }
      `,

      variables() {
        return {
          filter: {
            destinationId: this.destination.id,
            name: this.filter.name,
            price: this.filter.price,
            orderBy: this.filter.orderBy
          },
          first: this.first,
          page: this.page
        };
      }
    }
  },

  methods: {
    add(value) {
      let x = this.selected.indexOf(value);
      if (x == -1) this.selected.push(value);
      else this.selected.splice(x, 1);
      this.$emit("update:modelValue", this.selected);
    }
  }
};
</script>
<style lang="scss">
.hotels-list .v-list-item__action {
  margin: 0 0px !important;
}
.hotels-list .v-list-item__title,
.hotels-list .v-list-item__subtitle {
  white-space: unset;
}
</style>
