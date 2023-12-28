<template>
  <div class="o-editor-pages">
    <template v-if="loading > 0">
      <input-skeleton v-for="n in 3" :key="n"> </input-skeleton>
    </template>
    <template v-else-if="selected && selected.length">
      <editor-categories-select
        v-for="(s, index) in selected"
        :key="s.id"
        :model-value="s"
        :categories="
          index === 0 ? categoryGroup() : selected[index - 1].children
        "
        filled
        @update:modelValue="
          v => update(v, s, index === 0 ? null : selected[index - 1])
        "
      ></editor-categories-select>
      <editor-categories-select
        v-if="
          last && last.children && last.children.length > 0 && type !== 'STORES'
        "
        :categories="last.children"
        filled
        @update:modelValue="v => update(v, last, lastParent)"
      ></editor-categories-select>
    </template>
  </div>
</template>

<script>
import inputSkeleton from "@/components/uiKit/skeleton/inputSkeleton.vue";
import EditorCategoriesSelect from "@/views/SiteBuilder/EditorSheet/QueriesManagement/EditorCategoriesSelect.vue";

import CategoryBaseField from "@/components/SiteBuilder/Fields/CategoryBaseField";

import { getCategoryFromSlug } from "@/utils/category";
import gql from "graphql-tag";

export default {
  components: { inputSkeleton, EditorCategoriesSelect },

  mixins: [CategoryBaseField],

  props: {
    modelValue: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: "ANNOUNCEMENTS"
    }
  },
  data() {
    return {
      categoryList: [],
      loading: 0
    };
  },
  computed: {
    selected: {
      get() {
        let path = [];
        if (!this.modelValue) {
          this.$emit("update:modelValue", "");
          return [{}];
        }
        this.$emit(
          "submit",
          getCategoryFromSlug(this.modelValue, this.categoryGroup(), path)
        );
        return path;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      }
    },
    last() {
      return this.selected[this.selected.length - 1];
    },
    lastParent() {
      return this.selected[this.selected.length - 2];
    }
  },
  methods: {
    categoryGroup() {
      return this.store ? this.categories : this.categoryList;
    },
    update(value, category, parent) {
      if (value || !parent) this.selected = value;
      else this.selected = value ? category.slug : parent.slug;
    }
  },

  apollo: {
    categoryList: {
      loadingKey: "loading",
      query: gql`
        query CategoryList {
          categoryList {
            id
            name
            slug
            icon
            delivery
            children {
              id
              name
              slug
              icon
              delivery
              children {
                id
                name
                slug
                icon
                delivery
              }
            }
          }
        }
      `,
      skip() {
        return this.store;
      }
    }
  }
};
</script>

<style lang="scss"></style>
