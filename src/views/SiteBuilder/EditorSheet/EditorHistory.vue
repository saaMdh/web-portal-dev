<template>
  <div>
    <v-toolbar>
      <v-btn icon @click="changeEditorTab('publish')">
        <v-icon>
          {{ $vuetify.locale.rtl ? "mdi-arrow-right" : "mdi-arrow-left" }}
        </v-icon>
      </v-btn>

      <v-toolbar-title>
        {{ $t("components.editorHistory.history") }}
      </v-toolbar-title>
    </v-toolbar>

    <v-progress-linear :active="loading > 0" indeterminate></v-progress-linear>

    <v-list class="o-editor-history">
      <v-list-item
        v-for="(item, index) in history.data"
        :key="index"
        :class="{
          __published: item === lastPublished,
          __unsaved: isUnPublished(item) && item !== lastPublished,
          __current: item.id === siteBuild.id
        }"
        :disabled="item.id === siteBuild.id"
        @click="select(item)"
      >
        <span>
          <v-list-item-title>
            {{ formatDateTime(item.createdAt) }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ formatDateTimeNow(item.createdAt) }}
          </v-list-item-subtitle>
        </span>

        <v-list-item-action v-if="item === lastPublished">
          <v-chip color="green"><v-icon>mdi-cloud-check</v-icon></v-chip>
        </v-list-item-action>

        <v-list-item-action v-if="item.id === siteBuild.id">
          <v-chip color="blue"><v-icon>mdi-eye</v-icon></v-chip>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <div
      v-if="
        !loading &&
          history &&
          history.paginatorInfo &&
          history.paginatorInfo.pageCount &&
          pagination.page < history.paginatorInfo.pageCount
      "
      v-intersect.quite="intersect"
    ></div>
  </div>
</template>

<script>
import Queries from "@/views/SiteBuilder/Queries.graphql";

import { parseISO, isAfter } from "date-fns";

import { mapMutations } from "vuex";
import { sync } from "vuex-pathify";
import find from "lodash/find";
import get from "lodash/get";

export default {
  inject: ["loadSiteBuild", "apiEvents"],

  data() {
    return {
      history: {
        data: [],
        paginatorInfo: { pageCount: null }
      },
      loading: 0,
      current: null,
      pagination: {
        page: 1,
        count: 15
      }
    };
  },

  computed: {
    ...sync({
      siteBuild: "builder/siteBuild",
      landingType: "builder/landingType",
      editorDirty: "builder/editor@dirty"
    }),

    lastPublished() {
      return find(this.history.data, s => !!s.publishedAt);
    }
  },

  mounted() {
    this.apiEvents.on("updateComplete", () => {
      this.$apollo.queries.history.refetch();
    });

    this.apiEvents.on("publishComplete", () => {
      this.$apollo.queries.history.refetch();
    });
  },

  apollo: {
    history: {
      query: Queries.History,
      fetchPolicy: "network-only",
      loadingKey: "loading",
      variables() {
        return {
          id: this.siteBuild.land.id,
          LaunchType: this.landingType.toUpperCase(),
          count: this.pagination.count,
          page: 1
        };
      }
    }
  },

  methods: {
    ...mapMutations({ changeEditorTab: "builder/changeEditorTab" }),

    isUnPublished(item) {
      if (!this.lastPublished) return true;

      const pub = parseISO(this.lastPublished.publishedAt);

      return isAfter(parseISO(item.createdAt), pub);
    },

    async select(item) {
      if (!this.current) {
        this.current = this.siteBuild;
      }

      const { data } = await this.$apollo.query({
        query: Queries.siteBuildGetById,
        variables: {
          id: item.id,
          LaunchType: this.landingType.toUpperCase(),
          landId: this.siteBuild.land.id
        }
      });
      const build = get(data, "siteBuild");

      this.loadSiteBuild(build, { parseBlockAttr: true });

      if (this.current && item.id === this.current.id) {
        this.current = null;
        this.$nextTick(() => (this.editorDirty = false));
      }
    },
    intersect(_e, _o, isInteresecting) {
      if (!isInteresecting) return;
      if (this.loading > 0) return;
      this.fetchMore();
    },
    fetchMore() {
      this.pagination.page++;

      this.$apollo.queries.history.fetchMore({
        variables: {
          count: this.pagination.count,
          page: this.pagination.page
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return {
            history: {
              __typename: previousResult.history.__typename,

              data: [
                ...previousResult.history.data,
                ...fetchMoreResult.history.data
              ],
              paginatorInfo: fetchMoreResult.history.paginatorInfo
            }
          };
        }
      });
    }
  }
};
</script>

<style lang="scss">
.o-editor-history {
  .__published {
    background: #29c7291a;
  }

  .v-list-item:not(.__unsaved):not(.__published) {
    opacity: 0.3;
  }
}
</style>
