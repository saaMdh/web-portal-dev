import times from "lodash/times";

export default {
  methods: {
    getRoomList() {
      return times(10, i => ({
        title: this.$t("travel.destination.rooms", i + 1),
        value: i + 1
      }));
    },

    getFoodList() {
      return [
        { title: this.$t("travel.destination.food.0"), value: "BREAKFAST" },
        { title: this.$t("travel.destination.food.1"), value: "HALF_PENSION" },
        { title: this.$t("travel.destination.food.2"), value: "FULL_BOARD" },
        { title: this.$t("travel.destination.food.3"), value: "ALL_INCLUSIVE" }
      ];
    },

    getStarList() {
      return [
        { title: this.$t("travel.destination.stars.0"), value: "STARS_3" },
        { title: this.$t("travel.destination.stars.1"), value: "STARS_4" },
        { title: this.$t("travel.destination.stars.2"), value: "STARS_3_OR_4" },
        { title: this.$t("travel.destination.stars.3"), value: "STARS_5" },
        { title: this.$t("travel.destination.stars.4"), value: "STARS_LESS_3" }
      ];
    },

    getPriceList() {
      return [
        { title: this.$t("travel.destination.prices.0"), value: "LESS_THAN_50" },
        {
          title: this.$t("travel.destination.prices.1"),
          value: "BETWEEN_50_100"
        },
        {
          title: this.$t("travel.destination.prices.2"),
          value: "BETWEEN_100_180"
        },
        {
          title: this.$t("travel.destination.prices.3"),
          value: "GREATER_THAN_180"
        },
        {
          title: this.$t("travel.destination.prices.4"),
          value: "BEST_PRICE_QUALITY"
        }
      ];
    },

    getHotelTargetList() {
      return [
        {
          value: "PROPOSED",
          title: this.$t("travel.destination.targetList.0")
        },
        {
          value: "LIST",
          title: this.$t("travel.destination.targetList.1")
        },
        {
          value: "CUSTOM",
          title: this.$t("travel.destination.targetList.2")
        }
      ];
    }
  }
};
