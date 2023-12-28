import env from "@/utils/env.js";
export function cleanLocation(vm) {
  const deletedValues = ["token", "tokenAt", "tokenExpires", "login", "logout"];

  let query = Object.assign({}, vm.$route.query);
  deletedValues.forEach(v => {
    delete query[v];
  });
  vm.$router.replace({ query }).catch(() => {});
}

function getHostnames() {
  const url_store = new URL(
    env.VUE_APP_OUEDKNISS_STORE || "https://ouedkniss.com/store"
  );
  const url_market = new URL(
    env.VUE_APP_OUEDKNISS_MARKET || "https://ouedkniss.com/landing"
  );
  return [url_store.hostname, url_market.hostname];
}

export function baseUrl() {
  const hostnames = getHostnames();
  if (!hostnames.some(h => h === location.hostname)) return "/";
  return location.pathname
    .split("/")
    .slice(0, 2)
    .join("/");
}

export function isExternalDomain(optional_link = null) {
  const url = optional_link
    ? new URL(optional_link)
    : new URL(env.VUE_APP_OUEDKNISS_STORE);
  return !(
    url.hostname.includes(location.hostname) ||
    location.hostname.includes(url.hostname)
  );
}

export function isStorePath(route) {
  return route && (route.fullPath.startsWith("/store") || isExternalDomain());
}

export function isLandingPath(route) {
  return route && route.fullPath.startsWith("/landing");
}
