<template>
  <div>
    <v-dialog v-if="active" v-model="active" max-width="800px" persistent>
      <v-card data-nosnippet>
        <v-card-title>
          <v-icon start>mdi-cookie</v-icon>
          {{ $t("@.cookies.title") }}
        </v-card-title>
        <v-card-text>
          {{ $t("@.cookies.description") }}
        </v-card-text>

        <v-card-actions class="flex-wrap">
          <v-btn
            :aria-label="$t('@.cookies.openMore')"
            text
            @click="SettingCookiesDialog()"
            >{{ $t("@.cookies.openMore") }}
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn :aria-label="$t('@.cookies.reject')" text @click="reject">{{
            $t("@.cookies.reject")
          }}</v-btn>

          <v-btn
            :aria-label="$t('@.cookies.acceptAll')"
            variant="text"
            color="primary"
            @click="accept"
            >{{ $t("@.cookies.acceptAll") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <span v-else id="cookies-Dialog"></span>

    <v-row justify="center">
      <v-dialog v-model="openSettingCookies" width="850" persistent>
        <SettingCookies
          @accept="accept"
          @reject="reject"
          @close="openSettingCookies = false"
        ></SettingCookies>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
import { useLocalStorage } from "@vueuse/core";
import gql from "graphql-tag";
import SettingCookies from "./SettingCookies.vue";

export default {
  components: { SettingCookies },

  setup() {
    const dismissed = useLocalStorage("cookies-dialog-dismissed", false);

    return {
      dismissed
    };
  },

  data() {
    return {
      active: false,
      openSettingCookies: false,

      showCookies: false
    };
  },

  mounted() {
    this.injectCbRouteWatcher(route => {
      if (route.name === "cookies") this.active = false;
    });

    if (this.showCookies) {
      let vm = this;
      setTimeout(function () {
        vm.shouldDisplay();
      }, 2000);
    } else {
      this.dismissed = true;
    }
  },

  methods: {
    shouldDisplay() {
      this.active = !this.dismissed;
    },

    SettingCookiesDialog() {
      this.openSettingCookies = true;
    },

    accept() {
      this.dismissed = true;
      this.active = false;
      this.openSettingCookies = false;
    },
    reject() {
      this.dismissed = false;
      this.active = false;
      this.openSettingCookies = false;
    }
  },

  apollo: {
    showCookies: {
      query: gql`
        {
          showCookies
        }
      `
    }
  }
};
</script>

<style></style>
