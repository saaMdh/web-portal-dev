<template>
  <div class="ok-auth-box">
    <message-box ref="alert"></message-box>
    <auth-logo class="mt-n10 mb-4" @gotoPortal="redirectToPortal"></auth-logo>
    <v-card
      class="ok-auth-box__form mx-4"
      elevation="1"
      :loading="loading > 0"
      :disabled="loading > 0"
    >
      <vv-form ref="form" v-slot="{ meta }" @submit="submit">
        <v-card-title
          class="text-primary justify-center text-h5 font-weight-light pa-4 d-flex"
        >
          {{ $t("register.title") }}
        </v-card-title>

        <v-card-text>
          <v-alert v-if="error" type="error" variant="tonal" class="mb-6">
            {{ error.message }}
          </v-alert>
          <vv-field
            v-slot="{ errors, field }"
            name="username"
            rules="required|min:4|max:30|alpha_specs"
          >
            <v-text-field
              v-bind="field"
              v-model="form.username"
              class="my-1"
              variant="outlined"
              prepend-inner-icon="mdi-account"
              :label="$t('register.form.username') + ' *'"
              autocomplete="username"
              name="username"
              :error-messages="errors"
            ></v-text-field>
          </vv-field>

          <vv-field
            id="password"
            v-slot="{ errors, field }"
            name="password"
            rules="required|min:6|max:30"
          >
            <v-text-field
              v-bind="field"
              v-model="form.password"
              class="my-1"
              variant="outlined"
              prepend-inner-icon="mdi-key"
              :label="$t('register.form.password') + ' *'"
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
              :label="$t('register.form.passwordConfirm') + ' *'"
              type="password"
              autocomplete="new-password"
              :error-messages="errors"
            ></v-text-field>
          </vv-field>

          <vv-field v-slot="{ errors, field }" name="email" rules="email">
            <v-text-field
              v-bind="field"
              v-model="form.email"
              class="my-1"
              variant="outlined"
              prepend-inner-icon="mdi-email"
              autocomplete="email"
              :label="$t('register.form.email')"
              type="email"
              :error-messages="errors"
            ></v-text-field>
          </vv-field>

          <div class="d-flex justify-center">
            <vue-recaptcha
              ref="recaptchaRegister"
              :key="cacheRecaptcha"
              :model-value="recaptchaToken"
              :theme="darkMode ? 'dark' : 'light'"
              @update:modelValue="onVerify"
            />
          </div>

          <v-btn
            class="mt-6"
            rounded
            depressed
            color="primary"
            block
            :disabled="!meta.valid || !isHuman"
            :loading="loading > 0"
            type="submit"
            >{{ $t("register.form.submit") }}</v-btn
          >
          <router-link
            :to="{ name: 'legals' }"
            class="d-block mt-4 caption mx-2 text-decoration-none text-secondary text-center"
          >
            {{ $t("register.form.terms") }}
          </router-link>
        </v-card-text>
      </vv-form>

      <div class="d-flex align-center">
        <v-divider></v-divider>
        <span class="px-4"> {{ $t("login.or") }}</span>
        <v-divider></v-divider>
      </div>
      <v-card-text>
        <login-social class="mb-4 mt-2" @submit="authWith"></login-social>
      </v-card-text>
    </v-card>

    <auth-links
      login
      reset
      class="mt-3 mb-5 mx-4"
      @gotoPortal="redirectToPortal"
    ></auth-links>
    <user-selector-dialog
      v-model="userSelector.active"
      :users="userSelector.list"
      @submit="authAs"
    ></user-selector-dialog>
  </div>
</template>

<script>
import { isUndefined, get, isEmpty } from "lodash";
import { Checkbox as VueRecaptcha, useRecaptchaProvider } from "vue-recaptcha";

import MessageBox from "@/components/Dialog/MessageBox.vue";
import AuthLinks from "./components/AuthLinks.vue";
import AuthLogo from "./components/AuthLogo.vue";
import LoginSocial from "./components/LoginSocial.vue";

import UserSelectorDialog from "./Dialog/UserSelectorDialog";

import { registerUser } from "@/api/register";

import { authWithProvider, sendPushNotificationToken } from "@/api/auth";

import Auth from "./mixins/auth";
import SocialMediaLogin from "./mixins/SocialMediaLogin";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import initFirebase from "@/plugins/firebase";

import { Plugins } from "@capacitor/core";

const { Device } = Plugins;
import env from "@/utils/env.js";

export default {
  components: {
    MessageBox,
    VueRecaptcha,
    AuthLinks,
    AuthLogo,
    LoginSocial,
    UserSelectorDialog
  },
  mixins: [Auth, SocialMediaLogin],

  setup() {
    const { token, tokenAt, tokenExpires, darkMode } = useAuthFrame();
    useRecaptchaProvider();
    return { token, tokenAt, tokenExpires, darkMode };
  },

  data() {
    return {
      loading: 0,

      error: null,
      response: null,

      isHuman: false,

      recaptchaKey: env.VUE_APP_RECAPTCHA_KEY,
      recaptchaToken: null,

      userSelector: {
        active: false,
        list: []
      },

      form: {
        email: "",
        username: "",
        password: "",
        password_confirmation: ""
      },

      deviceInfo: null,
      cacheRecaptcha: 0
    };
  },

  head() {
    return {
      title: this.$t("register.title")
    };
  },

  watch: {
    darkMode() {
      this.cacheRecaptcha++;
    }
  },

  async mounted() {
    this.deviceInfo = await Device.getInfo();
    await initFirebase();
  },

  methods: {
    async authWith(provider) {
      this.loading++;

      try {
        const providerToken = await this.socialLogin(provider);

        const result = await authWithProvider(providerToken);

        if (result.length === 1) {
          await this.authAs(result[0], provider);
        } else {
          this.userSelector.list = result;
          this.userSelector.active = true;
        }
      } catch (error) {
        this.error = { message: this.$t(error.message) };
      }

      this.loading--;
    },
    async authAs(user) {
      this.token = user.token;
      this.tokenExpires = user.expires;
      this.tokenAt = new Date();
      await this.onAfterAuth(this.token);
    },

    async onAfterAuth(token = null) {
      if (this.deviceInfo.platform !== "web") {
        await sendPushNotificationToken(token);
      }
      this.redirectToOrigin();
    },

    redirectToPanel() {
      window.location = env.VUE_APP_OUEDKNISS_PANEL;
    },

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
        const user = await registerUser({
          form: {
            email: this.form.email ? this.form.email : undefined,
            username: this.form.username,
            password: this.form.password,
            password_confirmation: this.form.password_confirmation
          },
          recaptchaToken: this.recaptchaToken
        });

        await this.authAsRegister(user);
      } catch (error) {
        if (error.networkError) {
          this.error = { message: this.$t("REGISTER/UNKNOWN_ERROR") };
        } else {
          this.error = { message: this.$t(error.message) };
        }
        this.isHuman = false;
        this.recaptchaToken = null;
      }

      this.loading--;
    },

    async authAsRegister(user) {
      this.token = user.token;
      this.tokenExpires = user.expires;
      this.tokenAt = new Date();

      await this.onAfterRegister(this.token);
    },

    async onAfterRegister(token = null) {
      if (this.deviceInfo.platform !== "web") {
        await sendPushNotificationToken(token);
      }
      this.redirectToOrigin();
    },

    redirectToOrigin() {
      const _prevRoute = get(this.prevRoute, "name", null);
      if (!isUndefined(this.$route.query.redirectTo)) {
        window.location = this.$route.query.redirectTo;
      } else if (!isEmpty(this.$route.query)) {
        let { route_name, ...query } = this.$route.query;
        if (!route_name) this.redirectToPanel();
        return this.$router.push({
          name: route_name,
          query
        });
      } else if (_prevRoute && !(_prevRoute === "home"))
        return this.$router.push(this.prevRoute);
      this.redirectToPanel();
    }
  }
};
</script>
<style lang="scss">
.ok-auth-box {
  max-width: 450px;
}
</style>
