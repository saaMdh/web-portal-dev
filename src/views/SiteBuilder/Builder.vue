<template>
  <div>
    <quick-bar v-if="!editorEnable"></quick-bar>
    <v-theme-provider theme="dark">
      <editor-bar
        v-if="
          isAccessGranted('editor') && $vuetify.display.mdAndUp && editorEnable
        "
      ></editor-bar>
    </v-theme-provider>

    <v-progress-linear
      indeterminate
      :active="editorNotice.fetch.loading > 0"
    ></v-progress-linear>

    <placeholder-not-found
      v-if="editorNotice.fetch.notFound"
    ></placeholder-not-found>
    <placeholder-error
      v-else-if="editorNotice.fetch.hasError"
    ></placeholder-error>

    <notice-publish
      v-if="editorNotice.publish.loading || editorNotice.publish.notify"
    ></notice-publish>

    <div
      ref="builder"
      class="s-builder"
      :style="editorEnable && editorDrawer ? height : null"
      :class="{
        phoneMode: editorPhone
      }"
    >
      <template
        v-if="
          currentPage &&
          !editorNotice.fetch.loading &&
          LandingType === landingType
        "
      >
        <div class="s-builder__site" :style="resizeStyle">
          <v-theme-provider
            :theme="$vuetify.theme.current.dark ? 'dark' : 'light'"
          >
            <div class="s-builder__header">
              <template
                v-for="(block, index) in siteBuild.headers"
                :key="`h-${block.type}-${index}`"
              >
                <builder-block
                  ref="headers"
                  :block="block"
                  :index="index"
                  bucket="headers"
                ></builder-block>
              </template>
            </div>
          </v-theme-provider>

          <div class="s-builder__body">
            <template v-for="(block, index) in currentPage.blocks" :key="index">
              <keep-alive>
                <builder-block
                  :id="`${block.type}-${index}`"
                  ref="pages"
                  :key="`b-${block.type}-${index}`"
                  :block="block"
                  :index="index"
                  :enable-edit="enableEdit"
                  bucket="pages"
                ></builder-block>
              </keep-alive>
            </template>
          </div>

          <div class="s-builder__footer">
            <template
              v-for="(block, index) in siteBuild.footers"
              :key="`f-${block.type}-${index}`"
            >
              <builder-block
                ref="footers"
                :block="block"
                :index="index"
                bucket="footers"
              ></builder-block>
            </template>
          </div>
        </div>
      </template>
      <v-theme-provider theme="dark" with-background>
        <template v-if="isAccessGranted('editor') && $vuetify.display.mdAndUp">
          <editor-sheet v-if="editorEnable"></editor-sheet>

          <edit-btn
            v-if="
              !editorNotice.fetch.loading &&
              !editorNotice.fetch.hasError &&
              !editorNotice.fetch.notFound
            "
            v-model="editorEnable"
          ></edit-btn>
        </template>
        <section-add-dialog
          v-if="$store.state.builder.editor.sectionAddDialog"
        ></section-add-dialog>
        <block-add-dialog
          v-if="$store.state.builder.editor.blockAddDialog"
        ></block-add-dialog>
        <simple-block-add-dialog
          v-if="$store.state.builder.editor.simpleBlockAddDialog.value"
        ></simple-block-add-dialog>
      </v-theme-provider>
    </div>
  </div>
</template>

<script>
import "@/fonts/mdi/css/materialdesignicons-site-builder.css";
import QuickBar from "@/views/SiteBuilder/QuickBar.vue";
import BuilderBlock from "@/views/SiteBuilder/Builder/BuilderBlock.vue";

import BuilderAPI from "@/views/SiteBuilder/BuilderAPI";
import SiteBuiderMetaInfo from "@/mixins/SiteBuiderMetaInfo.js";
// todo: mount only if the user is authorized to edit the store.
import Permission from "@/mixins/Permission";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { LandingType } from "@/utils/LandingSite";
import { sync } from "vuex-pathify";
import { mapGetters, mapMutations } from "vuex";

import find from "lodash/find";

import { defineAsyncComponent } from "vue";

import FontsDefinitions from "@/components/Fonts/FontsDefinition.js";
import env from "@/utils/env.js";
import get from "lodash/get";

import { LandingName } from "@/utils/LandingSite";
export default {
  name: "Builder",
  components: {
    EditorSheet: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet.vue")
    ),
    PlaceholderError: defineAsyncComponent(() =>
      import("@/views/Placeholder/PlaceholderError.vue")
    ),
    PlaceholderNotFound: defineAsyncComponent(() =>
      import("@/views/Placeholder/PlaceholderNotFound.vue")
    ),
    NoticePublish: defineAsyncComponent(() =>
      import("@/views/Notice/NoticePublish.vue")
    ),
    SectionAddDialog: defineAsyncComponent(() =>
      import("@/components/SiteBuilder/Dialog/SectionAddDialog.vue")
    ),
    BlockAddDialog: defineAsyncComponent(() =>
      import("@/components/SiteBuilder/Dialog/BlockAddDialog.vue")
    ),
    SimpleBlockAddDialog: defineAsyncComponent(() =>
      import("@/components/SiteBuilder/Dialog/SimpleBlockAddDialog.vue")
    ),
    EditorBar: defineAsyncComponent(() =>
      import("@/views/SiteBuilder/EditorSheet/EditorBar.vue")
    ),
    EditBtn: defineAsyncComponent(() =>
      import("@/components/SiteBuilder/EditBtn.vue")
    ),
    QuickBar,
    BuilderBlock
  },

  mixins: [Permission, BuilderAPI, SiteBuiderMetaInfo],
  inject: ["updateFontFamily"],

  provide() {
    return {
      getBlockInstanceByIndex: this.getBlockInstanceByIndex,
      isBlockPinnedOnHeader: this.isBlockPinnedOnHeader,
      isBlockPinnedOnFooter: this.isBlockPinnedOnFooter,
      showAuthRequired: () => {
        this.showRequireLoginDialog = true;
      },
      dissmissAuthRequired: () => {
        this.showRequireLoginDialog = false;
      },
      renderMessengerDrawer: () => {
        this.messengerDialog = true;
      }
    };
  },

  setup() {
    const { locale, darkMode, user, token } = useAuthFrame();

    return {
      locale,
      darkMode,
      user,
      token
    };
  },
  data() {
    return {
      showRequireLoginDialog: false,
      messengerDialog: false,
      LandingType: LandingType()
    };
  },

  head() {
    const url = new URL(env.VUE_APP_OUEDKNISS_PORTAL);

    const meta = {
      title:
        location.hostname.replace("www.", "") === url.hostname
          ? this.$t("meta.title")
          : location.hostname,
      titleTemplate: null,
      style: [],
      link:
        this.$route.name === "store-announcement-show"
          ? []
          : [{ rel: "canonical", href: location.href }],
      meta: this.meta
    };
    if (this.siteBuild) {
      let fdef = FontsDefinitions[this.siteBuild.theme.font];
      this.updateFontFamily(fdef.fontFamily);

      if (this.currentPage.backgroundImg) {
        meta.style.push(`.s-builder__site {
                  background-image: url(${this.currentPage.backgroundImg.full});
                  background-repeat: no-repeat;
                  background-size: cover;
                  id-background-img: true;
                }`);
      } else if (this.currentPage.backgroundColor) {
        meta.style.push(
          `.s-builder__site {  background-color: ${this.currentPage.backgroundColor};id-background-color: true;}`
        );
      } else if (this.siteBuild.theme.backgroundImg) {
        meta.style.push(`.s-builder__site {
                  background-image: url(${this.siteBuild.theme.backgroundImg.full});
                  background-repeat: no-repeat;
                  background-size: cover;
                  id-background-img: true;
                }`);
      } else if (this.siteBuild.theme.backgroundColor) {
        meta.style.push(
          `.s-builder__site { background-color: ${this.siteBuild.theme.backgroundColor};id-background-color: true;}`
        );
      }
      if (this.store && this.currentPage) {
        meta.title = get(this.currentPage.title, "fr", this.currentPage.title);
        meta.titleTemplate = `%s | ${this.siteBuild.land[LandingName]}`;
      } else {
        meta.title = `${this.siteBuild.land[LandingName]} | ${this.$t(
          "meta.description"
        )}`;
      }
    }

    return meta;
  },
  computed: {
    ...mapGetters({
      store: "builder/store",
      currentPage: "builder/currentPage",
      market: "builder/market"
    }),
    ...sync({
      currentPageIndex: "builder/currentPageIndex",
      siteBuild: "builder/siteBuild",
      editorEnable: "builder/editor@enable",
      editorNotice: "builder/editor@notice",
      editorPhone: "builder/editor@phone",
      editorDrawer: "builder/editor@drawer"
    }),
    rescale() {
      if (this.editorEnable && this.editorDrawer && !this.$vuetify.display.xl)
        return 1 - 350 / document.body.clientWidth;
      else return 1;
    },
    height() {
      const height = (this.rescale - 1) * this.$el.offsetHeight;
      return {
        height: height ? `calc( ${height}px) !important` : null
      };
    },

    resizeStyle() {
      return {
        transformOrigin: this.$vuetify.locale.rtl ? "0% 0%" : "100% 0%",
        transform: this.rescale ? `scale(${this.rescale})` : null
      };
    },
    enableEdit() {
      if (this.isAccessGranted("editor")) return true;
      const skip = ["search", "single"];
      return !skip.some(h => h === this.currentPage.type);
    }
  },
  watch: {
    currentPage: "unselectBlock",
    editorEnable: "unselectBlock",
    "$vuetify.display": {
      deep: true,
      handler(value) {
        if (!value.mdAndUp) this.editorEnable = false;
      }
    }
  },
  mounted() {
    if (this.token) {
      this.$store.commit("builder/setToken", this.token);
      this.$store.commit("builder/setUser", this.user);
    }
  },

  methods: {
    ...mapMutations({ unselectBlock: "builder/unselectBlock" }),

    getBlockInstanceByIndex(index, bucket = "pages") {
      if (bucket in this.$refs) {
        if (index === -1) index = this.$refs[bucket].length - 1;
        return find(this.$refs[bucket], b => b.index == index);
      }

      return null;
    },

    isBlockPinnedOnHeader(vm) {
      return find(this.$refs.headers, b => b === vm) !== undefined;
    },

    isBlockPinnedOnFooter(vm) {
      return find(this.$refs.footers, b => b === vm) !== undefined;
    }
  }
};
</script>

<style lang="scss">
.phoneMode {
  width: 400px;
  margin: auto;
}
.s-builder {
  &__site {
    transition: transform 200ms ease-in-out;
  }

  &__body {
    min-height: 75vh;
    overflow: hidden;
  }
}
</style>
