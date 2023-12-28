import request from "@/utils/request";
import get from "lodash/get";
import env from "@/utils/env.js";

import { makeRemoteUrl } from "@/utils/make-url";
import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;

export async function authWithProvider(token) {
  const url = new URL(env.VUE_APP_GRAPHQL_HTTP);
  url.pathname = `/login/social`;

  const result = await request
    .post(url, { body: { token } })
    .then(response => response.json());

  if (result.length === 0)
    throw new Error(get(result, "errors[0].code") || "AUTH/UNKNOWN_ERROR");

  return result;
}

export async function authWithFacebook(token) {
  const url = new URL(env.VUE_APP_GRAPHQL_HTTP);
  url.pathname = `/login/facebook`;

  const result = await request
    .post(url, { body: { token } })
    .then(response => response.json());

  if (result.length === 0)
    throw new Error(get(result, "errors[0].code") || "AUTH/UNKNOWN_ERROR");

  return result;
}

export async function authAnonymous(recaptchaToken) {
  const url = makeRemoteUrl({
    path: "/login-anonymous"
  });

  const result = await request
    .post(url, {
      headers: {
        "recaptcha-Token": recaptchaToken
      }
    })
    .then(response => response.json());

  if (!result.token)
    throw new Error(get(result, "errors[0].code") || "AUTH/UNKNOWN_ERROR");

  return result;
}

export async function authUser({ username, password }) {
  const url = new URL(env.VUE_APP_GRAPHQL_HTTP);
  url.pathname = "/login";

  const result = await request
    .post(url, {
      body: { username, password }
    })
    .then(response => response.json());

  if (!result.token) throw new get(result, "errors");

  return result;
}

export async function sendPushNotificationToken(token = null) {
  const { value } = await Storage.get({ key: "FirebaseToken" });
  if (!value) return;
  try {
    await request.post(env.VUE_APP_GRAPHQL_HTTP, {
      headers: {
        ...(!!token && { Authorization: `Bearer ${token}` })
      },
      body: {
        variables: { token: value },
        query: "mutation ($token: String!) { userTokenAdd(token: $token) }"
      }
    });
  } catch {
    console.log("error register token");
  }
}
