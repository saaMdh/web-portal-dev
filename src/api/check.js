import request from "@/utils/request";
import env from "@/utils/env.js";

export async function checkDomain(url) {
  return new Promise(res => {
    if (url.hostname === location.hostname) {
      res(false);
      return;
    }

    const domain = url.hostname && url.hostname.replace("www.", "");
    request
      .post(env.VUE_APP_GRAPHQL_HTTP, {
        body: {
          query: `
                query FetchByDomain($domain: String!) {
                    siteBuild: siteBuildGetByDomain(domain: $domain) {
                        id
                    }
                }
                `,
          variables: {
            domain
          }
        }
      })
      .then(res => res.json())
      .then(({ data }) => {
        if (data) {
          res(true);
          return;
        }
        res(false);
      });
  });
}
