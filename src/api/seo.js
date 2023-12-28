import request from "@/utils/request";
import env from "@/utils/env.js";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

/**
 * @property {String} slug
 * @property {Object} query
 */

export async function getMeta(slug = null, query = null) {
  const url = new URL(env.VUE_APP_GRAPHQL_HTTP);
  const { locale } = useAuthFrame();
  let queryParams = `?lang=${locale.value}`;

  if (slug) queryParams += `&slug=${slug}`;
  if (query) queryParams += `&query=${query}`;

  const uri = url.origin + "/seo/metadata" + queryParams;

  try {
    const result = await request.get(uri).then(response => response.json());
    return result;
  } catch (error) {
    if (env.isDev) console.error(error);
    return null;
  }
}
