import gql from "graphql-tag";
import get from "lodash/get";
import env from "@/utils/env";
export default () => ({
  namespaced: true,

  state: {
    announcement: null,
    categories: [],
    full_categories: [],
    queryLoader: false,
    prevRoute: null,
    pluginsStatus: "INITIAL",
    popStateChanged: false,
    blockPrevious: false,
    countHistoryQueue: 0
  },

  mutations: {
    setAnnouncement(state, announcement) {
      state.announcement = announcement;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setFullCategories(state, full_categories) {
      state.full_categories = full_categories;
    },
    setPrevRoute(state, prevRoute) {
      state.prevRoute = prevRoute;
    },
    setPluginsStatus(state, pluginsStatus) {
      state.pluginsStatus = pluginsStatus;
    },
    setPopStateChanged(state) {
      state.popStateChanged = true;
      setTimeout(() => {
        state.popStateChanged = false;
      }, 100);
    },
    setCountHistoryQueue(state, countHistoryQueue) {
      state.countHistoryQueue = countHistoryQueue;
    },
    async setblockPrevious(state, blockPrevious) {
      state.blockPrevious = blockPrevious;
      if (blockPrevious) {
        if (state.countHistoryQueue === 0) {
          await history.pushState(null, null, location.href);
          state.countHistoryQueue += 1;
        }
      } else {
        if (state.countHistoryQueue > 0) await history.back();
      }
    }
  },
  actions: {
    async fetchCategories({ state }, apolloClient) {
      try {
        state.queryLoader = true;
        const { data } = await apolloClient.query({
          query: gql`
            query listingMenu($menuFilter: MenuFilterInput) {
              listingMenu: menuFetch(menuFilter: $menuFilter) {
                id
                name
                icon {
                  light
                  dark
                }
                target {
                  ... on Category {
                    id
                    name
                    slug
                    icon
                    active
                    rank
                    delivery
                  }
                }
                rank
              }
            }
          `,
          variables: {
            menuFilter: {
              menuType: "LISTING_MENU"
            }
          }
        });

        const full_categories=get(data, "listingMenu", []);
        state.full_categories = full_categories;
        state.categories = full_categories.filter(c=>get(c,"target.__typename",null)==='Category')
        state.queryLoader = false;
      } catch (error) {
        if (env.isDev) console.error(error);
        state.queryLoader = false;
      }
    },
    setupPopState({ commit }) {
      window.addEventListener("popstate", async () => {
        commit("setPopStateChanged");
        commit("setCountHistoryQueue", 0);
      });
    }
  }
});
