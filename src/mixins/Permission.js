import get from "lodash/get";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { LandingType } from "@/utils/LandingSite";
const PLANS = {
  BASIC: {
    editor: true,
    home: true,
    theme: true,
    pages: false,
    design: false,
    blocks: false,
    props: true,
    publish: true,
    history: true,
    import: false,
    export: false,
    comment: true,
    queries: false,
    "inline-editing": true
  },

  FULL: {
    editor: true,
    home: true,
    theme: true,
    pages: true,
    design: true,
    blocks: true,
    props: true,
    publish: true,
    history: true,
    import: false,
    export: false,
    comment: true,
    queries: true,
    "inline-editing": true
  }
};
const TYPES = {
  STORE: {
    queries: true
  },
  MARKET: {
    queries: true
  }
};

export default {
  methods: {
    isAccessGranted(access) {
      const { user } = useAuthFrame();
      const { plan } = this.$store.state.builder;
      const requiredPermissions = "can_edit_sitebuild";
      if (
        get(user, ["value", "rolesPlain"], []).includes("SUPER_ADMIN") ||
        get(user, ["value", "permissions"], []).filter(
          value => value.name && requiredPermissions.includes(value.name)
        ).length !== 0
      )
        return true;
      if (!plan) return false;
      return get(PLANS, [plan, access], false);
    },
    isAllowed(access) {
      return get(TYPES, [LandingType().toUpperCase(), access], false);
    },
    isRoleGranted(role) {
      const roles =
        (this.$store.state.session.user &&
          this.$store.state.session.user.rolesPlain) ||
        [];
      return roles.includes("SUPER_ADMIN") || roles.includes(role);
    }
  }
};
