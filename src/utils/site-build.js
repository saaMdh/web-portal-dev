import BlockRedirection from "@/components/SiteBuilder/Blocks/BlockRedirection";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

import trimStart from "lodash/trimStart";
import isEmpty from "lodash/isEmpty";
import pick from "lodash/pick";
import last from "lodash/last";
import get from "lodash/get";

import slugify from "slugify";

export function generateBuild() {
  return {
    theme: {
      font: "Default",
      dark: false,
      color: "#e95903"
    },

    headers: [],

    pages: [],

    footers: [],

    queries: []
  };
}

export function generatePage(title, type) {
  return {
    title,
    slug: slugify(get(title, "fr"), { lower: true }),
    type,
    blocks: []
  };
}

export function refactorBlock(block) {
  if (block.type in BlockRedirection) {
    return BlockRedirection[block.type](block);
  }

  return block;
}

export function omitTypename(build) {
  const f = (key, value) => (key === "__typename" ? undefined : value);
  return JSON.parse(JSON.stringify(build), f);
}

export function checkIfNotSameStoreBuild(store, fullPath) {
  const baseUrl = get(store, "state.builder.baseUrl", "");
  const stateId = get(baseUrl.match(/\/\d+\//), "[0]", null);
  const currentId = get(fullPath.match(/\/\d+\//), "[0]", Number.MAX_VALUE);

  return !!baseUrl && !(fullPath.includes(baseUrl) || stateId === currentId);
}

export function parseIdFromUrl() {
  // eslint-disable-next-line no-unused-vars
  let [_prefix, id, slug] = trimStart(location.pathname, "/").trim().split("/");

  if (isEmpty(id)) {
    const href = location.href.match(/id=(\d+)?/);
    if (href.length > 0) id = parseInt(href[1].replace(/\D/g, ""), 10);
    else id = null;
  } else {
    id = parseInt(id, 10);
  }

  if (!id) throw new Error("Unable to parse STORE ID");

  return { id, slug };
}
export function parseMarketIdFromUrl() {
  // eslint-disable-next-line no-unused-vars
  let [_prefix, id] = trimStart(location.pathname, "/").trim().split("/");

  id = parseInt(last(id.split("-")));

  if (!id) throw new Error("Unable to parse STORE ID");

  return id;
}
const authReactive = useAuthFrame();
const allowd_parms = ["token", "tokenAt", "tokenExpires"];

export const connectionDomain = () => {
  const location_url = new URL(location.href);
  const url_params = queryParams(location_url);
  const { logout: isLogout, login: isLogin } = pick(url_params, [
    "login",
    "logout"
  ]);
  const auth_queries = pick(url_params, allowd_parms);
  if (isLogin || isLogout) {
    allowd_parms.forEach(p => {
      const query = auth_queries[p] === undefined ? null : auth_queries[p];
      if ((isLogin && query) || (isLogout && !query))
        authReactive[p].value = query;
    });
  }
};

let queryParams = url =>
  url.search
    ? url.search
        .substr(1)
        .split("&")
        .reduce(function (q, query) {
          var chunks = query.split("=");
          var key = chunks[0];
          var value = decodeURIComponent(chunks[1]);
          value = isNaN(Number(value))
            ? value === "null"
              ? null
              : value
            : Number(value);
          return (q[key] = value), q;
        }, {})
    : {};
