<template>
  <div class="o-editor-pages">
    <v-toolbar>
      <v-btn icon @click="changeEditorTab('home')">
        <v-icon>
          {{ $vuetify.locale.rtl ? "mdi-arrow-right" : "mdi-arrow-left" }}
        </v-icon>
      </v-btn>

      <v-toolbar-title>
        {{ $t("components.editorCategories.title") }}
      </v-toolbar-title>
    </v-toolbar>
    <v-text-field
      v-model="search"
      class="mt-2 px-2"
      :label="$t('components.editorCategories.label')"
      dense
      variant="outlined"
      solo-inverted
      hide-details
      clearable
      clear-icon="mdi-close-circle-outline"
    ></v-text-field>
    <v-divider class="my-2"></v-divider>
    <v-treeview
      ref="tree"
      v-model="selectedcategory"
      :items="categoryList"
      open-on-click
      item-key="slug"
      selectable
      :search="search"
    >
      <template #prepend="{ item }">
        <v-img v-if="item.icon" :src="item.icon" width="25"></v-img>
      </template>
    </v-treeview>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { sync } from "vuex-pathify";
import cloneDeep from "lodash/cloneDeep";
import gql from "graphql-tag";

export default {
  data() {
    return {
      categoryList: [],
      selectedcategory: [],
      search: null
    };
  },

  computed: {
    ...sync({ siteBuild: "builder/siteBuild" })
  },
  watch: {
    selectedcategory(selectedcategory) {
      let parents = cloneDeep(this.categoryList);
      parents = parents.filter(p =>
        selectedcategory.some(sc => sc.includes(p.slug))
      );
      parents = parents.map(p => {
        p.children = p.children.filter(c =>
          selectedcategory.some(sc => sc.includes(c.slug))
        );
        return p;
      });

      parents = parents.map(p => {
        p.children.map(c => {
          c.children = c.children.filter(gc =>
            selectedcategory.some(sc => sc.includes(gc.slug))
          );
          return c;
        });
        return p;
      });
      this.update(parents);
      return parents;
    }
  },
  apollo: {
    categoryList: {
      query: gql`
        query CategoryList {
          categoryList {
            id
            name
            slug
            icon
            children {
              id
              name
              slug
              icon
              children {
                id
                name
                slug
                icon
              }
            }
          }
        }
      `
    }
  },
  methods: {
    ...mapMutations({
      updateCategories: "builder/updateCategories",
      changeEditorTab: "builder/changeEditorTab"
    }),

    update(categories) {
      this.updateCategories(categories);
    }
  }
};
</script>

<style lang="scss"></style>
