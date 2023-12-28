<template>
  <placeholder-wrap>
    <img src="@/assets/logomark-h.svg" alt="" /><br />
    {{ $t("placeHolderError") }}<br />
    <span>
      ¯\_(ツ)_/¯
    </span>
    <br />
    <v-btn rounded color="primary" @click="refresh">
      {{ $t("_.REFRESH") }}
      <v-icon class="mx-1">
        mdi-reload
      </v-icon>
    </v-btn>
  </placeholder-wrap>
</template>

<script>
import PlaceholderWrap from "./PlaceholderWrap";

export default {
  components: {
    PlaceholderWrap
  },
  methods: {
    refresh() {
      window.location = "";
    }
  }
};
</script>

<style></style>
