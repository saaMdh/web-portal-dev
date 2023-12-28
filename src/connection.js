/* eslint-disable */
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { checkDomain } from "@/api/check";
import env from "@/utils/env.js";

async function connection() {
  useAuthFrame();
  const useAuth = JSON.parse(localStorage.getItem("ok-auth-frame"));
  const allowd_parms = ["token", "tokenAt", "tokenExpires"];
  const u = new URL(location.href);
  if (u.searchParams.has("redirectTo")) {
    const outside_url = new URL(u.searchParams.get("redirectTo"));

    const checkedDomain = await checkDomain(outside_url);
    if (checkedDomain) {
      if (useAuth)
        allowd_parms.forEach(p => {
          outside_url.searchParams.set(p, useAuth[p]);
        });
      outside_url.searchParams.set("login", true);
      window.location = outside_url.href;
    } else window.location = env.VUE_APP_OUEDKNISS_PORTAL;
  }
}
connection();
