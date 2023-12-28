/**
 * @param {object} options
 * @param {string} options.path
 * @param {object} options.queryParams
 */
import env from "@/utils/env.js";

export function makeRemoteUrl(options) {
  const u = new URL(env.VUE_APP_GRAPHQL_HTTP);
  u.pathname = options.path;

  if (options.queryParams)
    Object.keys(options.queryParams).forEach(key =>
      u.searchParams.append(key, options.queryParams[key])
    );

  return u.href;
}
