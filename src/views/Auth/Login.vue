<template>
  <div
    v-if="isAnonymous"
    class="progress d-flex text-center justify-center align-center"
  >
    <div class="text-primary text-h6 mb-10 login-progress-text px-4">
      <span>{{ $t("loginProgress.anonymousLoginProgress") }}</span>
    </div>
    <v-progress-circular
      color="primary"
      size="60"
      width="2"
      indeterminate
    ></v-progress-circular>
  </div>

  <div
    v-else-if="socialMediaConnexion || blurred"
    class="progress d-flex text-center justify-center align-center"
  >
    <div class="text-primary text-h6 mb-10 login-progress-text px-4">
      <span>{{ $t("loginProgress.inProgresss") }}</span>
    </div>
    <v-progress-circular
      color="primary"
      size="60"
      width="2"
      indeterminate
    ></v-progress-circular>
  </div>
  <div v-else class="ok-auth-box" :style="blurred ? 'filter: blur(1px)' : ''">
    <auth-logo class="mt-n10 mb-4" @gotoPortal="redirectToPortal"></auth-logo>
    <template v-if="EnablingAnonymous">
      <v-card
        class="mx-4"
        elevation="1"
        :disabled="loading > 0"
        :loading="loading > 0"
      >
        <v-card-title class="d-flex justify-center pa-4">
          <span class="text-primary text-h5 font-weight-light">
            {{ $t("login.anonymousTitle") }}
          </span>
        </v-card-title>
        <v-card-text>
          <login-anonymous :chunk="chunkId"></login-anonymous>
        </v-card-text>
      </v-card>
      <div class="d-flex align-center mx-4 my-4">
        <v-divider></v-divider>
        <span class="px-4"> {{ $t("login.or") }}</span>
        <v-divider></v-divider>
      </div>
    </template>
    <v-card
      class="mx-4"
      elevation="1"
      :disabled="loading > 0"
      :loading="loading > 0"
    >
      <v-card-title class="d-flex justify-center pa-4">
        <span class="text-primary text-h5 font-weight-light">
          {{ $t("login.title") }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
          {{ error.message }}
        </v-alert>

        <v-alert
          v-if="success"
          key="success"
          type="success"
          :icon="false"
          variant="tonal"
          class="mb-4"
        >
          <v-progress-circular indeterminate></v-progress-circular>
          <span class="ms-4">{{ $t("loginProgress.success") }}</span>
        </v-alert>

        <login-social @submit="authWith"></login-social>
        <v-btn
          class="mt-3"
          block
          depressed
          :to="{ name: 'register' }"
          dark
          color="green-darken-3"
        >
          <v-icon start>mdi-account-plus</v-icon>
          {{ $t("login.links.signup") }}
        </v-btn>
      </v-card-text>
      <div class="d-flex align-center">
        <v-divider></v-divider>
        <span class="px-4"> {{ $t("login.or") }}</span>
        <v-divider></v-divider>
      </div>

      <vv-form ref="form" v-slot="{ meta }" tag="div" @submit="submit">
        <v-card-text>
          <vv-field
            v-slot="{ errors, field }"
            rules="required|min:3|max:100"
            name="username"
          >
            <v-text-field
              v-bind="field"
              v-model="form.username"
              class="my-1"
              autocomplete="username"
              :error-messages="errors"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              :label="$t('login.form.username')"
            ></v-text-field>
          </vv-field>

          <vv-field
            v-slot="{ errors, field }"
            rules="required|min:4|max:50"
            name="password"
          >
            <v-text-field
              v-bind="field"
              v-model="form.password"
              class="my-1"
              type="password"
              autocomplete="current-password"
              :error-messages="errors"
              prepend-inner-icon="mdi-key"
              variant="outlined"
              :label="$t('login.form.password')"
            ></v-text-field>
          </vv-field>
          <v-btn
            rounded
            depressed
            block
            :color="!meta.valid ? '' : 'primary'"
            type="submit"
            :disabled="!meta.valid"
          >
            {{ $t("login.form.submit") }}
          </v-btn>
        </v-card-text>
      </vv-form>
    </v-card>

    <auth-links
      register
      reset
      class="mt-2 mb-5 mx-4"
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
import isUndefined from "lodash/isUndefined";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import BuildUrl from "build-url";

import LoginAnonymous from "./Login/LoginAnonymous.vue";
import AuthLinks from "./components/AuthLinks.vue";
import AuthLogo from "./components/AuthLogo.vue";
import LoginSocial from "./components/LoginSocial.vue";

import Auth from "./mixins/auth";
import SocialMediaLogin from "./mixins/SocialMediaLogin";

import UserSelectorDialog from "./Dialog/UserSelectorDialog";

import { Plugins } from "@capacitor/core";

import {
  authWithProvider,
  authAnonymous,
  authUser,
  sendPushNotificationToken,
  authWithFacebook
} from "@/api/auth";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

import initFirebase from "@/plugins/firebase";
import { isExternalDomain } from "@/utils/location";
import env from "@/utils/env.js";

const { Device } = Plugins;

export default {
  components: {
    LoginAnonymous,
    AuthLinks,
    AuthLogo,
    LoginSocial,
    UserSelectorDialog
  },
  mixins: [Auth, SocialMediaLogin],

  setup() {
    const { token, user, tokenAt, tokenExpires } = useAuthFrame();

    return { token, user, tokenAt, tokenExpires };
  },

  data() {
    return {
      loading: 0,
      success: false,
      error: null,
      isAnonymous: false,
      EnablingAnonymous: false,
      chunkId: null,

      userSelector: {
        active: false,
        list: []
      },

      form: {
        username: "",
        password: ""
      },

      deviceInfo: null,
      socialUser: null,
      socialMediaConnexion: false,
      blurred: false,
      userUnwatch: null
    };
  },

  head() {
    return {
      title: this.$t("login.title")
    };
  },

  watch: {
    socialUser: {
      async handler() {
        this.socialMediaConnexion = true;

        const providerToken = this.socialUser._lat;
        const result = await authWithProvider(providerToken);

        if (result.length === 1) {
          //TODO Enhance event
          await this.authAs(result[0], "firebase");
        } else {
          this.blurred = false;
          this.userSelector.list = result;
          this.userSelector.active = true;
        }

        sessionStorage.removeItem("AuthWithRedirect");
        this.socialMediaConnexion = false;
      }
    },
    "$route.query.loginAnonymous": {
      async handler() {
        if (this.$route.query.loginAnonymous) {
          this.isAnonymous = true;
          const recaptchaToken = this.$route.query.recaptchaToken;
          this.loading++;

          try {
            const { token, expires } = await authAnonymous(recaptchaToken);

            if (this.userUnwatch !== null) {
              // This prevents an error from occurring when changing the token in localStorage.
              // If the token is changed, it triggers the token watcher in App.vue, which then changes the user in localStorage.
              // This, in turn, triggers the user watcher in Login.vue (the current component).
              this.userUnwatch();
            }
            this.token = token;
            this.tokenExpires = expires;
            this.tokenAt = new Date();

            this.redirectToOrigin();
          } catch (error) {
            if (env.isDev) console.error(error);
            this.error = { message: this.$t(error.message) };
            this.redirectToPortal();
          }

          this.loading--;
        }
      },
      immediate: true
    }
  },
  created() {
    if (this.$route.query.EnablingAnonymous) this.EnablingAnonymous = true;
    if (this.$route.query.chunkId) this.chunkId = this.$route.query.chunkId;
    this.socialMediaConnexion = sessionStorage.getItem("AuthWithRedirect")
      ? sessionStorage.getItem("AuthWithRedirect")
      : false;
  },
  async mounted() {
    this.deviceInfo = await Device.getInfo();
    const firebase = await initFirebase();
    firebase
      .auth()
      .getRedirectResult()
      .then(result => {
        if (result.user) {
          this.blurred = true;
          this.socialUser = result.user;
        } else {
          sessionStorage.removeItem("AuthWithRedirect");
          this.socialMediaConnexion = false;
        }
      })
      .catch(error => {
        console.error(error);
      });

    this.userUnwatch = this.$watch("user", function handler(newVal, oldVal) {
      if (!oldVal && newVal && !isEqual(oldVal, newVal))
        this.redirectToOrigin();
    });
  },

  methods: {
    async authWith(provider) {
      this.loading++;

      try {
        const providerToken = await this.socialLogin(
          provider,
          this.deviceInfo.platform
        );

        if (this.deviceInfo.platform !== "web") {
          const result = await authWithProvider(providerToken);

          if (result.length === 1) {
            await this.authAs(result[0], provider);
          } else {
            this.userSelector.list = result;
            this.userSelector.active = true;
          }
        }
      } catch (error) {
        if (
          error.access_token &&
          error.code === "auth/invalid-credential" &&
          error.message === "Invalid access_token, error code 43"
        ) {
          try {
            if (this.deviceInfo.platform !== "web") {
              const result = await authWithFacebook(error.access_token);
              if (result.length === 1) {
                await this.authAs(result[0], provider);
              } else {
                this.userSelector.list = result;
                this.userSelector.active = true;
              }
            }
          } catch (error) {
            this.error = { message: this.$t(error.message) };
          }
        } else {
          this.error = { message: this.$t(error.message) };
        }
      }

      this.loading--;
    },

    async authAs(user) {
      this.token = user.token;
      this.tokenExpires = user.expires;
      this.tokenAt = new Date();
      await this.onAfterAuth(this.token);
    },

    async submit() {
      this.error = null;
      const { valid: isValid } = await this.$refs.form.validate();
      if (!isValid) return;

      this.loading++;

      try {
        const { token, expires } = await authUser({
          username: this.form.username,
          password: this.form.password
        });

        this.token = token;
        this.tokenExpires = expires;
        this.tokenAt = new Date();

        await this.onAfterAuth(this.token);
      } catch (error) {
        if (get(error, "code") === "AUTH/MAX_ATTEMPT") {
          this.error = {
            message: this.$t(get(error, "code") || "AUTH/UNKNOWN_ERROR", {
              seconds: get(error, "seconds") || 60
            })
          };
        } else {
          this.error = {
            message: this.$t(get(error, "code") || "AUTH/UNKNOWN_ERROR")
          };
        }
      }

      this.loading--;
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
    redirectToOrigin() {
      sessionStorage.removeItem("AuthWithRedirect");
      const _prevRoute = get(this.prevRoute, "name", null);
      const redirectTo = this.$route.query.redirectTo;
      if (!isUndefined(redirectTo)) {
        if (isExternalDomain(redirectTo))
          window.location = BuildUrl(env.VUE_APP_OUEDKNISS_PORTAL, {
            path: "connection.html",
            queryParams: { redirectTo }
          });
        else window.location = redirectTo;
        return;
      } else if (
        !isEmpty(this.$route.query) &&
        this.prevRoute.meta.middleware !== "builder-page"
      ) {
        let {
          route_name,
          //  eslint-disable-next-line no-unused-vars
          loginAnonymous,
          //  eslint-disable-next-line no-unused-vars
          EnablingAnonymous,
          ...query
        } = this.$route.query;
        route_name = this.$route.query.chunkId ? "checkout_info" : route_name;
        if (!route_name) this.redirectToPanel();
        return this.$router
          .push({
            name: route_name,
            query
          })
          .catch(CatchNavigationDuplicated);
      } else if (_prevRoute && _prevRoute !== "home")
        return this.$router
          .push(this.prevRoute)
          .catch(CatchNavigationDuplicated);
      this.redirectToPanel();
    }
  }
};

const CatchNavigationDuplicated = error => {
  if (
    error.name !== "NavigationDuplicated" &&
    !error.message.includes("Avoided redundant navigation to current location")
  ) {
    if (env.isDev) console.error(error);
  }
};
</script>

<style lang="scss">
.ok-auth-box {
  max-width: 450px;
}

.progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
