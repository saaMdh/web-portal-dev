<template>
  <div class="o-search-categories">
    <div
      v-if="showSkeleton"
      class="d-flex justify-space-between mx-3"
      no-gutters
    >
      <div
        v-for="i in $r({
          lg: 12,
          md: 8,
          sm: 6,
          xs: 4
        })"
        :key="i"
        lg="1"
        md="1"
        sm="2"
        cols="3"
      >
        <ok-circle-loader
          class="mb-4"
          :size="
            $r({
              xl: '80px',
              lg: '80px',
              md: '80px',
              sm: '70px',
              xs: '55px'
            })
          "
          :animated="false"
          label="true"
        ></ok-circle-loader>
      </div>
    </div>
    <swiper
      v-show="!showSkeleton"
      v-slot="{ item }"
      :items="suggested ? suggestedItems : stepItems[step]"
      item-value="id"
      :space-between="12"
      :slides-per-view="
        $r({
          lg: 12,
          md: 8,
          sm: 6,
          xs: 4
        })
      "
      :current-slide="index"
      :navigation="$isDesktop"
      :pagination="$isMobile"
      :options="{
        grid: {
          fill: 'row',
          rows: 1
        },
        slidesPerGroup: $r({
          lg: 12,
          md: 8,
          sm: 6,
          xs: 4
        })
      }"
    >
      <div
        class="o-search-categories__item"
        :class="{
          suggested: suggested,
          'v-theme--dark': $vuetify.theme.current.dark,
          'v-theme--light': !$vuetify.theme.current.dark
        }"
        @click="CategoryClickHandler(item)"
      >
        <div
          v-if="item.__typename === 'back' || item.icon?.startsWith('mdi-')"
          class="v-card mb-2"
        >
          <v-icon :size="$isMobile ? 30 : 50">{{ item.icon }}</v-icon>
        </div>
        <v-badge
          v-else
          :content="item.count"
          floating
          offset-y="22"
          offset-x="22"
        >
          <div
            class="v-card mb-2"
            :class="{
              selected: item.active
            }"
          >
            <category-img
              :category="suggested ? item.category : item"
              :size="
                $r({
                  xl: 70,
                  lg: 70,
                  md: 70,
                  sm: 70,
                  xs: 50
                })
              "
            ></category-img>
          </div>
        </v-badge>
        <h2>
          {{ suggested ? item.category.name : item.name }}
          <template v-if="item.__typename === 'back' && step == 1">
            {{ $t("search.allCategories") }}
          </template>
        </h2>
      </div>
    </swiper>
  </div>
</template>

<script setup>
import okCircleLoader from "@/components/uiKit/loader/okCircleLoader";
import env from "@/utils/env";
import gql from "graphql-tag";
import get from "lodash/get";
import size from "lodash/size";
import take from "lodash/take";
import isEmpty from "lodash/isEmpty";
import {
  computed,
  defineAsyncComponent,
  getCurrentInstance,
  ref,
  shallowRef,
  watch
} from "vue";
import { useStore } from "vuex";
import { useRtl } from "vuetify";
import { GenerateArrayListStep } from "@/utils/array";
const QUERY = gql`
  query listingMenu($menuFilter: MenuFilterInput) {
    listingMenu: menuFetch(menuFilter: $menuFilter) {
      id
      name
      icon {
        light
        dark
      }
      target {
        ... on Category {
          id
          name
          slug
          icon
          delivery
          parentTree {
            slug
            icon
          }
          children {
            id
          }
        }
        ... on TargetLink {
          link
        }
      }
      rank
    }
  }
`;
const vm = getCurrentInstance().appContext.config.globalProperties;

const store = useStore();
const { isRtl } = useRtl();
const Swiper = defineAsyncComponent(() =>
  import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
);

const props = defineProps({
  search: {
    type: Object,
    required: true
  },
  category: {
    type: Object,
    required: true
  },
  suggested: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: null
  }
});

const emit = defineEmits(["submit", "submitAlternative"]);

const MIN_DEPTH = 2;

const loading = ref(0);
const index = ref(0);
const step = ref(0);
const steps = ref(0);
let cached_slug = "";

const stepItems = shallowRef(GenerateArrayListStep(MIN_DEPTH));

const categories = computed(() => store.getters.full_categories);
const parentDepth = computed(() => size(props.category.parentTree));
const parent = computed(() => {
  const index = Math.max(0, size(props.category.parentTree) - 1);
  return get(props.category, `parentTree[${index}]`, null);
});
const suggestedItems = computed(() => [
  props.search.active,
  ...take(props.search.suggested, 10)
]);

const showSkeleton = computed(() => {
  return (
    loading.value ||
    !(props.suggested ? suggestedItems.value : stepItems.value[step.value])
  );
});

const FetchListingMenu = async options => {
  loading.value = 1;

  try {
    const { data } = await vm.$apollo.query({
      fetchPolicy: "no-cache",
      query: QUERY,
      variables: {
        menuFilter: {
          menuType: "LISTING_MENU",
          displayCategorySlug: options.slug
        }
      }
    });

    cached_slug = options.slug;
    let listingMenu = get(data, "listingMenu", []);
    let items = stepItems.value[options.step];

    if (!items || !CheckListExist(items, listingMenu)) {
      const _items = listingMenu;

      const items = BuildCategoriesItem(_items, options);
      stepItems.value[options.step] = items;
    }
    step.value = options.step;
    steps.value++;
  } catch (error) {
    if (env.isDev) console.error(error);
  }

  loading.value = 0;
};

const CheckListExist = (items, listingMenu) => {
  const _items = items.filter(i => i.__typename !== "back");
  if (_items.length !== listingMenu.length) return false;
  return _items.every(
    (item, index) => item.id === listingMenu[index].target.id
  );
};

const BuildCategoriesItem = (list, options) => {
  const new_list = list.map(c => {
    let active = false;
    if (c.target.__typename === "TargetLink") {
      return {
        name: c.name,
        id: c.id,
        slug: c.target.link,
        icon: vm.$vuetify.theme.current.dark ? c.icon.dark : c.icon.light,
        active,
        parentTree: null,
        children: [],
        __typename: c.target.__typename
      };
    }
    return {
      name: c.target.name,
      id: c.target.id,
      slug: c.target.slug,
      delivery: c.target.delivery,
      icon: vm.$vuetify.theme.current.dark ? c.icon.dark : c.icon.light,
      active,
      parentTree: c.target.parentTree,
      children: c.target.children,
      __typename: c.target.__typename
    };
  });
  if (options.step === 0) return new_list;
  return [
    {
      icon: isRtl.value ? "mdi-chevron-right" : "mdi-chevron-left",
      __typename: "back"
    },
    ...new_list
  ];
};

const CategoryClickHandler = item => {
  if (item.__typename === "back") ClimbStep();
  else if (item.slug?.startsWith("http")) window.location.href = item.slug;
  else if (props.suggested) SubmitAlternative(item);
  else DiveStep(item);
};

const DiveStep = item => {
  if (!item.slug) return;
  const childrenCount = get(item, "children.length", null);
  if (item.__typename === "TargetLink") {
    const _step = GetStepAndExtendStepItems(step.value + 1);
    stepItems.value[_step] = [];
    FetchListingMenu({ slug: item.slug, step: _step });
  } else if (childrenCount === null || childrenCount > 0) {
    //global categories from state:childrenCount === null
    //in case we are at the top level (childrenCount === null) or at the mid level (childrenCount > 0)
    const _step = GetStepAndExtendStepItems(size(item.parentTree) + 1);
    stepItems.value[_step] = [];
    FetchListingMenu({ slug: item.slug, step: _step });
  }
  ActiveCategory(item, step.value);
  emit("submit", item);
};

const ClimbStep = async () => {
  if (await EnsureParentElement(step.value))
    step.value = Math.max(0, step.value - 1);
  else step.value = 0;
};

const EnsureParentElement = async step => {
  const _step = step - 1;
  if (step < 2) return false;
  const parent = GetGrandParentStepItems(step);
  const items = stepItems.value[_step];
  if (!parent || isEmpty(items)) return false;

  const item = items.find(item => item.slug);
  const fetchFlag = isEmpty(items) || !item?.slug.includes(parent.slug);

  if (fetchFlag) await FetchListingMenu({ slug: parent.slug, step: _step });

  return true;
};

const GetGrandParentStepItems = step => {
  const items = stepItems.value[step];
  if (isEmpty(items)) return null;

  const item = items.find(item => item?.parentTree?.length);
  if (!item || get(item, "parentTree.length", 0) < 2) return null;
  return item.parentTree[item.parentTree.length - 2];
};

const SubmitAlternative = item => {
  emit("submitAlternative", {
    category: item.category.slug,
    keywords: props.modelValue
  });
};

const InitMenu = () => {
  let slug = props.category.slug;
  //parentDepth.value + 1 (allCategories)
  let step = parentDepth.value + 1;
  //prevent searching for non-existent children on first load
  if (props.category.children.length === 0) {
    slug = get(parent.value, "slug", null);
    //climb step, max=1:prevent to climb to allcategories
    step = Math.max(1, step - 1);
    //case:single category (without parent/children)
    if (!slug) return FallbackStep();
  } else step = GetStepAndExtendStepItems(step);
  if (cached_slug !== slug) FetchListingMenu({ slug, step });
};

const GetStepAndExtendStepItems = step => {
  if (stepItems.value.length - 1 < step) stepItems.value.push([]);
  return step;
};

const FallbackStep = () => {
  step.value = 0;
};

const ActiveCategory = (category, step) => {
  if (!category) return;
  stepItems.value[step].forEach((c, i) => {
    if (category.slug === c.slug) {
      stepItems.value[step][i].active = true;
      index.value = i;
    } else stepItems.value[step][i].active = false;
  });
};

stepItems.value[0] = BuildCategoriesItem(categories.value, {
  slug: props.category.slug,
  step: 0
});

watch(steps, () => {
  ActiveCategory(props.category, step.value);
});

if (props.category.slug) InitMenu();
watch(
  () => props.category,
  () => {
    if (!props.category.slug) return;
    //run when the category changed outside
    InitMenu();
  }
);
</script>
<style lang="scss">
@import "@/scss/responsive";

.o-search-categories {
  @include isDesktop {
    height: 120px;
  }
  @include isMobile {
    height: 120px;
  }

  .v-badge__badge {
    font-size: 14px !important;
  }

  .o-search-categories__item:not(.suggested) {
    .v-badge__badge {
      display: none;
    }
  }

  &__item {
    text-align: center;
    cursor: pointer;

    .v-card {
      @include isDesktop {
        width: 80px;
        height: 80px;
      }
      @include isSM {
        width: 70px;
        height: 70px;
      }
      @include isXS {
        width: 55px;
        height: 55px;
      }
      display: flex;
      align-items: center;
      margin: 0 auto;
      justify-content: center;
      border-radius: 50%;
    }

    h2 {
      @include isDesktop {
        line-height: 1em;
        font-weight: 400;
        font-size: 0.82rem;
      }
      @include isSM {
        line-height: 1.2;
        font-weight: 400;
        font-size: 0.75rem;
      }
      @include isXS {
        line-height: 1.2;
        font-weight: 300;
        font-size: 0.68rem;
      }
      height: 27px;
      overflow-y: clip;
      word-wrap: normal;
      letter-spacing: -0.1px;
    }
  }
}

.v-theme--light.o-search-categories__item {
  .v-card {
    background: #fff;
    box-shadow: 0 1px 1px #bbb !important;

    &.selected {
      border: 1px solid rgb(var(--v-theme-primary));
    }
  }
}

.v-theme--dark.o-search-categories__item {
  .v-card {
    background: #252525;
    box-shadow: 0 1px 2px #000 !important;

    &.selected {
      border: 2px solid rgb(var(--v-theme-primary));
    }
  }
}
</style>