import env from "@/utils/env.js";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

export default function (user) {
  const { t } = useI18n();
  const router = useRouter();
  function to(name, params) {
    let options = {
      name
    };
    if (params) options["params"] = params;

    router.push(options);
  }

  function getAnonymousLinks() {
    return [
      {
        title: t("topbar.account.dashboard"),
        icon: "mdi-monitor-dashboard",
        on: () => window.open(env.VUE_APP_OUEDKNISS_PANEL)
      },
      {
        title: t("topbar.account.logout"),
        icon: "mdi-logout",
        on: () => to("logout")
      }
    ];
  }

  function getVisitorLinks() {
    return [
      {
        icon: "mdi-account",
        title: t("topbar.account.login"),
        on: () => to("login")
      },
      {
        icon: "mdi-account-plus",
        title: t("topbar.account.register"),
        on: () => to("register")
      }
    ];
  }

  function getUserLinks() {
    return [
      {
        title: t("topbar.account.dashboard"),
        icon: "mdi-monitor-dashboard",
        on: () => (location = env.VUE_APP_OUEDKNISS_PANEL)
      },
      {
        title: t("topbar.account.profile"),
        icon: "mdi-account",
        on: () => to("profile", { id: user.id })
      },
      {
        title: t("topbar.account.logout"),
        icon: "mdi-logout",
        on: () => to("logout")
      }
    ];
  }

  return {
    getAnonymousLinks: getAnonymousLinks(),
    getVisitorLinks: getVisitorLinks(),
    getUserLinks: getUserLinks()
  };
}
