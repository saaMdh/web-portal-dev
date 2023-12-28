<template>
  <full-screen-frame>
    <template #title>
      <v-btn :aria-label="$t('topbar.publish')" icon @click="$emit('cancel')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>{{ $t("topbar.publish") }}</v-toolbar-title>
    </template>

    <template v-if="$apollo.queries.categoryList.loading === true">
      <div class="d-flex justify-center align-center full-h pa-10">
        <v-progress-circular
          color="primary"
          size="64"
          width="3"
          indeterminate
        ></v-progress-circular>
      </div>
    </template>
    <template v-else>
      <v-list>
        <template v-for="(item, i) in categoryList" :key="i">
          <v-list-item v-if="hasChildren(item)" @click="submit(item)">
            <template #prepend>
              <v-avatar>
                <category-img width="48" :category="item" />
              </v-avatar>
            </template>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>

          <v-list-group v-else v-model="openState[item.id]">
            <template #activator>
              <v-avatar>
                <category-img width="48" :category="item" />
              </v-avatar>
              <span>
                <v-list-item-title> {{ item.name }} </v-list-item-title>
              </span>
            </template>

            <v-list>
              <template v-for="(subItem, j) in item.children" :key="j">
                <v-list-item
                  v-if="hasChildren(subItem)"
                  @click="submit(subItem, item)"
                >
                  <v-list-item-title class="ms-4">
                    {{ subItem.name }}
                  </v-list-item-title>
                </v-list-item>

                <v-list-group v-else :sub-group="$isDesktop">
                  <template #activator>
                    <v-avatar height="25">
                      <category-img width="48" :category="subItem" />
                    </v-avatar>
                    <span>
                      <v-list-item-title>
                        {{ subItem.name }}
                      </v-list-item-title>
                    </span>
                  </template>

                  <template
                    v-for="(subSubItem, k) in subItem.children"
                    :key="k"
                  >
                    <v-list-item @click="submit(subSubItem, item)">
                      <v-list-item-title>{{
                        subSubItem.name
                      }}</v-list-item-title>
                    </v-list-item>
                  </template>
                </v-list-group>
              </template>
            </v-list>
          </v-list-group>
        </template>
      </v-list>
    </template>
  </full-screen-frame>
</template>

<script>
import gql from "graphql-tag";

import PublishStore from "./PublishStore";
import FullScreenFrame from "@ouedkniss/web-ui-plugin/src/components/Misc/FullScreenFrame.vue";
import filter from "lodash/filter";
import mapValues from "lodash/mapValues";

export default {
  components: { FullScreenFrame },
  props: {
    activated: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      form: PublishStore,
      categoryList: [],
      openState: {}
    };
  },

  apollo: {
    categoryList: {
      query: gql`
        query CategoryListPublishDialog {
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
      `,
      skip() {
        return !this.activated;
      },
      result({ data }) {
        if (data) {
          this.categoryList = filter(
            data.categoryList,
            category => category.slug != "voyages"
          );
        }
      }
    }
  },

  watch: {
    "form.category"() {
      this.resetForm();
    }
  },

  methods: {
    resetForm() {
      this.form.title = "";
      this.form.price = null;
      this.form.cityIds = null;
      this.form.regionIds = null;
      this.form.specifications = [];
      this.form.medias = [];
      this.form.defaultMedia = null;
      this.form.priceType = null;
      this.form.phoneIds = [];
      this.form.priceUnit = "UNIT";
      this.$emit("resetForm");
    },
    hasChildren(item) {
      const noChilds = ["automobiles"];
      return !item.children.length || noChilds.includes(item.slug);
    },
    submit(category, parent) {
      this.form.parentSlug = parent !== undefined ? parent.slug : category.slug;
      this.form.category = category;

      this.$emit("submit");
    },
    reset() {
      this.form.category = null;
    },
    closeCategories() {
      this.openState = mapValues(this.openState, () => false);
    }
  }
};
</script>

<style></style>
