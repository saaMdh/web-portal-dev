<template>
  <div>
    <ok-list-group
      :key="BOUTIQUE.slug"
      :open="open === BOUTIQUE.slug"
      :loading="open === BOUTIQUE.slug && (loading || tags.length === 0)"
      @click="openGroup(BOUTIQUE, true)"
    >
      <ok-list-group-item clickable>
        <template #prepend>
          <v-avatar size="36">
            <ok-img :src="BOUTIQUE.icon"></ok-img>
          </v-avatar>
        </template>
        <template #title>{{ BOUTIQUE.name }}</template>
      </ok-list-group-item>
      <template #loading>
        <v-progress-circular
          color="primary"
          size="32"
          width="3"
          indeterminate
        ></v-progress-circular
      ></template>
      <template #list>
        <ok-list-item
          v-for="tag in tags"
          :key="tag.id"
          inset
          clickable
          @click="submitStore(tag)"
        >
          <template #title>
            {{ tag.name }}
          </template>
        </ok-list-item>
      </template>
    </ok-list-group>

    <ok-list-group
      v-for="category in categories"
      :key="category.id"
      :loading="loading || childrens.length === 0"
      :open="open === category.slug"
      @click="openGroup(category)"
    >
      <ok-list-group-item clickable>
        <template #prepend>
          <v-avatar size="36">
            <ok-img :src="category.icon"></ok-img>
          </v-avatar>
        </template>
        <template #title> {{ category.name }} </template>
      </ok-list-group-item>
      <template #loading>
        <v-progress-circular
          color="primary"
          size="32"
          width="3"
          indeterminate
        ></v-progress-circular
      ></template>
      <template #list>
        <ok-list-item
          :title-bind="{ class: 'font-weight-bold' }"
          @click="submit(category)"
        >
          <template #prepend>
            <v-avatar size="30">
              <ok-img :src="category.icon"></ok-img>
            </v-avatar>
          </template>
          <template #title>
            {{ $t("announcement.allAnnouns") }}
          </template>
        </ok-list-item>
        <template v-for="category0 in childrens" :key="category0.slug">
          <ok-list-item
            :title-bind="
              hasChildren(category0) ? { class: 'font-weight-bold' } : {}
            "
            @click="submit(category0)"
          >
            <template #prepend>
              <v-avatar size="30">
                <ok-img :src="category0.icon"></ok-img>
              </v-avatar>
            </template>
            <template #title> {{ category0.name }} </template>
          </ok-list-item>
          <ok-list v-if="hasChildren(category0)">
            <ok-list-item
              v-for="category1 in category0.children"
              :key="category1.id"
              clickable
              inset
              @click="submit(category1)"
            >
              <template #title>
                {{ category1.name }}
              </template>
            </ok-list-item>
          </ok-list>
        </template>
      </template>
    </ok-list-group>
  </div>
</template>

<script setup>
/*eslint-disable*/
//TODO:create ok-list component
import env from "@/utils/env";
import gql from "graphql-tag";
import get from "lodash/get";
import { computed, getCurrentInstance, ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import useResponsive from "@/composables/useResponsive";
import { useStore } from "vuex";
const vm = getCurrentInstance().appContext.config.globalProperties;

const props = defineProps({
  container: {
    type: String,
    default: null
  }
});

const store = useStore();
const { t } = useI18n();
const { goTo } = useResponsive();

const emit = defineEmits(["category", "categoryStores"]);
const categories = computed(() =>
  store.getters.categories.map((c, i) => ({ ...c.target, order: i + 1 }))
);

const open = ref(null);
const loading = ref(false);

const BOUTIQUE = {
  name: t("home.stores.title"),
  icon: require("@/assets/market-icon.png"),
  slug: "boutiques",
  order: 0
};

const childrens = shallowRef([]);
const tags = ref([]);

function openGroup(payload = null, isTags = false) {
  if (open.value === payload.slug) {
    open.value = null;
    return;
  }
  if (isTags) {
    open.value = payload.slug;
    fetchStoreTags();
  } else {
    open.value = payload.slug;
    const container = document.querySelector(props.container);
    goTo((payload.order || 0) * 54, { duration: 0, container }, false);
    fetchChildrens(payload);
  }
}

async function fetchChildrens(parent) {
  loading.value = true;
  try {
    const { data } = await vm.$apollo.query({
      query: gql`
        query CategoryTreeFetch($parentId: ID) {
          categoryList: categoryList(parentId: $parentId) {
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
      `,
      variables: {
        parentId: parent.id
      }
    });
    childrens.value = data.categoryList;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    if (env.isDev) console.error(error);
  }
}

async function fetchStoreTags() {
  loading.value = true;
  try {
    const { data } = await vm.$apollo.query({
      query: gql`
        query ($q: String, $count: Int, $page: Int) {
          storeTagsList(q: $q, count: $count, page: $page) {
            id
            name
            code
          }
        }
      `
    });
    tags.value = data.storeTagsList;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    if (env.isDev) console.error(error);
  }
}

function submit(category, delivery = false) {
  emit("category", { category, delivery });
}
function submitStore(tag) {
  emit("tagStores", tag);
}

function hasChildren(item) {
  return get(item, "children.length", 0) > 0;
}
</script>
<style lang="scss"></style>
