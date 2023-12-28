import { isExternalDomain } from "@/utils/location";
import {
  injectCbRouteWatcher,
  clearCbRouteWatcher
} from "@/composables/hooks/useRouteWatcher";
export default {
  computed: {
    isPortal() {
      return !(
        isExternalDomain() ||
        (this.$route &&
          this.$route.meta &&
          this.$route.meta.middleware === "auth-page") ||
        this.$route.fullPath.startsWith("/store/") ||
        this.$route.fullPath.startsWith("/landing/")
      );
    }
  },
  methods: {
    injectCbRouteWatcher(cb) {
      injectCbRouteWatcher(cb);
    },
    clearCbRouteWatcher() {
      clearCbRouteWatcher();
    },

    canIroute(routeName) {
      return this.$router.hasRoute({ name: routeName });
    },
    resolveRoute(options) {
      return this.$router.resolve(options);
    }
  }
};
