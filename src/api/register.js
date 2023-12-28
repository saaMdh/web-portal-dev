import request from "@/utils/request";
import get from "lodash/get";
import env from "@/utils/env.js";

export async function registerUser({ form, recaptchaToken }) {
  const url = new URL(env.VUE_APP_GRAPHQL_HTTP);
  url.pathname = "/register";

  const result = await request
    .post(url, {
      body: form,
      headers: {
        "recaptcha-token": recaptchaToken
      }
    })
    .then(response => response.json());

  if (!result.token) {
    throw new Error(get(result, "errors.code") || "REGISTER/UNKNOWN_ERROR");
  }
  return result;
}
