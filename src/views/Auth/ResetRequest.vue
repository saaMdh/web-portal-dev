<template>
  <div class="justify-center align-center">
    <message-box ref="alert"></message-box>

    <div class="ok-auth-box">
      <auth-logo class="mt-n10 mb-4" @gotoPortal="redirectToPortal"></auth-logo>
      <v-card class="mb-2 mx-4" elevation="1">
        <vv-form ref="form" v-slot="{ meta }" @submit="submit">
          <v-card-title
            class="text-primary justify-center text-h6 font-weight-light d-flex pa-4"
          >
            {{ $t("reset.request.title") }}
          </v-card-title>
          <v-card-text>
            <v-alert v-if="error" type="error" variant="tonal" class="mb-6">
              {{ error.message }}
            </v-alert>
            <vv-field v-slot="{ errors, field }" name="email" rules="email">
              <v-text-field
                v-bind="field"
                v-model="form.email"
                class="my-1"
                :error-messages="errors"
                :disabled="loading > 0"
                variant="outlined"
                autofocus
                :label="$t(`reset.request.form.both`)"
              >
              </v-text-field>
            </vv-field>
            <div class="d-flex justify-center align-center">
              <vue-recaptcha
                ref="recaptchaResetRequest"
                :key="cacheRecaptcha"
                :model-value="recaptchaToken"
                :theme="darkMode ? 'dark' : 'light'"
                @update:modelValue="onVerify"
              >
              </vue-recaptcha>
            </div>
            <v-btn
              class="mt-4"
              rounded
              block
              depressed
              color="primary"
              :disabled="!meta.valid || !isHuman"
              :loading="loading > 0"
              type="submit"
            >
              {{ $t("reset.request.form.submit") }}
            </v-btn>
          </v-card-text>
        </vv-form>
      </v-card>
      <auth-links
        register
        login
        class="mt-2 mb-5 mx-4"
        @gotoPortal="redirectToPortal"
      ></auth-links>
    </div>
  </div>
</template>

<script>
import { Checkbox as VueRecaptcha, useRecaptchaProvider } from "vue-recaptcha";

import MessageBox from "@/components/Dialog/MessageBox.vue";
import AuthLinks from "./components/AuthLinks.vue";
import AuthLogo from "./components/AuthLogo.vue";

import { resetRequest } from "@/api/reset";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

import Auth from "./mixins/auth";
import env from "@/utils/env.js";

export default {
  components: { MessageBox, VueRecaptcha, AuthLinks, AuthLogo },
  mixins: [Auth],

  setup() {
    const { darkMode } = useAuthFrame();
    useRecaptchaProvider();
    return {
      darkMode
    };
  },

  data() {
    return {
      recaptchaKey: env.VUE_APP_RECAPTCHA_KEY,
      loading: 0,
      error: null,
      isHuman: false,
      recaptchaToken: null,
      form: {
        email: null
      },
      cacheRecaptcha: 0
    };
  },

  head() {
    return {
      title: this.$t("reset.request.title")
    };
  },

  watch: {
    darkMode() {
      this.cacheRecaptcha++;
    }
  },

  methods: {
    onVerify(response) {
      if (!response) return;

      this.isHuman = true;

      this.recaptchaToken = response;
    },

    async submit() {
      const { valid: isValid } = await this.$refs.form.validate();
      if (!isValid) return;

      if (!this.isHuman) return;

      this.loading++;

      try {
        const form = this.form;
        const { user_email } = await resetRequest({
          form,
          recaptchaToken: this.recaptchaToken
        });

        await this.$refs.alert.open({
          icon: "mdi-check",
          iconColor: "green",
          title: this.$t("reset.request.alerts.success.0", !!user_email, {
            to: user_email
          }),
          message: this.$t("reset.request.alerts.success.1"),
          acceptButtonLabel: this.$t("reset.request.alerts.success.2"),
          rejectButtonShow: false
        });

        this.$router.push({ name: "home" });
      } catch (error) {
        this.error = { message: this.$t(error.message) };
        this.isHuman = false;
        this.recaptchaToken = null;
      }

      this.loading--;
    }
  }
};
</script>

<style lang="scss">
.ok-auth-box {
  max-width: 450px;
}
</style>
