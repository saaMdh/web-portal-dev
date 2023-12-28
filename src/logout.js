/* eslint-disable */
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import request from "@/utils/request";
import env from "@/utils/env.js";

const { clearSession, token } = useAuthFrame();

async function logout() {
  const loggedToken = token.value;
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
    // Noop
  }
  clearSession();

  const u = new URL(location.href);
  const outside_url = new URL(u.searchParams.get("redirectTo"));

  if (u.searchParams.has("redirectTo")) {
    outside_url.searchParams.set("logout", true);
    window.location = outside_url.href;
  } else {
    window.location = env.VUE_APP_OUEDKNISS_PORTAL;
  }
}

logout();
