<template>
  <div
    class="progress d-flex text-center justify-center align-center progress-logout"
  >
    <v-progress-circular
      color="primary"
      size="20"
      width="2"
      indeterminate
    ></v-progress-circular>
    <div class="text-primary text-h6 login-progress-text px-2">
      <span>{{ $t("_.logoutProgress") }}</span>
    </div>
  </div>
</template>

<script>
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import request from "@/utils/request";
import Auth from "./mixins/auth";
import initFirebase from "@/plugins/firebase";
import env from "@/utils/env.js";

export default {
  mixins: [Auth],
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$cart && vm.$cart.disconnect();
      vm.$notifications && vm.$notifications.disconnect();
      if (!parseInt(env.VUE_APP_DISABLE_MESSENGER)) {
        vm.$messenger && vm.$messenger.disconnect();
      }
      next();
    });
  },

  setup() {
    const { clearSession, token } = useAuthFrame();

    return { clearSession, token };
  },
  mounted() {
    this.logout();
  },

  methods: {
    async logout() {
      const loggedToken = this.token;
      await initFirebase();

      try {
        const url = new URL(env.VUE_APP_GRAPHQL_HTTP);
        url.pathname = "/logout";

        await request.post(url, {
          body: { token: loggedToken },
          headers: {
            Authorization: `Bearer ${loggedToken}`
          }
        });
      } catch (error) {
        if (env.isDev) console.error(error);
      }
      this.clearSession();

      const u = new URL(location.href);
      if (u.searchParams.has("redirectTo")) {
        const outside_url = new URL(u.searchParams.get("redirectTo"));
        outside_url.searchParams.set("logout", "true");
        window.location = outside_url.href;
      } else {
        return this.$router.push(this.prevRoute);
      }
    }
  }
};
</script>

<style>
.progress-logout {
  height: 100vh;
  box-sizing: border-box;
}
</style>
