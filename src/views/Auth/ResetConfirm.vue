<template>
  <div class="justify-center align-center">
    <message-box ref="alert"></message-box>

    <div v-if="token" class="ok-auth-box">
      <auth-logo class="mt-n10 mb-4" @gotoPortal="redirectToPortal"></auth-logo>
      <v-card class="mb-2 mx-4" elevation="1">
        <vv-form ref="form" v-slot="{ meta }" @submit="submit">
          <v-card-title
            class="text-primary justify-center text-h5 font-weight-light d-flex pa-4"
          >
            {{ $t("reset.confirm.title") }}
          </v-card-title>
          <v-card-text>
            <v-alert v-if="error" type="error" variant="tonal" class="mb-6">
              {{ error.message }}
            </v-alert>
            <vv-field
              id="password"
              v-slot="{ errors, field }"
              name="password"
              rules="required"
            >
              <v-text-field
                v-bind="field"
                v-model="form.password"
                class="my-1"
                variant="outlined"
                prepend-inner-icon="mdi-key"
                :label="$t('reset.confirm.form.password')"
                type="password"
                autocomplete="new-password"
                :error-messages="errors"
              ></v-text-field>
            </vv-field>

            <vv-field
              id="confirmation"
              v-slot="{ errors, field }"
              name="confirmation"
              rules="confirmed:@password"
            >
              <v-text-field
                v-bind="field"
                v-model="form.password_confirmation"
                class="my-1"
                variant="outlined"
                prepend-inner-icon="mdi-key"
                :label="$t('reset.confirm.form.passwordConfirm')"
                type="password"
                autocomplete="new-password"
                :error-messages="errors"
              ></v-text-field>
            </vv-field>
            <div class="d-flex justify-center align-center">
              <vue-recaptcha
                ref="recaptchaResetConfirm"
                :key="cacheRecaptcha"
                :model-value="recaptchaToken"
                :theme="darkMode ? 'dark' : 'light'"
                @update:modelValue="onVerify"
              >
              </vue-recaptcha>
            </div>
          </v-card-text>
          <v-card-actions class="justify-center mt-4 mb-2">
            <v-btn
              rounded
              depressed
              block
              color="primary"
              type="submit"
              :disabled="!meta.valid || !isHuman"
              :loading="loading > 0"
            >
              {{ $t("reset.confirm.form.submit") }}
            </v-btn>
          </v-card-actions>
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
import isUndefined from "lodash/isUndefined";
import { Checkbox as VueRecaptcha, useRecaptchaProvider } from "vue-recaptcha";

import { resetConfirm } from "@/api/reset";

import MessageBox from "@/components/Dialog/MessageBox.vue";
import AuthLogo from "./components/AuthLogo.vue";
import AuthLinks from "./components/AuthLinks.vue";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import Auth from "./mixins/auth";
import env from "@/utils/env.js";

export default {
  components: { MessageBox, VueRecaptcha, AuthLogo, AuthLinks },
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

      error: null,

      token: null,

      id: null,

      isHuman: false,

      recaptchaToken: null,

      loading: 0,

      form: {
        password: null,
        password_confirmation: null
      },
      cacheRecaptcha: 0
    };
  },

  head() {
    return {
      title: this.$t("reset.confirm.title")
    };
  },

  computed: {
    $isMobile() {
      return this.$vuetify.display.smAndDown;
    }
  },

  watch: {
    darkMode() {
      this.cacheRecaptcha++;
    }
  },

  created() {
    if (
      !isUndefined(this.$route.query.token) &&
      !isUndefined(this.$route.query.id)
    ) {
      this.token = this.$route.query.token;
      this.id = this.$route.query.id;
    } else {
      this.error = new Error(this.$t("reset.confirm.noToken"));
    }
  },

  methods: {
    onVerify(response) {
      if (!response) return;

      this.isHuman = true;

      this.recaptchaToken = response;
    },

    async submit() {
      if (!this.isHuman) return;

      const { valid: isValid } = await this.$refs.form.validate();
      if (!isValid) return;

      this.loading++;

      try {
        await resetConfirm({
          form: this.form,
          token: this.token,
          id: this.id,
          recaptchaToken: this.recaptchaToken
        });

        await this.$refs.alert.open({
          icon: "mdi-check",
          iconColor: "green",
          title: this.$t("reset.confirm.alerts.success.0"),
          message: this.$t("reset.confirm.alerts.success.1"),
          acceptButtonLabel: this.$t("reset.confirm.alerts.success.2"),
          rejectButtonShow: false
        });

        this.$router.push({ name: "login" });
      } catch (error) {
        this.error = new Error(this.$t(error.message));
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
