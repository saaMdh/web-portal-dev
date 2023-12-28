<template>
  <placeholder-wrap>
    <img src="@/assets/logomark-h.svg" alt="" /><br />
    {{ $t("placeHolderNotFound") }}<br />
    <span>
      ¯\_(ツ)_/¯
    </span>
    <br />
    <v-btn rounded color="primary" @click="backToOrigin">
      {{ $t("_.return") }}
      <v-icon class="mx-1">
        mdi-home
      </v-icon>
    </v-btn>
  </placeholder-wrap>
</template>

<script>
import PlaceholderWrap from "./PlaceholderWrap";
import env from "@/utils/env.js";

export default {
  components: {
    PlaceholderWrap
  },
  methods: {
    backToOrigin() {
      window.location = env.VUE_APP_OUEDKNISS_PORTAL;
    }
  }
};
</script>

<style></style>
