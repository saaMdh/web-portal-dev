<template>
  <v-container fluid style="height: 60vh" class="pa-12">
    <v-card
      variant="outlined"
      color="transparent"
      height="60vh"
      class="d-flex flex-column align-center justify-center"
      min-height="250"
    >
      <v-card-title class="justify-center text-center text-break">{{
        $t("merchant.title")
      }}</v-card-title>
      <v-progress-circular
        size="64"
        width="2"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-card>
  </v-container>
</template>
<script>
import gql from "graphql-tag";
import { getTrackingHeaders } from "@ouedkniss/web-ui-plugin/src/utils/Tracking";
export default {
  async mounted() {
    try {
      const { data } = await this.$apollo.mutate({
        mutation: gql`
                mutation{
                        merchantCartInit(merchantId : "${this.$route.params.id}" ){
                            merchantOrderId
                            merchantUrl
                        }
                }`
      });
      let url = data.merchantCartInit.merchantUrl;
      const tracking = getTrackingHeaders();
      const xTrackId = tracking["X-Track-ID"];
      url = url.replace("{orderId}", data.merchantCartInit.merchantOrderId);
      url = url.replace("{sessionId}", xTrackId);
      window.location.href = url;
    } catch (e) {
      this.$router.push({
        name: "home"
      });
    }
  }
};
</script>
<style></style>
