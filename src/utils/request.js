import { getTrackingHeaders } from "@ouedkniss/web-ui-plugin/src/utils/Tracking";
import { getVersioningHeaders } from "@ouedkniss/web-ui-plugin/src/utils/Versioning";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  ...getTrackingHeaders(),
  ...getVersioningHeaders()
};

const service = {
  post: function (url, { body, headers }) {
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        ...DEFAULT_HEADERS,
        ...headers
      }
    });
  },
  get: function (url, options = {}) {
    return fetch(url, {
      method: "GET",
      headers: {
        ...DEFAULT_HEADERS,
        ...(options.headers ? options.headers : {})
      }
    });
  }
};

export default service;
