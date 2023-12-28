/* eslint-disable no-unused-vars */

import { createRouter, createWebHistory } from "vue-router";

import BuildUrl from "build-url";
import { usePrevPage } from "./composables/prev-page";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { isExternalDomain, isLandingPath, isStorePath } from "@/utils/location";
import env from "@/utils/env.js";
import { checkIfNotSameStoreBuild } from "./utils/site-build";

export const DefaultStoreRoute = [
  {
    path: "/store/:storeId(\\d+)/:storeSlug([^/]+)/",
    name: "store",
    props: true,
    meta: {
      middleware: "builder-page",
      keepScrollIfSameRoute: true
    },
    component: () =>
      import(
        /* webpackChunkName: "builder" */ "./views/SiteBuilder/Builder.vue"
      ),
    children: [
      {
        path: "annonce/:id?/",
        name: "store-annonce",
        meta: {
          middleware: "builder-page"
        },
        component: () =>
          import(
            /* webpackChunkName: "builder" */ "./views/SiteBuilder/Builder.vue"
          )
      },
      {
        path: ":page",
        name: "store-page",
        meta: {
          middleware: "builder-page"
        },
        component: () =>
          import(
            /* webpackChunkName: "builder" */ "./views/SiteBuilder/Builder.vue"
          )
      }
    ]
  },
  {
    path: "/store/:storeId(\\d+)/",
    name: "store-forward",
    redirect: to => ({
      name: "store",
      params: { storeId: to.params.storeId, storeSlug: "store-page" }
    })
  },
  {
    path: "/landing/:landId(\\d+)/:landSlug([^/]+)/",
    name: "land",
    props: true,
    meta: {
      middleware: "builder-page",
      keepScrollIfSameRoute: true
    },
    component: () =>
      import(
        /* webpackChunkName: "builder" */ "./views/SiteBuilder/Builder.vue"
      ),
    children: [
      {
        path: "annonce/:id?/",
        name: "land-annonce",
        meta: {
          middleware: "builder-page",
          keepScrollIfSameRoute: true
        },
        component: () =>
          import(
            /* webpackChunkName: "builder" */ "./views/SiteBuilder/Builder.vue"
          )
      },
      {
        path: ":page",
        name: "land-page",
        meta: {
          middleware: "builder-page",
          keepScrollIfSameRoute: true
        },
        component: () =>
          import(
            /* webpackChunkName: "builder" */ "./views/SiteBuilder/Builder.vue"
          )
      }
    ]
  },
  {
    path: "/landing/:landId(\\d+)/",
    name: "land-forward",
    redirect: to => ({
      name: "land",
      params: { landId: to.params.landId, landSlug: "land-page" }
    })
  }
];
export const DefaultStoreRouteExternalDomain = [
  {
    path: "/",
    name: "home",
    props: true,
    meta: {
      middleware: "builder-page"
    },
    component: () =>
      import(
        /* webpackChunkName: "builder" */ "./views/SiteBuilder/Builder.vue"
      ),
    children: [
      {
        path: "annonce/:id?/",
        name: "store-annonce",
        meta: {
          middleware: "builder-page"
        }
      },
      {
        path: ":page",
        name: "store-page",
        meta: {
          middleware: "builder-page"
        }
      }
    ]
  }
];

export const DefaultRoutes = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "./views/Home/Home")
  },

  {
    path: "/messages/thread/:threadId",
    component: () => import(/* webpackChunkName: "home" */ "./views/Home/Home")
  },

  {
    path: "/auth/login",
    name: "login",
    alias: ["/login", "/auth"],
    component: () =>
      import(/* webpackChunkName: "login-page" */ "./views/Auth/Login.vue"),
    meta: {
      middleware: "auth-page"
    }
  },
  {
    path: "/login-external",
    name: "login-external",
    meta: {
      middleware: "auth-page"
    },
    beforeEnter(to, from, next) {
      if (isExternalDomain())
        window.location = BuildUrl(env.VUE_APP_OUEDKNISS_AUTH, {
          path: "/login",
          queryParams: {
            redirectTo: location.href
          }
        });
      else
        next({
          name: "login"
        });
    }
  },
  {
    path: "/auth/logout",
    name: "logout",
    component: () =>
      import(/* webpackChunkName: "logout-page" */ "./views/Auth/Logout.vue"),
    meta: {
      middleware: "auth-page"
    }
  },
  {
    path: "/auth/register",
    name: "register",
    alias: ["/register"],
    component: () =>
      import(
        /* webpackChunkName: "register-page" */ "./views/Auth/Register.vue"
      ),
    meta: {
      middleware: "auth-page"
    }
  },
  {
    path: "/login-anonymous",
    name: "login-anonymous",
    beforeEnter(to, from, next) {
      next({
        name: "login",
        query: {
          loginAnonymous: true
        }
      });
    }
  },
  {
    path: "/auth/reset_password_request",
    name: "reset_password_request",
    alias: ["/reset_password_request"],
    component: () =>
      import(
        /* webpackChunkName: "ResetRequest" */ "./views/Auth/ResetRequest.vue"
      ),
    meta: {
      middleware: "auth-page"
    }
  },
  {
    path: "/auth/reset_password_confirm",
    name: "reset_password_confirm",
    component: () =>
      import(
        /* webpackChunkName: "ResetConfirm" */ "./views/Auth/ResetConfirm.vue"
      ),
    meta: {
      middleware: "auth-page"
    }
  },

  {
    path: "/publish",
    name: "publish",
    beforeEnter(to) {
      window.location = BuildUrl(
        env.VUE_APP_OUEDKNISS_PANEL,
        to.query
          ? {
              path: "u/announcements/new"
            }
          : {
              path: "u/announcements/new",
              queryParams: to.query
            }
      );
    }
  },
  {
    path: "/pro",
    name: "purchase_store",
    beforeEnter() {
      window.location = BuildUrl(env.VUE_APP_OUEDKNISS_PANEL, {
        path: "u/purchase/store"
      });
    }
  },

  {
    path: "/show-delivery/:id",
    name: "show-delivery",
    beforeEnter(to) {
      window.location = BuildUrl(env.VUE_APP_OUEDKNISS_PANEL, {
        path: `u/orderDisplayStore/${to.params.id}`
      });
    }
  },

  {
    path: "/show-delivery-list",
    name: "show-delivery-list",
    beforeEnter() {
      window.location = BuildUrl(env.VUE_APP_OUEDKNISS_PANEL, {
        path: `/u/ordersListStore`
      });
    }
  },

  {
    path: "/show-promotion",
    name: "show-promotion",
    beforeEnter() {
      window.location = env.VUE_APP_OUEDKNISS_PANEL;
    }
  },

  {
    path: "/order-store",
    name: "order-store",
    beforeEnter() {
      window.location = BuildUrl(env.VUE_APP_OUEDKNISS_PANEL, {
        path: `u/purchase/store`
      });
    }
  },

  {
    path: "/edit-announcement/:id",
    name: "edit-announcement",
    beforeEnter(to) {
      window.location = BuildUrl(env.VUE_APP_OUEDKNISS_PANEL, {
        path: `/u/announcements/edit/${to.params.id}`
      });
    }
  },
  {
    path: "/edit-announcement-admin/:id",
    name: "edit-announcement-admin",
    beforeEnter(to) {
      window.location = BuildUrl(env.VUE_APP_OUEDKNISS_PANEL, {
        path: `/a/announcements/edit/${to.params.id}`
      });
    }
  },

  {
    path: "/panel",
    name: "panel",
    beforeEnter() {
      window.location = env.VUE_APP_OUEDKNISS_PANEL;
    }
  },
  {
    path: "/ads",
    name: "ads",
    beforeEnter() {
      window.location = BuildUrl(env.VUE_APP_OUEDKNISS_CDN, {
        path: "medias/files/Espaces_ouedkniss.pdf"
      });
    }
  },

  {
    path: "/boutiques/:tag?",
    name: "boutiques",
    props: true,
    component: () =>
      import(/* webpackChunkName: "store" */ "./views/Store/Store")
  },

  {
    path: "/boutiques/commander",
    name: "store-order",
    props: true,
    component: () =>
      import(/* webpackChunkName: "store" */ "./views/Info/StoreOrder")
  },

  {
    path: "/membre/:id/:tab?",
    name: "profile",
    component: () =>
      import(/* webpackChunkName: "account" */ "./views/Profile/Profile.vue"),
    props: true
  },

  {
    path: "/checkout",
    component: () =>
      import(
        /* webpackChunkName: "checkout" */ "./views/Checkout/Checkout.vue"
      ),
    props: true,
    children: [
      {
        path: "info",
        name: "checkout_info",
        component: () =>
          import(
            /* webpackChunkName: "checkout" */ "./views/Checkout/CheckoutInfo.vue"
          )
      },
      {
        path: "confirm",
        name: "checkout_confirm",
        component: () =>
          import(
            /* webpackChunkName: "checkout" */ "./views/Checkout/CheckoutConfirm.vue"
          )
      }
    ]
  },

  {
    path: "/travel",
    name: "travel",
    component: () =>
      import(
        /* webpackChunkName: "travel" */ "./views/Travel/TravelLandpage.vue"
      )
  },

  {
    path: "/travel/destination",
    name: "travel_form",
    props: true,
    component: () =>
      import(/* webpackChunkName: "travel" */ "./views/Travel/TravelForm.vue")
  },
  {
    path: "/pricing",
    name: "pricing",
    component: () =>
      import(/* webpackChunkName: "info" */ "./views/Info/Pricing.vue")
  },

  {
    path: "/contact-us",
    name: "contactUs",
    component: () =>
      import(/* webpackChunkName: "info" */ "./views/Info/Contact.vue")
  },

  {
    path: "/legals",
    name: "legals",
    component: () =>
      import(/* webpackChunkName: "info" */ "./views/Info/Legals.vue")
  },

  {
    path: "/cookies",
    name: "cookies",
    component: () =>
      import(/* webpackChunkName: "info" */ "./views/Info/Cookies.vue")
  },

  {
    path: "/privacy",
    name: "privacy",
    component: () =>
      import(/* webpackChunkName: "info" */ "./views/Info/Privacy.vue")
  },
  {
    path: "/merchant/:id",
    name: "merchant",
    component: () =>
      import(/* webpackChunkName: "merchant" */ "./views/Merchant/Merchant.vue")
  },

  {
    path: "/:slug-d:id(\\d+)",
    name: "announcement_show",
    component: () =>
      import(
        /* webpackChunkName: "announcement" */ "./views/Announcement/Show.vue"
      ),
    props: true
  },

  {
    path: "/s/:page?",
    name: "search",
    component: () =>
      import(/* webpackChunkName: "search" */ "./views/Search/Search.vue"),
    props: true,
    redirect: to => {
      return {
        name: "searchP",
        query: to.query,
        params: {
          page: to.params.page ? to.params.page : 1
        }
      };
    },
    meta: {
      keepScrollIfSameRoute: true
    }
  },

  {
    path: "/:keywords-r/:page?",
    name: "search_keywords",
    redirect: to => {
      return {
        name: "searchP",
        query: {
          keywords: to.params.keywords
        },
        params: {
          page: to.params.page ? to.params.page : 1
        }
      };
    },
    props: true,
    meta: {
      keepScrollIfSameRoute: true
    }
  },

  {
    path: "/s/:page",
    name: "searchP",
    component: () =>
      import(/* webpackChunkName: "search" */ "./views/Search/Search.vue"),
    props: true,
    meta: {
      keepScrollIfSameRoute: true
    }
  },

  {
    path: "/:category/:page?",
    name: "search_category",
    component: () =>
      import(/* webpackChunkName: "search" */ "./views/Search/Search.vue"),
    props: true,
    meta: {
      keepScrollIfSameRoute: true
    }
  },

  {
    path: "/profile-settings",
    name: "profile-settings",
    beforeEnter() {
      window.location = BuildUrl(env.VUE_APP_OUEDKNISS_PANEL, {
        path: `/u/profile`
      });
    }
  },

  {
    name: "my",
    path: `/app/my`,
    beforeEnter() {
      window.location = BuildUrl(env.VUE_APP_OUEDKNISS_PANEL);
    }
  }
];

export const _router = ({ store, apollo }) => {
  const router = new createRouter({
    history: createWebHistory(process.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
      if (from.name === to.name && to.meta.keepScrollIfSameRoute) {
        return {};
      }
      if (savedPosition) {
        return savedPosition;
      }
      if (to.hash) {
        return { selector: to.hash };
      }
      return { x: 0, y: 0 };
    },
    routes: [
      ...(isExternalDomain()
        ? DefaultStoreRouteExternalDomain
        : [...DefaultStoreRoute, ...DefaultRoutes])
    ]
  });

  function hasQueryParams(route) {
    return !!Object.keys(route.query).length;
  }

  router.beforeEach(async (to, from, next) => {
    if (
      isExternalDomain() ||
      (to.meta && to.meta.middleware === "builder-page")
    ) {
      if (checkIfNotSameStoreBuild(store, to.fullPath))
        store.commit("builder/setDefaultState");

      if (store.state.builder && isStorePath(from) === isLandingPath(to)) {
        let storeRoutes = isExternalDomain()
          ? DefaultStoreRouteExternalDomain
          : [...DefaultStoreRoute, ...DefaultRoutes];
        if (isStorePath(from) && !isStorePath(to))
          storeRoutes[0].children = [
            {
              path: "annonce/:id?/",
              name: "store-annonce",
              meta: {
                middleware: "builder-page"
              }
            },
            {
              path: ":page",
              name: "store-page",
              meta: {
                middleware: "builder-page"
              }
            }
          ];

        if (isLandingPath(from) && !isLandingPath(to))
          storeRoutes[2].children = [
            {
              path: "annonce/:id?/",
              name: "land-annonce",
              meta: {
                middleware: "builder-page"
              }
            },
            {
              path: ":page",
              name: "land-page",
              meta: {
                middleware: "builder-page"
              }
            }
          ];
      }
      await importBuilderState(store, apollo);
      if (
        from.meta.middleware !== "builder-page" &&
        from.fullPath !== "/" &&
        !from.fullPath.startsWith("/auth")
      ) {
        store.commit("builder/setReferrer", from);
      }
    } else if (
      from.meta &&
      from.meta.middleware === "builder-page" &&
      to.meta &&
      to.meta.middleware !== "builder-page"
    ) {
      let storeRoutes = isExternalDomain()
        ? DefaultStoreRouteExternalDomain
        : [...DefaultStoreRoute, ...DefaultRoutes];
      if (isStorePath(from) && !isStorePath(to))
        storeRoutes[0].children = [
          {
            path: "annonce/:id?/",
            name: "store-annonce",
            meta: {
              middleware: "builder-page"
            }
          },
          {
            path: ":page",
            name: "store-page",
            meta: {
              middleware: "builder-page"
            }
          }
        ];

      if (isLandingPath(from) && !isLandingPath(to))
        storeRoutes[2].children = [
          {
            path: "annonce/:id?/",
            name: "land-annonce",
            meta: {
              middleware: "builder-page"
            }
          },
          {
            path: ":page",
            name: "land-page",
            meta: {
              middleware: "builder-page"
            }
          }
        ];
    }
    const ignoreRoutes = ["ads"];
    if (ignoreRoutes.includes(to.name) === -1)
      store.state.ui.globalLoader = true;

    const { page } = usePrevPage();

    page.value = from;

    const { token } = useAuthFrame();

    if (to.meta && to.meta.middleware === "auth-page") {
      if (from.meta.middleware === "builder-page" && to.name === "logout") {
        from.meta.logout_refresh = true;
      }
      if (token && !!token.value && to.name === "login") {
        if (to.query.chunkId) {
          return next({
            name: "checkout_info",
            query: {
              chunkId: to.query.chunkId
            }
          });
        }

        if (!!to.query.redirectTo && isExternalDomain(to.query.redirectTo)) {
          window.location = BuildUrl(env.VUE_APP_OUEDKNISS_PORTAL, {
            path: "connection.html",
            queryParams: {
              redirectTo: to.query.redirectTo
            }
          });
          return;
        }
      }

      if (token && !!token.value && to.name !== "logout") {
        return next(from);
      }

      if (!hasQueryParams(to) && hasQueryParams(from)) {
        let fromQuery = from.query;
        // Pass current query params to the next route except `logout` queryParam.
        if (fromQuery.logout) delete fromQuery.logout;
        return next({ name: to.name, query: fromQuery });
      }
    }

    next();
  });

  router.beforeResolve((to, from, next) => {
    next();
  });

  router.afterEach((to, from) => {
    // add timeout for prerender
    if (window.navigator.userAgent.includes("HeadlessChrome"))
      window.prerenderReady = false;
    setTimeout(function () {
      if (window.navigator.userAgent.includes("HeadlessChrome")) {
        window.prerenderReady = true;
      }
    }, 2500);

    store.state.ui.globalLoader = false;
    if (from.meta && from.meta.middleware == "auth-page") return;
    else return store.commit("app/setPrevRoute", from);
  });

  return router;
};

const importBuilderState = async (store, apollo) => {
  const builder = (await import("@/store/modules/builder")).default;
  if (!store.state.builder) store.registerModule("builder", builder(apollo));
  else return;
};
