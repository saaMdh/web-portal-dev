<template>
  <v-card flat>
    <v-card-title v-if="type !== 'STORES'" class="d-flex justify-end">
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            :disabled="isEmpty(queries) || selectedQuery.length < 2"
            size="small"
            class="mx-1"
            color="secondary"
            elevation="1"
            @click="joinQuery"
          >
            <v-icon> mdi-call-merge </v-icon>
          </v-btn>
        </template>
        <span>{{ $t("components.editorQueries.merge") }}</span>
      </v-tooltip>
      <v-btn
        :disabled="isEmpty(queries) || selectedQuery.length < 1"
        size="small"
        class="mx-1"
        color="error"
        elevation="1"
        @click="deleteQuries"
      >
        <v-icon> mdi-delete </v-icon>
      </v-btn>
    </v-card-title>
    <div class="px-2">
      <v-list v-if="queries && queries.length > 0">
        <v-list-item v-for="(item, index) in queries" :key="index" class="px-0">
          <template v-if="type !== 'STORES'" #prepend>
            <v-checkbox
              v-if="!isArray(item.cluster)"
              v-model="selectedQuery"
              :model-value="index"
              hide-details
              dense
            ></v-checkbox>
            <v-btn
              v-else
              size="x-small"
              color="primary"
              class="ma-1"
              @click="splitQuery(index)"
              ><v-icon>mdi-call-split</v-icon></v-btn
            >
          </template>
          <v-list-item-title>
            {{ item && item.name[locale] }}
          </v-list-item-title>

          <template #append>
            <v-btn
              size="small"
              icon
              density="comfortable"
              color="error"
              variant="text"
              @click="deleteQuery(index)"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
            <v-btn
              size="small"
              icon
              density="comfortable"
              color="primary"
              variant="text"
              @click="editQuery(index, item)"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
          </template>
        </v-list-item>
      </v-list>
      <div v-else class="pa-2">
        {{ $t("components.editorQueries.list.empty") }}
      </div>
    </div>
  </v-card>
</template>

<script>
import MessageBox from "@/mixins/MessageBox";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { mapMutations } from "vuex";
import { sync } from "vuex-pathify";

import mergeWith from "lodash/mergeWith";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import reduce from "lodash/reduce";

export default {
  mixins: [MessageBox],
  props: {
    type: {
      type: String,
      default: "ANNOUNCEMENTS"
    }
  },
  setup() {
    const { locale } = useAuthFrame();
    return { locale };
  },
  data: () => ({
    selectedQuery: []
  }),
  computed: {
    ...sync({ siteBuild: "builder/siteBuild" }),
    queries: {
      get() {
        return this.siteBuild.queries.filter(query =>
          this.type == "STORES"
            ? query.type == "STORES"
            : !query.type || query.type !== "STORES"
        );
      },
      set(v) {
        this.updateQueries(v);
      }
    }
  },
  methods: {
    ...mapMutations({
      updateQueries: "builder/updateQueries",
      addQuery: "builder/addQuery",
      removeQuery: "builder/removeQuery",
      removeQueries: "builder/removeQueries"
    }),
    async deleteQuries() {
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
      if (this.queries && this.queries.length > 0)
        this.removeQueries(this.selectedQuery);
      this.selectedQuery = [];
    },
    async deleteQuery(index) {
      const confirm = await this.$confirm({
        icon: "mdi-delete",
        title: this.$t("@.delete.0"),
        message: this.$t("@.delete.1")
      });

      if (!confirm) return;

      if (this.queries && this.queries.length > 0) this.removeQuery(index);
      this.selectedQuery = [];
    },
    editQuery(index, data) {
      this.$emit("editQuery", { index, data });
      // if (this.queries && this.queries.length > 0) this.removeQuery(index);
      this.selectedQuery = [];
    },
    isArray: v => isArray(v),
    isEmpty: v => isEmpty(v),
    joinQuery() {
      const cluster = filter(this.queries, (el, index) =>
        this.selectedQuery.includes(index)
      );
      const count = reduce(cluster, (accu, curr) => accu + curr.count, 0);
      const name = reduce(
        cluster,
        (accu, curr) =>
          mergeWith(
            accu,
            curr.name,
            (name1, name2) => name2 + (isEmpty(name1) ? "" : `, ${name1}`)
          ),
        {
          fr: "",
          ar: "",
          en: ""
        }
      );
      this.removeQueries(this.selectedQuery);
      this.addQuery({
        query: {
          name,
          cluster,
          count
        },
        type: this.type
      });
      this.selectedQuery = [];
    },
    splitQuery(index) {
      this.queries = this.queries.flatMap((el, i) =>
        index === i ? el.cluster : [el]
      );
      this.selectedQuery = [];
    }
  }
};
</script>
<style lang="scss"></style>
