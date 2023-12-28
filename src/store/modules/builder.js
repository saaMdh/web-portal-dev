import BlockDefinition from "@/components/SiteBuilder/Blocks/BlockDefinition";
import BlockDefinitionGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockDefinitionGrid";

import Queries from "@/views/SiteBuilder/Queries.graphql";

import { generateBuild, generatePage, omitTypename } from "@/utils/site-build";
import { intervertArray } from "@/utils/array";

import pathify, { make } from "vuex-pathify";
import slugify from "slugify";

import defaultsDeep from "lodash/defaultsDeep";
import cloneDeep from "lodash/cloneDeep";
import isNull from "lodash/isNull";
import filter from "lodash/filter";
import merge from "lodash/merge";
import find from "lodash/find";
import pick from "lodash/pick";
import set from "lodash/set";
import get from "lodash/get";
// import { isGranted } from "@/mixins/Permission";

const getDefaultBuilderState = () => {
  return {
    referrer: null,
    token: null,
    user: null,
    plan: null,
    siteBuild: null,
    backup: null,
    currentPageIndex: 0,
    baseUrl: null,
    landingType: null,
    editor: {
      selected: null,
      selectedGridBlock: null,
      dirty: false,
      mode: "preview",
      phone: false,
      right: false,
      enable: false,
      tab: "home",
      drawer: false,
      sectionAddDialog: false,
      blockAddDialog: false,
      simpleBlockAddDialog: { value: false, indexBlock: null },
      inlineLock: null,
      notice: {
        fetch: {
          hasError: false,
          notFound: false,
          loading: 0
        },
        publish: {
          loading: 0,
          notify: false
        },
        update: {
          loading: 0
        }
      }
    }
  };
};
const builderState = getDefaultBuilderState();
const builderGetters = {
  land(state) {
    return get(state, "siteBuild.land", null);
  },

  store(state) {
    return state.landingType === "store"
      ? get(state, "siteBuild.land", null)
      : null;
  },

  market(state) {
    return state.landingType === "market"
      ? get(state, "siteBuild.land", null)
      : null;
  },

  queries(state) {
    return get(state, "siteBuild.queries", null);
  },

  pages(state) {
    if (!state.siteBuild || !state.siteBuild.pages.length) return null;

    return state.siteBuild.pages;
  },

  currentPage(state) {
    if (!state.siteBuild || !state.siteBuild.pages.length) return null;

    return state.siteBuild.pages[state.currentPageIndex];
  },

  currentBlocks(state) {
    const current = state.siteBuild.pages[state.currentPageIndex];
    return current.blocks;
  },

  blocksLength(state) {
    if (state.siteBuild.pages.length == 0) return null;

    const blocks = state.siteBuild.pages[state.currentPageIndex].blocks;

    if (blocks.length > 0) return blocks.length;
    else return null;
  },

  blocksLengthByBucket: state => bucket => {
    if (state.siteBuild.pages.length == 0) return null;

    const blocks = getBucket(state, bucket);

    if (blocks && blocks.length > 0) return blocks.length;
    else return null;
  },

  blocksLengthBySelectedBucket(state) {
    if (state.siteBuild.pages.length == 0) return null;

    const bucket = state.editor.selected.bucket;
    const blocks = getBucket(state, bucket);

    if (blocks && blocks.length > 0) return blocks.length;
    else return null;
  },

  lastBlockIndex(state) {
    return builderGetters.blocksLength(state) - 1;
  },

  selectedDefinition(state, getters) {
    if (!getters.selectedState) return null;
    return BlockDefinition()[getters.selectedState.type];
  },
  selectedGridBlockDefinition(state, getters) {
    if (!getters.selectedGridBlockState) return null;
    return BlockDefinitionGrid[getters.selectedGridBlockState.type];
  },

  selectedState(state) {
    if (!state.editor.selected) return null;

    return getBlock(
      state,
      state.editor.selected.bucket,
      state.editor.selected.index
    );
  },

  selectedGridBlockState(state) {
    if (!state.editor.selectedGridBlock) return null;

    return getGridBlock(
      state,
      state.editor.selectedGridBlock.bucket,
      state.editor.selectedGridBlock.layoutIndex,
      state.editor.selectedGridBlock.index
    );
  },

  phoneMode() {
    //return state.editor.phone;
    return false;
  },

  menuPages(state) {
    const skip = ["search", "single"];
    return filter(
      filter(state.siteBuild.pages, p => !skip.includes(p.type)),
      p => isNull(p.visible) || p.visible
    );
  },

  homePage(state) {
    return state.siteBuild.pages.find(item => item.type === "home");
  }
};

export default () => ({
  namespaced: true,
  plugins: [pathify.plugin],
  state: builderState,
  getters: builderGetters,
  actions: {
    async uploadSiteBuild({ state, commit }, payload) {
      const build = pick(state.siteBuild, ["theme"]);
      build.queries = omitTypename(cloneDeep(state.siteBuild.queries));
      build.headers = cloneDeep(state.siteBuild.headers);
      build.footers = cloneDeep(state.siteBuild.footers);
      build.pages = cloneDeep(state.siteBuild.pages);
      const { data } = await payload.apolloClient.mutate({
        mutation: Queries.Update,
        variables: {
          id: state.siteBuild.land.id,
          LaunchType: state.landingType.toUpperCase(),
          build
        }
      });

      commit("setSiteBuildId", data.siteBuild.id);
    },

    async publishSiteBuild({ state }, payload) {
      await payload.apolloClient.mutate({
        mutation: Queries.Publish,
        variables: {
          id: state.siteBuild.land.id,
          siteBuildId: state.siteBuild.id,
          LaunchType: state.landingType.toUpperCase()
        }
      });
    }
  },
  mutations: {
    ...make.mutations(builderState),
    setDefaultState(state) {
      Object.assign(state, getDefaultBuilderState());
    },
    setPlan(state, value) {
      state.plan = value;
    },
    setBackup(state, value) {
      state.backup = value;
    },
    setCurrentPageIndex(state, value) {
      state.currentPageIndex = value;
    },
    setBaseUrl(state, value) {
      state.baseUrl = value;
    },
    setLandingType(state, value) {
      state.landingType = value;
    },
    setEditor(state, value) {
      state.editor = value;
    },

    setSiteBuild(state, build) {
      defaultsDeep(build, generateBuild());
      state.siteBuild = build;
    },

    setSiteBuildId(state, id) {
      state.siteBuild.id = id;
    },

    setUser(state, user) {
      state.user = user;
    },

    setToken(state, token) {
      state.token = token;
    },
    setReferrer(state, referrer) {
      state.referrer = referrer;
    },

    updatePermission(state) {
      if (!state.user || !state.landingType === "store") return;

      const manager = find(
        state.siteBuild.land.users,
        m => m.user.id === state.user.id
      );

      if (manager !== undefined) {
        const planParam = find(state.siteBuild.land.service.params, p =>
          p.code.includes("site-builder")
        );

        const plan = get(planParam, "code", null);

        switch (plan) {
          case "site-builder-basic":
            state.plan = "BASIC";
            break;
          case "site-builder-full":
            state.plan = "FULL";
            break;
          default:
            state.plan = null;
        }
      }
    },

    changeEditorTab(state, tab) {
      // todo: fix isAccessGranted
      // const isAccessGranted = isGranted(state.user, state.plan, tab);
      const isAccessGranted = true;
      if (state.editor.tab !== tab) {
        if (isAccessGranted) {
          state.editor.tab = tab;
          state.editor.drawer = true;
          state.editor.inlineLock = null;
        } else state.editor.tab = "home";
      } else {
        state.editor.drawer = false;
        state.editor.inlineLock = null;
        state.editor.tab = null;
      }
    },
    hideEditor(state) {
      state.editor.drawer = false;
      state.editor.selected = null;
      state.editor.selectedGridBlock = null;
      state.editor.tab = null;
    },

    setInlineLock(state, lock) {
      state.editor.inlineLock = lock;
    },

    /**
     * Editor
     */

    toggleSelectMode(state) {
      if (state.editor.mode === "select") state.editor.mode = "preview";
      else state.editor.mode = "select";
    },
    togglePhoneMode(state) {
      //state.editor.phone = !state.editor.phone;
      state.editor.phone = false;
    },

    toggleSectionAddDialog(state) {
      state.editor.sectionAddDialog = !state.editor.sectionAddDialog;
    },

    /**
     * Pages
     */

    newPage(state, { title, type }) {
      const p = generatePage(title, type);
      state.siteBuild.pages.push(p);
    },
    updatePage(state, { index, attrs }) {
      state.siteBuild.pages[index].title = attrs.title;
      state.siteBuild.pages[index].slug = slugify(get(attrs.title, "fr"), {
        lower: true
      });
    },
    shiftPage(state, { index, toIndex }) {
      intervertArray(state.siteBuild.pages, index, toIndex);
    },
    removePage(state, index) {
      state.siteBuild.pages.splice(index, 1);
    },
    getPage(state, index) {
      return state.siteBuild.pages[index];
    },

    /**
     *  Blocks
     */

    updateBlockAttr(state, { index, key, value, bucket }) {
      const block = getBlock(state, bucket, index);

      const config = {
        ...block.attrs
      };

      set(config, key, value);

      block.attrs = config;
    },
    updateGridBlockAttr(state, { layoutIndex, index, key, value, bucket }) {
      const block = getGridBlock(state, bucket, layoutIndex, index);

      const config = {
        ...block.attrs
      };

      set(config, key, value);

      block.attrs = config;
    },
    updateBlock(state, { index, bucket, config }) {
      const block = getBlock(state, bucket, index);

      block.attrs = config;
    },
    updateGridBlock(state, { layoutIndex, index, bucket, config }) {
      const block = getGridBlock(state, bucket, layoutIndex, index);

      block.attrs = config;
    },
    changeBlockLayout(state, { index, layout, bucket }) {
      const block = getBlock(state, bucket, index);
      const override = BlockDefinition()[block.type].layouts[layout].attrs;

      block.layout = layout;
      block.attrs = merge(block.attrs, override);
    },
    selectBlock(state, vm) {
      state.editor.selected = vm;
      state.editor.selectedGridBlock = null;
      state.editor.tab = "props";
      state.editor.mode = "preview";
      state.editor.drawer = true;
    },
    selectGridBlock(state, vm) {
      state.editor.selectedGridBlock = vm;

      state.editor.mode = "preview";
      state.editor.show = true;
    },
    unselectBlock(state) {
      state.editor.selected = null;
      state.editor.selectedGridBlock = null;
      state.editor.mode = "preview";
      //state.editor.tab = null;
      //state.editor.drawer = true;
      if (
        state.editor.drawer &&
        (state.editor.tab === "props" || state.editor.tab === "props-grid")
      ) {
        state.editor.tab = null;
        state.editor.drawer = false;
      }
    },
    addBlock(state, { block, index }) {
      const blocks = builderGetters.currentPage(state).blocks;

      if (index === undefined || index == -1) blocks.push(block);
      else blocks.splice(index, 0, block);
    },
    cloneBlockByIndex(state, { index, bucket }) {
      const bucketHandle = getBucket(state, bucket);
      const cloned = cloneDeep(bucketHandle[index]);
      bucketHandle.splice(index, 0, cloned);
    },
    moveBlockByIndex(state, { index, bucket, indexBucket }) {
      const prevbucketHandle = getBucket(state, bucket);
      const nextbucketHandle = getBucketByIndex(state, bucket, indexBucket);
      const cloned = cloneDeep(prevbucketHandle[index]);
      nextbucketHandle.splice(index, 0, cloned);
    },
    removeBlockByIndex(state, { index, bucket }) {
      getBucket(state, bucket).splice(index, 1);
      state.editor.drawer = false;
    },
    shiftBlockByIndex(state, { index, toIndex, bucket }) {
      intervertArray(getBucket(state, bucket), index, toIndex);
    },
    pinBlockOnHeaders(state, { index, bucket }) {
      const blocks = getBucket(state, bucket);
      state.siteBuild.headers.push(blocks[index]);
      blocks.splice(index, 1);
    },
    pinBlockOnFooters(state, { index, bucket }) {
      const blocks = getBucket(state, bucket);
      state.siteBuild.footers.push(blocks[index]);
      blocks.splice(index, 1);
    },
    unpinBlockFromHeaders(state, index) {
      builderGetters
        .currentPage(state)
        .blocks.unshift(state.siteBuild.headers[index]);
      state.siteBuild.headers.splice(index, 1);
    },
    unpinBlockFromFooters(state, index) {
      builderGetters
        .currentPage(state)
        .blocks.push(state.siteBuild.footers[index]);
      state.siteBuild.footers.splice(index, 1);
    },

    /**
     *  queries
     */

    updateQueries(state, queries) {
      state.siteBuild.queries = queries;
    },
    addQuery(state, { query, type = "ANNOUNCEMENTS" }) {
      query["type"] = type;
      state.siteBuild.queries.unshift(cloneDeep(query));
    },
    editQuery(state, { query, index, type = "ANNOUNCEMENTS" }) {
      query["type"] = type;
      state.siteBuild.queries.splice(index, 1, cloneDeep(query));
    },
    removeQuery(state, index) {
      state.siteBuild.queries.splice(index, 1);
    },
    removeQueries(state, indexes) {
      state.siteBuild.queries = filter(
        state.siteBuild.queries,
        (el, index) => !indexes.includes(index)
      );
    }
  }
});

function getBlock(state, bucket, index) {
  const current = state.siteBuild.pages[state.currentPageIndex];

  if (bucket == "headers") return state.siteBuild.headers[index];
  else if (bucket == "footers") return state.siteBuild.footers[index];
  else if (bucket == "pages") return current.blocks[index];
  return null;
}

function getGridBlock(state, bucket, layoutIndex, index) {
  const current = state.siteBuild.pages[state.currentPageIndex];

  if (bucket == "headers")
    return state.siteBuild.headers[layoutIndex].attrs.blocks[index];
  else if (bucket == "footers")
    return state.siteBuild.footers[layoutIndex].attrs.blocks[index];
  else if (bucket == "pages")
    return current.blocks[layoutIndex].attrs.blocks[index];
  return null;
}

function getBucket(state, bucket) {
  const current = state.siteBuild.pages[state.currentPageIndex];

  if (bucket == "headers") return state.siteBuild.headers;
  else if (bucket == "footers") return state.siteBuild.footers;
  else if (bucket == "pages") return current.blocks;
  return null;
}

function getBucketByIndex(state, bucket, index) {
  const current = state.siteBuild.pages[index];

  if (bucket == "headers") return state.siteBuild.headers;
  else if (bucket == "footers") return state.siteBuild.footers;
  else if (bucket == "pages") return current.blocks;
  return null;
}
