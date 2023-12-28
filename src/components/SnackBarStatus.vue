<template>
  <v-snackbar v-model="snackbar" bottom light :timeout="timeout">
    <span class="snackbar-status">
      <v-icon class="mx-2" :disabled="!onLine">{{ icon }}</v-icon> {{ text }}

      <v-icon v-if="!onLine" @click="refresh">mdi-refresh</v-icon>
    </span>
  </v-snackbar>
</template>
<script>
import { mapGetters } from "vuex";
import { IsBotAgent } from "@ouedkniss/web-ui-plugin/src/utils/Versioning";
import env from "@/utils/env.js";

export default {
  data: () => ({
    snackbar: false,
    dirty: false,
    attemp: 0
  }),
  computed: {
    ...mapGetters(["onLine"]),
    timeout() {
      return this.onLine ? 2000 : -1;
    },
    text() {
      return this.onLine ? this.$t("_.onLine") : this.$t("_.offLine");
    },
    icon() {
      return this.onLine ? "mdi-wifi-check" : "mdi-wifi-remove";
    }
  },
  watch: {
    onLine: {
      handler() {
        if (this.dirty) this.snackbar = true;
      }
    }
  },
  mounted() {
    if (!IsBotAgent())
      setInterval(async () => {
        await this.checkHealth();
        this.dirty = true;
      }, 1000 * 5);
    this.snackbar = false;
  },
  methods: {
    refresh() {
      window.location = "";
    },
    async checkHealth() {
      const healthCheck = new URL(env.VUE_APP_GRAPHQL_HTTP);
      healthCheck.pathname = "/health/ready";
      try {
        await fetch(healthCheck.href);
        this.$store.commit("ui/toggleOnLine", true);
      } catch (error) {
        this.attemp++;

        if (this.attemp > 3) {
          this.$store.commit("ui/toggleOnLine", false);
          this.attemp = 0;
        }
      }
    }
  }
};
</script>

<style>
.snackbar-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
</style>
