<template>
  <category-select-field
    v-if="flatCategories"
    v-model="nestedCategory"
    :categories="flatCategories"
    class="my-2"
    slug-path="slug"
    :hide-icon="hideIcon"
    @select="changeParent"
  ></category-select-field>
  <category-select-field
    v-if="flatNestedCategories && flatNestedCategories.length > 0"
    :model-value="modelValue"
    :categories="flatNestedCategories"
    class="my-2"
    slug-path="slug"
    :return-slug="returnSlug"
    :hide-icon="hideIcon"
    @select="changeChild"
  ></category-select-field>
</template>

<script>
import CategoryBaseField from "@/components/SiteBuilder/Fields/CategoryBaseField";
import categorySelectField from "@/components/Field/CategorySelectField.vue";

export default {
  components: { categorySelectField },
  mixins: [CategoryBaseField],

  props: {
    modelValue: {
      type: [Object, String],
      default: null
    },

    label: {
      type: String,
      default: "components.fields.categorySelectField"
    },

    labelSubCategory: {
      type: String,
      default: "components.fields.subCategorySelectField"
    },

    returnSlug: {
      type: Boolean,
      default: false
    },

    hideIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      nestedCategory: null,
      flatCategories: null,
      flatNestedCategories: null
    };
  },
  watch: {
    modelValue: {
      handler(v) {
        if (v) {
          this.getNestedCategory();
        }
      }
    },
    categories: {
      handler() {
        this.flatCategories = this.flatenCategories(this.categories);
        this.getNestedCategory();
      },
      immediate: true
    }
  },
  methods: {
    getNestedCategory() {
      this.nestedCategory = this.getParentCategory();
      if (this.nestedCategory)
        this.flatNestedCategories = this.flatenCategories(
          this.nestedCategory.children
        );
    },
    flatenCategories(categories) {
      const flatten = [];
      categories.forEach(c => {
        flatten.push({
          type: c.children ? "subheader" : null,
          name: c.name,
          slug: c.slug,
          children: c.children
        });
        if (c.children)
          c.children.forEach(ch => {
            flatten.push({
              slug: ch.slug,
              name: ch.name,
              children: ch.children
            });
          });
      });
      return flatten;
    },
    changeParent(v) {
      if (v) {
        this.$emit("update:modelValue", v.slug);
        this.nestedCategory = v;
      } else {
        this.nestedCategory = null;
        this.$emit("update:modelValue", null);
      }
      if (this.nestedCategory && this.nestedCategory.children)
        this.flatNestedCategories = this.flatenCategories(
          this.nestedCategory.children
        );
      else this.flatNestedCategories = [];
    },
    getParentCategory() {
      if (!this.modelValue) return null;
      var parent = this.flatCategories.find(
        cat =>
          cat.slug === this.modelValue &&
          cat.children &&
          cat.children.length > 0
      );
      if (!parent) {
        parent = this.flatCategories.find(
          cat =>
            cat.children &&
            cat.children.findIndex(ch => this.modelValue === ch.slug) > -1
        );
      }
      if (!parent) {
        parent = this.flatCategories.find(cat => cat.slug === this.modelValue);
      }
      return parent;
    },
    changeChild(v) {
      if (!v) {
        this.$emit("update:modelValue", this.nestedCategory.slug);
      } else {
        this.$emit("update:modelValue", v);
      }
    }
  }
};
</script>

<style></style>
