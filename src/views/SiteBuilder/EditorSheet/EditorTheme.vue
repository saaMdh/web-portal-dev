<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>
        {{ $t("components.editorTheme.title") }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="hideEditor">
        <v-icon>
          {{ "mdi-close" }}
        </v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text class="pb-0">
      <color-field
        :model-value="colorToHex(theme.color)"
        filled
        :label="$t('components.editorTheme.fields.color')"
        @update:modelValue="v => (theme.color = v)"
      ></color-field>

      <v-select
        v-model="theme.dark"
        :items="themesList"
        :item-title="item => $t(item.text)"
        filled
        :label="$t('components.editorTheme.fields.dark')"
      ></v-select>

      <color-field
        v-model="theme.backgroundColor"
        filled
        :label="$t('components.editorTheme.fields.backgroundColor')"
      ></color-field>

      <picture-prop v-model="theme.backgroundImg" class="mb-4"></picture-prop>

      <v-select
        v-model="theme.font"
        :items="fontsList"
        item-title="text"
        filled
        :label="$t('components.editorTheme.fields.font')"
      ></v-select>
    </v-card-text>

    <div>
      <span class="mx-4">{{ $t("components.editorTheme.subtitle") }}</span>
      <div>
        <v-container v-if="loading > 0">
          <v-row>
            <v-col v-for="i in 4" :key="i" cols="6">
              <v-skeleton-loader
                type="image"
                height="150"
                width="140"
              ></v-skeleton-loader>
            </v-col> </v-row
        ></v-container>

        <v-item-group
          v-else-if="
            templateList && templateList.data && templateList.data.length > 0
          "
          v-model="activeTemp"
        >
          <v-container>
            <v-row>
              <v-col v-for="(temp, i) in templateList.data" :key="i" cols="6">
                <v-item v-slot="{ active }" :value="temp.id">
                  <v-card
                    class="s-template-card"
                    :class="{
                      '--active': active
                    }"
                    hover
                    @click="selectTemplate(temp)"
                  >
                    <v-img :src="temp.screenshotUrl" :aspect-ratio="1" contain>
                    </v-img>
                    <h3 class="text-caption py-1 px-2">{{ temp.title }}</h3>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-container>
        </v-item-group>
        <template v-else>
          <v-alert class="mt-3 mx-2" color="primary" icon="mdi-magnify" text>
            <div>{{ $t("search.notFound.0") }}</div>
          </v-alert>
        </template>
      </div>
      <div
        v-if="
          !loading &&
          templateList &&
          templateList.paginatorInfo &&
          templateList.paginatorInfo.pageCount &&
          pagination.page < templateList.paginatorInfo.pageCount
        "
        v-intersect.quite="intersect"
      ></div>
    </div>
  </div>
</template>

<script>
import ColorField from "@/components/SiteBuilder/Fields/ColorField.vue";
import PictureProp from "@/components/SiteBuilder/Props/PictureProp.vue";

import FontsDefinitions from "@/components/Fonts/FontsDefinition.js";

import { colorToHex } from "@/utils/colors";
import { LandingType } from "@/utils/LandingSite";

import { mapGetters, mapMutations } from "vuex";
import { sync } from "vuex-pathify";

import map from "lodash/map";
import get from "lodash/get";
import gql from "graphql-tag";
import { removeBackground } from "@/utils/colors";
export default {
  components: { ColorField, PictureProp },

  inject: ["updateAppTheme", "loadSiteBuild"],

  data() {
    return {
      fontsList: map(FontsDefinitions, (t, key) => ({
        value: key,
        text: t.name
      })),
      themesList: [
        { value: false, text: "components.editorTheme.themesList.light" },
        { value: true, text: "components.editorTheme.themesList.dark" }
      ],
      templateList: {
        data: [],
        paginatorInfo: { pageCount: null }
      },
      activeTemp: null,
      pagination: {
        page: 1,
        count: 10
      },
      loading: 0
    };
  },

  computed: {
    ...sync({ theme: "builder/siteBuild@theme" }),
    ...mapGetters({ land: "builder/land" })
  },

  watch: {
    "theme.dark"(newValue, oldValue) {
      if (newValue && !oldValue) this.theme.backgroundColor = "#373737";
      else if (!newValue && oldValue) this.theme.backgroundColor = "#F5F5F5";
    },
    theme: {
      deep: true,
      handler() {
        this.updateAppTheme();
        if (!this.theme.backgroundColor)
          removeBackground("id-background-color");
        if (!this.theme.backgroundImg) removeBackground("id-background-img");
      }
    }
  },

  apollo: {
    templateList: {
      loadingKey: "loading",
      fetchPolicy: "network-only",
      variables() {
        return {
          count: this.pagination.count,
          page: 1,
          LaunchType: LandingType().toUpperCase()
        };
      },
      query: gql`
        query siteTemplateList(
          $count: Int
          $page: Int
          $LaunchType: LaunchType!
        ) {
          templateList: siteTemplateList(
            count: $count
            page: $page
            LaunchType: $LaunchType
          ) {
            data {
              id
              title
              createdAt
              updatedAt
              screenshotUrl
            }
            paginatorInfo {
              pageCount
            }
          }
        }
      `
    }
  },

  methods: {
    colorToHex,
    ...mapMutations({ hideEditor: "builder/hideEditor" }),

    async selectTemplate(temp) {
      this.activeTemp = temp.id;
      const { data } = await this.$apollo.query({
        query: gql`
          query ($id: ID!) {
            template: siteTemplateGet(id: $id) {
              content
            }
          }
        `,
        loadingKey: "loading",
        variables: {
          id: temp.id
        }
      });
      const build = get(data, "template.content");
      build.land = this.land;

      this.loadSiteBuild(build);
    },
    intersect(_e, _o, isInteresecting) {
      if (!isInteresecting) return;
      if (this.loading > 0) return;
      this.fetchMore();
    },
    fetchMore() {
      this.pagination.page++;

      this.$apollo.queries.templateList.fetchMore({
        variables: {
          count: this.pagination.count,
          page: this.pagination.page,
          LaunchType: LandingType().toUpperCase()
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return {
            templateList: {
              __typename: previousResult.templateList.__typename,

              data: [
                ...previousResult.templateList.data,
                ...fetchMoreResult.templateList.data
              ],
              paginatorInfo: fetchMoreResult.templateList.paginatorInfo
            }
          };
        }
      });
    }
  }
};
</script>

<style lang="scss">
.s-template-card {
  &.--active {
    outline: rgb(var(--v-theme-primary)) 3px solid;
  }
}
</style>
