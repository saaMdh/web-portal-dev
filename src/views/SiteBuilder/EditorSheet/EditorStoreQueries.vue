<template>
  <div flat class="o-editor-queries">
    <v-toolbar>
      <v-toolbar-title>
        {{ $t("editorHome.storeQueriesManagement.title") }}
      </v-toolbar-title>
      <v-btn icon @click="hideEditor">
        <v-icon>
          {{ "mdi-close" }}
        </v-icon>
      </v-btn>
    </v-toolbar>
    <v-window v-model="step">
      <v-window-item :value="1">
        <query-list :type="'STORES'" @editQuery="edit"></query-list>
      </v-window-item>
      <v-window-item :value="2">
        <template v-if="step === 2">
          <query-props v-model="query"></query-props>
          <store-queries-management
            ref="management"
            v-model="query"
          ></store-queries-management>
        </template>
      </v-window-item>
      <div class="o-editor-queries-nexts mt-2 mx-2">
        <v-btn v-if="step !== 1" color="primary" @click="step--">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :disabled="disabled"
          depressed
          @click="step !== 2 ? step++ : save()"
        >
          <v-icon v-if="index !== null">mdi-check</v-icon>
          <template v-else><v-icon>mdi-plus</v-icon>{{ $t("_.add") }}</template>
        </v-btn>
      </div>
    </v-window>
  </div>
</template>

<script>
import QueryList from "@/views/SiteBuilder/EditorSheet/QueriesManagement/QueryList";
import QueryProps from "@/views/SiteBuilder/EditorSheet/QueriesManagement/QueryProps";
import { defineAsyncComponent } from "vue";
import { mapMutations } from "vuex";
import { sync } from "vuex-pathify";
import cloneDeep from "lodash/cloneDeep";
export default {
  components: {
    StoreQueriesManagement: defineAsyncComponent(() =>
      import(
        "@/views/SiteBuilder/EditorSheet/QueriesManagement/StoreQueriesEditor"
      )
    ),
    QueryList,
    QueryProps
  },
  data: () => ({
    step: 1,
    query: {
      name: { fr: "", en: "", ar: "" },
      count: 8,
      type: "STORES"
    },
    index: null
  }),
  computed: {
    ...sync({ tab: "builder/editor@tab" }),
    disabled() {
      if (this.step == 1) return false;
      else
        return (
          !this.query ||
          !this.query.name.fr ||
          !this.query.name.ar ||
          !this.query.name.en ||
          this.query.count <= 0
        );
    }
  },
  watch: {
    step: {
      handler(val) {
        if (val === 1) this.reset();
      },
      immediate: true
    },
    tab: {
      handler() {
        this.step = 1;
        this.reset();
      }
    }
  },

  methods: {
    ...mapMutations({
      addQuery: "builder/addQuery",
      editQuery: "builder/editQuery",
      changeEditorTab: "builder/changeEditorTab",
      hideEditor: "builder/hideEditor"
    }),
    async save() {
      if (this.index !== null) {
        await this.editQuery({
          query: this.query,
          index: this.index,
          type: "STORES"
        });
      } else await this.addQuery({ query: this.query, type: "STORES" });
      this.step = 1;
    },
    edit({ data, index }) {
      this.index = index;
      this.query = cloneDeep(data);
      this.step = 2;
    },
    reset() {
      this.index = null;
      this.query = {
        name: { fr: "", en: "", ar: "" },
        count: 8
      };
    }
  }
};
</script>

<style lang="scss">
.o-editor-queries {
  .__list {
    .v-list-item--disabled {
      opacity: 0.5;
    }
  }
}
.o-editor-queries-nexts {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.s-editor-sheet__content .v-window-item {
  height: 100% !important;
}
</style>
