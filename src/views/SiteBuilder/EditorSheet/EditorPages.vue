<template>
  <div class="o-editor-pages">
    <v-toolbar>
      <v-toolbar-title>
        {{ $t("components.editorPages.title") }}
      </v-toolbar-title>
      <v-btn icon @click="hideEditor">
        <v-icon>
          {{ "mdi-close" }}
        </v-icon>
      </v-btn>
    </v-toolbar>

    <v-list>
      <v-list-item @click.stop="newPage">
        <template #prepend>
          <v-icon>mdi-plus-circle</v-icon>
        </template>

        <v-list-item-title>
          {{ $t("components.editorPages.actions.newPage") }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list v-if="siteBuild.pages.length > 0" class="__list">
      <v-list-group v-for="(item, index) in siteBuild.pages" :key="item.slug">
        <template #activator="{ props }">
          <v-list-item v-bind="props">
            <template #prepend>
              <v-avatar
                size="24"
                class="text-white"
                :class="{
                  primary: currentPageIndex === index,
                  grey: currentPageIndex !== index
                }"
              >
                {{ index + 1 }}
              </v-avatar>
            </template>

            <v-list-item-title
              :class="{
                'text-primary font-weight-bold': currentPageIndex === index
              }"
            >
              {{ item.title[$i18n.locale] }}
            </v-list-item-title>
            <template #append>
              <v-icon v-if="item.type == 'home'">mdi-home</v-icon>
              <v-icon v-if="item.type == 'search'">mdi-magnify</v-icon>
              <v-icon v-if="item.type == 'single'">
                mdi-newspaper-variant-outline
              </v-icon>
              <v-icon> mdi-menu-down </v-icon>
            </template>
          </v-list-item>
        </template>

        <v-list-item
          v-for="(a, i) in actions"
          v-bind="a.bind(index, item)"
          :key="i"
          v-on="a.on(index, item)"
        >
          <template #prepend>
            <v-icon>{{ a.icon }}</v-icon>
          </template>
          <v-list-item-title>
            {{ $t(a.title) }}
          </v-list-item-title>
        </v-list-item>
        <v-switch
          v-if="!isSpecialPage(item)"
          v-model="item.visible"
          dense
          class="mx-6 my-0 pa-0 switch"
          :label="$t('components.editorDesign.visible')"
          @update:model-value="setVisible"
        ></v-switch>
        <v-divider></v-divider>
      </v-list-group>
    </v-list>

    <v-alert v-else text tile color="warning">
      {{ $t("components.editorPages.alert") }}
    </v-alert>

    <editor-pages-dialog
      ref="pageDialog"
      @submit="submitPage"
    ></editor-pages-dialog>
  </div>
</template>

<script>
import EditorPagesDialog from "@/views/SiteBuilder/EditorSheet/EditorPagesDialog.vue";
import MessageBox from "@/mixins/MessageBox";

import { isStorePath } from "@/utils/location";
import { clampValue } from "@/utils/array";

import { sync } from "vuex-pathify";
import { mapMutations } from "vuex";
import last from "lodash/last";

export default {
  components: { EditorPagesDialog },

  mixins: [MessageBox],

  inject: ["rebuildPageRoutes"],

  data() {
    return {
      actions: [
        {
          on: (index, item) => ({
            click: () => {
              this.$router
                .push({
                  name: `${isStorePath(this.$route) ? "store" : "land"}-${
                    item.slug
                  }`
                })
                .catch(() => {});
              this.changeEditorTab("design");
            }
          }),
          bind: () => ({}),
          icon: "mdi-brush",
          title: "components.editorPages.actions.customize"
        },
        {
          on: index => ({ click: () => this.editPage(index) }),
          bind: () => ({}),
          icon: "mdi-pencil",
          title: "components.editorPages.actions.rename"
        },
        {
          on: index => ({ click: () => this.deletePage(index) }),
          bind: (index, item) => ({ disabled: this.isSpecialPage(item) }),
          icon: "mdi-delete",
          title: "components.editorPages.actions.delete"
        },
        {
          on: index => ({ click: () => this.movePage(index, -1) }),
          bind: () => ({}),
          icon: "mdi-chevron-up",
          title: "components.editorPages.actions.moveUp"
        },
        {
          on: index => ({ click: () => this.movePage(index, +1) }),
          bind: () => ({}),
          icon: "mdi-chevron-down",
          title: "components.editorPages.actions.moveDown"
        }
      ]
    };
  },

  computed: {
    ...sync({
      currentPageIndex: "builder/currentPageIndex",
      siteBuild: "builder/siteBuild"
    })
  },

  methods: {
    ...mapMutations({
      newPageMutation: "builder/newPage",
      updatePageMutation: "builder/updatePage",
      shiftPageMutation: "builder/shiftPage",
      removePageMutation: "builder/removePage",
      changeEditorTab: "builder/changeEditorTab",
      hideEditor: "builder/hideEditor"
    }),

    isSpecialPage(page) {
      return ["home", "single", "search"].includes(page.type);
    },

    newPage() {
      this.$refs.pageDialog.open();
    },

    editPage(index) {
      const page = this.siteBuild.pages[index];
      this.$refs.pageDialog.open({ page, index });
    },

    submitPage({ index, title }) {
      if (index === null) {
        this.newPageMutation({ title });

        const lastPage = last(this.siteBuild.pages);

        this.rebuildPageRoutes(this.siteBuild);

        this.$router
          .push({
            name: `${isStorePath(this.$route) ? "store" : "land"}-${
              lastPage.slug
            }`
          })
          .catch(() => {});
      } else {
        this.updatePageMutation({
          index,
          attrs: { title }
        });

        this.rebuildPageRoutes(this.siteBuild);

        const name = this.siteBuild.pages[index];
        this.$router
          .push({
            name: `${isStorePath(this.$route) ? "store" : "land"}-${name.slug}`
          })
          .catch(() => {});
      }
    },

    movePage(index, shift) {
      const toIndex = clampValue(index + shift, 0, this.siteBuild.pages.length);

      this.shiftPageMutation({
        index,
        toIndex
      });

      this.$store.commit("builder/setCurrentPageIndex", toIndex);
    },

    async deletePage(index) {
      const confirm = await this.$confirm({
        icon: "mdi-delete",
        title: "Effacer ?",
        message: "Vous-lez vous effacer cette page ?"
      });

      if (!confirm) return;

      this.removePageMutation(index);

      const homePage = this.siteBuild.pages[0];
      if (homePage)
        this.$router
          .push({
            name: `${isStorePath(this.$route) ? "store" : "land"}-${
              homePage.slug
            }`
          })
          .catch(() => {});
    },
    setVisible(value) {
      if (value === "false")
        this.siteBuild.pages[this.currentPageIndex].visible = false;
      else this.siteBuild.pages[this.currentPageIndex].visible = true;
    }
  }
};
</script>

<style lang="scss">
.o-editor-pages {
  .__list {
    .v-list-item--disabled {
      opacity: 0.5;
    }
  }
  .switch {
    .v-theme--dark.v-label {
      color: #fff;
    }
    .v-label {
      font-size: 14px;
    }
  }
}
</style>
