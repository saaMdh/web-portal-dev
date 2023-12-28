import {
  ApolloClient,
  InMemoryCache,
  createHttpLink
} from "@apollo/client/core";
import { createApolloProvider } from "@vue/apollo-option";
import { getTrackingHeaders } from "@ouedkniss/web-ui-plugin/src/utils/Tracking";
import { getVersioningHeaders } from "@ouedkniss/web-ui-plugin/src/utils/Versioning";
import { refreshToken } from "@ouedkniss/web-ui-plugin/src/utils/RefreshTokenUtils";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { fromPromise } from "@apollo/client/link/utils";
import {
  getErrorCode,
  getErrorMessage
} from "@ouedkniss/web-ui-plugin/src/utils/Exceptions";

import env from "@/utils/env";
const cache = new InMemoryCache();

export default function (errorCb = null) {
  const {
    locale,
    token,
    tokenExpires,
    isRefreshing,
    user,
    updateToken,
    setIsRefreshing,
    checkIsRefreshingMaxTime
  } = useAuthFrame();

  let pendingRequests = [];

  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        "X-Referer": window.location.href,
        Authorization: token.value ? `Bearer ${token.value}` : ""
      }
    };
  });

  const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      let error = null;
      if (graphQLErrors) {
        for (const { message } of graphQLErrors) {
          if (message === "AUTH/JSON_WEB_TOKEN_ERROR" && token.value != "") {
            // is refreshing value has long time as true
            checkIsRefreshingMaxTime();

            let forward$;
            if (!isRefreshing.value) {
              setIsRefreshing(true);
              forward$ = fromPromise(
                refreshToken(token.value)
                  .then(({ token, expires }) => {
                    //
                    updateToken(token, expires);
                    return token;
                  })
                  .catch(() => {
                    pendingRequests = [];
                    token.value = null;
                    tokenExpires.value = null;
                    user.value = null;
                    return;
                  })
                  .finally(() => {
                    setIsRefreshing(false);
                  })
              ).filter(value => Boolean(value));
            } else {
              forward$ = fromPromise(
                new Promise(resolve => {
                  pendingRequests.push(token => resolve(token));
                })
              );
            }

            return forward$.flatMap(newToken => {
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  Authorization: `Bearer ${newToken}`
                }
              });
              return forward(operation);
            });
          }
        }
        let code = getErrorCode(graphQLErrors[0], true);
        error = getErrorMessage(code);
        graphQLErrors.exceptionMessage = error;
        if (errorCb && typeof errorCb === "function") {
          let data = {
            error: { ...error, code }
          };
          if (graphQLErrors.length > 1) {
            data.extraErrors = [];

            graphQLErrors.forEach((gError, index) => {
              if (index !== 0) {
                data.extraErrors.push(
                  getErrorMessage(getErrorCode(gError, true))
                );
              }
            });
          }
          errorCb(data);
        }
      }
      if (networkError) {
        console.error(`[Network error]: ${networkError}`);
        let code = getErrorCode(networkError.result);
        networkError.exceptionMessage = getErrorMessage(code);
      }
    }
  );

  let httpLink = createHttpLink({
    uri: env.VUE_APP_GRAPHQL_HTTP,
    headers: {
      Locale: locale.value,
      "Accept-Language": locale.value || "fr",
      "X-Referer": window.location.href || "",
      ...getVersioningHeaders(),
      ...getTrackingHeaders()
    }
  });

  const apolloClient = new ApolloClient({
    cache,
    link: authLink.concat(errorLink.concat(httpLink))
  });

  const apolloProvider = createApolloProvider({
    defaultClient: apolloClient
  });
  return apolloProvider;
}
