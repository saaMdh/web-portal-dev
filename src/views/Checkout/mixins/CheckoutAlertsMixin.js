import MessageBox from "@/mixins/MessageBox";

export default {
  mixins: [MessageBox],

  methods: {
    deliveryConfirmedAlert() {
      return this.$alert({
        title: this.$t("checkout.alerts.confirmed.0"),
        message: this.$t("checkout.alerts.confirmed.1"),
        icon: "mdi-check",
        iconColor: "success"
      });
    },

    deliveryErrorAlert() {
      return this.$alert({
        title: this.$t("checkout.alerts.queryError.0"),
        message: this.$t("checkout.alerts.queryError.1"),
        icon: "mdi-alert",
        iconColor: "error"
      });
    }
  }
};
