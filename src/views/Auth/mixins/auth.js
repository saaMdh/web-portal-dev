import { checkDomain } from "@/api/check";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import env from "@/utils/env";
export default {
  computed: {
    prevRoute() {
      return this.$store.state.app.prevRoute;
    }
  },
  async created() {
    if (window.location.href.includes("/auth/logout")) return;
    const u = new URL(location.href);
    if (u.searchParams.get("redirectTo")) {
      const url = new URL(u.searchParams.get("redirectTo"));
      const isOurDomain = await checkDomain(url);
      if (url.origin !== u.origin && !isOurDomain)
        window.location = env.VUE_APP_OUEDKNISS_AUTH;
    }
  },
  methods: {
    redirectToPortal() {
      const _prevRoute = get(this.prevRoute, "name", null);
      const query = this.$route.query;
      if (!isEmpty(query) && query.route_name && !query.auth) {
        return this.$router.push({
          name: this.$route.query.route_name
        });
      } else if (_prevRoute) return this.$router.push(this.prevRoute);
      return this.$router.push({ name: "home" });
    }
  }
};
