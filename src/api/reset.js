import request from "@/utils/request";
import get from "lodash/get";
import env from "@/utils/env.js";

export async function resetRequest({ form, recaptchaToken }) {
  const url = new URL(env.VUE_APP_GRAPHQL_HTTP);
  url.pathname = "/reset/email";

  const result = await request
    .post(url, {
      body: form,
      headers: {
        "recaptcha-Token": recaptchaToken
      }
    })
    .then(response => response.json());

  if (!result.success) {
    const code = get(result, "errors[0].code") || result.code;
    throw new Error(code || "RESET/UNKNOWN_ERROR");
  } else return result;
}

export async function resetConfirm({ form, token, id, recaptchaToken }) {
  const url = new URL(env.VUE_APP_GRAPHQL_HTTP);
  url.pathname = `/reset/password`;

  const result = await request
    .post(url, {
      body: {
        password: form.password,
        password_confirmation: form.password_confirmation,
        token,
        id
      },
      headers: {
        "recaptcha-Token": recaptchaToken
      }
    })
    .then(response => response.json());

  if (result.status !== true)
    throw new Error(get(result, "errors[0].code") || "RESET/UNKNOWN_ERROR");
}
