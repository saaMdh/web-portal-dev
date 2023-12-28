<template>
  <div>
    <v-toolbar>
      <v-btn icon @click="changeEditorTab('publish')">
        <v-icon>
          {{ $vuetify.locale.rtl ? "mdi-arrow-right" : "mdi-arrow-left" }}
        </v-icon>
      </v-btn>

      <v-toolbar-title>
        {{ $t("components.editorblueprint.blueprint") }}
      </v-toolbar-title>
    </v-toolbar>

    <v-progress-linear
      :active="$apollo.queries.blueprint.loading > 0"
      indeterminate
    ></v-progress-linear>

    <v-list-subheader>
      <v-btn
        :loading="loading"
        class="primary"
        variant="outlined"
        block
        size="small"
        @click="SaveBlueprint"
      >
        <v-icon>
          mdi-content-save
        </v-icon>
      </v-btn>
    </v-list-subheader>
    <div>
      <v-row v-if="$apollo.queries.blueprint.loading > 0">
        <v-col v-for="i in 6" :key="i" cols="6">
          <v-skeleton-loader type="image" height="150"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-item-group v-else>
        <v-container>
          <v-row>
            <v-col v-for="(item, i) in blueprint.data" :key="i" cols="6">
              <v-item v-slot="{ active }" :value="item.id">
                <v-card
                  class="s-template-card"
                  :class="{
                    __current: active
                  }"
                  :disabled="item.id === siteBuild.id"
                  hover
                >
                  <v-img
                    v-if="item.screenshotUrl"
                    :src="item.screenshotUrl"
                    :aspect-ratio="1"
                    contain
                  >
                  </v-img>
                  <v-card-actions>
                    <v-btn
                      v-if="item.id === siteBuild.id"
                      size="small"
                      color="success"
                      class="ma-1"
                      block
                      ><v-icon size="small">mdi-check</v-icon></v-btn
                    >
                    <template v-if="item.id !== siteBuild.id">
                      <v-btn
                        size="small"
                        label
                        color="primary"
                        class="ma-1"
                        @click="selectBlueprint(item.id)"
                        ><v-icon size="small">mdi-check</v-icon></v-btn
                      >
                      <v-spacer> </v-spacer>
                      <v-btn
                        size="small"
                        label
                        color="error"
                        class="ma-1"
                        @click="DeleteBlueprint(item)"
                        ><v-icon size="small">mdi-delete</v-icon></v-btn
                      >
                    </template>
                  </v-card-actions>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>
      <div
        v-if="
          !loading &&
            blueprint &&
            blueprint.paginatorInfo &&
            blueprint.paginatorInfo.pageCount &&
            pagination.page < blueprint.paginatorInfo.pageCount
        "
        v-intersect.quite="intersect"
      ></div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";

import MessageBox from "@/mixins/MessageBox";
import env from "@/utils/env.js";

import Queries from "@/views/SiteBuilder/Queries.graphql";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { mapMutations } from "vuex";
import { sync } from "vuex-pathify";
import merge from "lodash/merge";
import find from "lodash/find";
import pick from "lodash/pick";
import get from "lodash/get";

export default {
  mixins: [MessageBox],
  inject: ["loadSiteBuild", "apiEvents"],
  setup() {
    const { token } = useAuthFrame();

    return {
      token
    };
  },

  data() {
    return {
      current: null,
      loading: false,
      output: null,
      blueprint: {
        data: [],
        paginatorInfo: { pageCount: null }
      },
      pagination: {
        page: 1,
        count: 10
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
      return find(this.blueprint.data, s => !!s.publishedAt);
    }
  },

  mounted() {
    this.apiEvents.on("updateComplete", () => {
      this.$apollo.queries.blueprint.refetch();
    });

    this.apiEvents.on("publishComplete", () => {
      this.$apollo.queries.blueprint.refetch();
    });
  },

  apollo: {
    blueprint: {
      query: Queries.Blueprint,
      fetchPolicy: "network-only",
      variables() {
        return {
          id: get(this.siteBuild, "land.id", get(this.store, "id")),
          LaunchType: this.landingType.toUpperCase(),
          count: this.pagination.count,
          page: 1
        };
      }
    }
  },

  methods: {
    ...mapMutations({ changeEditorTab: "builder/changeEditorTab" }),
    async $html2canvas(el, options = {}) {
      const { type } = options;
      const canvas = await html2canvas(el, options);
      if (type && type === "dataURL") {
        return canvas.toDataURL();
      } else {
        console.warn(
          "Vue Html2Canvas Warn: Invalid option type. Use 'dataURL' instead. Returning canvas."
        );
        return canvas;
      }
    },
    async SaveBlueprint() {
      this.loading = true;
      const el = document.getElementById("app");
      const options = {
        type: "dataURL"
      };
      const screenshotUrl = await this.uploadImage(
        await this.$html2canvas(el, options)
      );
      const siteBuild = { ...this.siteBuild, screenshotUrl };
      this.blueprint.data.unshift(siteBuild);
      try {
        this.$nextTick(() => (this.editorDirty = false));
        const { data } = await this.$apollo.mutate({
          mutation: Queries.SaveBlueprint,
          variables: {
            id: siteBuild.land.id,
            LaunchType: this.landingType.toUpperCase(),
            build: pick(siteBuild, [
              "theme",
              "pages",
              "headers",
              "footers",
              "screenshotUrl"
            ])
          }
        });
        this.blueprint.data[0] = merge(this.blueprint.data[0], data.siteBuild);
        this.selectBlueprint(this.blueprint.data[0].id);
      } catch (error) {
        this.blueprint.data.splice(0, 1);
        console.error(error);
      }
      this.loading = false;
    },
    async DeleteBlueprint(item) {
      const confirm = await this.$confirm({
        icon: "mdi-delete",
        title: this.$t(
          "components.editorPropsBlockTools.removeBlockDialog.title"
        ),
        message: this.$t(
          "components.editorPropsBlockTools.removeBlockDialog.message"
        )
      });

      if (!confirm) return;
      if (item.id === this.siteBuild.id) return;
      this.loading = true;
      const index = this.blueprint.data.findIndex(b => b.id == item.id);
      const build = this.blueprint.data[index];
      this.blueprint.data.splice(index, 1);

      try {
        await this.$apollo.mutate({
          mutation: Queries.DeleteBlueprint,
          variables: {
            id: item.id,
            LaunchType: this.landingType.toUpperCase()
          }
        });
      } catch (error) {
        this.blueprint.data.splice(index, 0, build);
        console.error(error);
      }
      this.loading = false;
    },
    async selectBlueprint(id) {
      if (!this.current) {
        this.current = this.siteBuild;
      }

      const { data } = await this.$apollo.query({
        query: Queries.siteBuildGetById,
        variables: {
          id: id,
          LaunchType: this.landingType.toUpperCase(),
          landId: this.siteBuild.land.id
        }
      });
      const build = get(data, "siteBuild");

      this.loadSiteBuild(build, { parseBlockAttr: true });

      try {
        await this.$apollo.mutate({
          mutation: Queries.SelectBlueprint,
          variables: {
            id: id,
            LaunchType: this.landingType.toUpperCase()
          }
        });
      } catch (error) {
        console.error(error);
      }
      this.$nextTick(() => (this.editorDirty = false));
    },
    async uploadImage(img) {
      const form = new FormData();
      let file;
      const res = await fetch(img);
      const blob = await res.blob();
      file = new File([blob], "screenshot", { type: "image/jpeg" });

      const compressOpts = {
        maxSizeMB: 3,
        maxWidthOrHeight: 1600
      };
      const imageCompression = (await import("browser-image-compression"))
        .default;

      const f = await imageCompression(file, compressOpts);
      form.append("image", f, f.name);

      try {
        const uploadUrl = new URL(env.VUE_APP_UPLOAD);
        uploadUrl.pathname = "upload/image";
        const results = await fetch(uploadUrl.href, {
          method: "POST",
          body: form,
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then(r => {
          if (r.status != 200) throw new Error("File upload failed");
          return r.json();
        });

        return results.link;
      } catch (error) {
        console.error(error);
      }
    },
    intersect(_e, _o, isInteresecting) {
      if (!isInteresecting) return;
      if (this.loading > 0) return;
      this.fetchMore();
    },
    fetchMore() {
      this.pagination.page++;

      this.$apollo.queries.blueprint.fetchMore({
        variables: {
          count: this.pagination.count,
          page: this.pagination.page
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return {
            blueprint: {
              __typename: previousResult.blueprint.__typename,

              data: [
                ...previousResult.blueprint.data,
                ...fetchMoreResult.blueprint.data
              ],
              paginatorInfo: fetchMoreResult.blueprint.paginatorInfo
            }
          };
        }
      });
    }
  }
};
</script>

<style lang="scss">
.o-editor-blueprint {
  .__published {
    background: #29c7291a;
  }
  .o-editor-history .v-list-item:not(.__unsaved):not(.__published) {
    opacity: 1 !important;
  }
}
</style>
