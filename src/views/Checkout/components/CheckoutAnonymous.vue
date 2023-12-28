<template>
  <div>
    <v-row class="px-2 py-0">
      <v-col class="pa-2" cols="12" sm="6" md="4">
        <v-card class="rounded-xl elevation-1 pa-4">
          <data-placeholder
            icon="mdi-cart-arrow-right"
            :scale="$isDesktop ? 0.8 : 0.6"
            class="mx-2"
            color="secondary"
          >
            {{ $t("checkout.continueWithoutLogin") }}

            <template #actions>
              <div
                v-if="nbClick > 0"
                class="d-flex justify-center align-center mb-4"
              >
                <vue-recaptcha
                  ref="recaptcha"
                  :model-value="recaptchaToken"
                  @update:modelValue="onVerify"
                >
                </vue-recaptcha>
              </div>

              <v-btn
                :aria-label="$t('_.continue')"
                rounded
                depressed
                color="secondary"
                :disabled="!isHuman && nbClick == 1"
                @click="loginAnonymous"
              >
                {{ $t("_.continue") }}
              </v-btn>
            </template>
          </data-placeholder>
        </v-card>
      </v-col>

      <v-col class="pa-2" cols="12" sm="12" md="4">
        <v-card class="rounded-xl elevation-1 pa-4">
          <data-placeholder
            icon="mdi-login-variant"
            :scale="$isDesktop ? 0.8 : 0.6"
            class="mx-2"
          >
            {{ $t("checkout.continueWithLogin") }}

            <template #actions>
              <v-btn
                :aria-label="$t('topbar.account.login')"
                lar
                :to="{ name: 'login' }"
                rounded
                depressed
                color="primary"
              >
                {{ $t("topbar.account.login") }}
              </v-btn>
            </template>
          </data-placeholder>
        </v-card>
      </v-col>
      <v-col class="pa-2" cols="12" sm="6" md="4">
        <v-card class="rounded-xl elevation-1 pa-4">
          <data-placeholder
            icon="mdi-account-box"
            :scale="$isDesktop ? 0.8 : 0.6"
            class="mx-2"
            color="grey"
          >
            {{ $t("checkout.continueWithSocialMedia") }}
            <template #actions>
              <div class="d-flex justify-space-around">
                <v-btn
                  aria-label="'facebook'"
                  depressed
                  :to="{ name: 'login', query: { social: 'facebook' } }"
                  dark
                  color="#3b5999"
                >
                  <v-icon start>mdi-facebook</v-icon> Facebook
                </v-btn>

                <v-btn
                  aria-label="google"
                  depressed
                  :to="{ name: 'login', query: { social: 'google' } }"
                  dark
                  color="#dd4b39"
                >
                  <v-icon start>mdi-google</v-icon> Google
                </v-btn>
              </div>
            </template>
          </data-placeholder>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { Checkbox as VueRecaptcha, useRecaptchaProvider } from "vue-recaptcha";
import env from "@/utils/env.js";

export default {
  components: { VueRecaptcha },
  setup() {
    useRecaptchaProvider();
  },

  data() {
    return {
      recaptchaKey: env.VUE_APP_RECAPTCHA_KEY,

      isHuman: false,

      recaptchaToken: null,

      nbClick: 0
    };
  },

  methods: {
    onVerify(response) {
      if (!response) return;

      this.isHuman = true;

      this.recaptchaToken = response;
    },

    loginAnonymous() {
      if (this.nbClick === 0) this.nbClick++;

      if (!this.isHuman) return;

      this.$router.push({
        name: "login",
        query: {
          redirectTo: location.href,
          loginAnonymous: true,
          recaptchaToken: this.recaptchaToken
        }
      });
    }
  }
};
</script>

<style></style>
