<template>
  <v-row class="pa-3">
    <v-col :cols="$isMobile ? 12 : 3">
      <div :class="$isMobile ? 'mt-1' : 'pt-0'">
        <search-field
          v-model="filter.searchKeywords"
          :debounce="1000"
          solo
        ></search-field>
        <template v-if="$isDesktop">
          <v-card class="mt-5" elevation="1">
            <v-list>
              <v-list-item @click="v => (filter.querySelected = null)">
                <span>
                  <v-list-item-title>
                    {{ $t("components.fields.categoryListField") }}
                  </v-list-item-title>
                </span>
              </v-list-item>
              <div v-for="(item, index) in config.itemsList" :key="index">
                <list-query-editor
                  :key="index"
                  v-model="config.itemsList[index]"
                  @update:modelValue="update"
                >
                  <v-list-group
                    v-if="item.children && item.children.length > 0"
                    :model-value="active(filter.querySelected, item)"
                    :value="index"
                  >
                    <template v-slot:activator="{ props }">
                      <v-list-item v-bind="props">
                        <v-list-item-title
                          >{{ item.name[locale]
                          }}<v-icon
                            v-if="editor.selected && editor.enable"
                            class="px-3"
                            style="z-index: 3"
                            color="red"
                            right
                            @click.stop="removeCategory(index)"
                            >mdi-delete</v-icon
                          ></v-list-item-title
                        >
                      </v-list-item>
                    </template>
                    <v-list-item
                      v-for="(child, childIndex) in item.children"
                      :key="childIndex"
                      color="primary"
                      :model-value="child"
                      @click="
                        filter.querySelected =
                          config.itemsList[index].children[childIndex].query
                      "
                    >
                      <span>
                        <v-list-item-title>{{
                          child.name[locale]
                        }}</v-list-item-title>
                      </span>
                    </v-list-item>
                  </v-list-group>
                  <v-list-item
                    v-else
                    :model-value="filter.querySelected"
                    color="primary"
                    @click="
                      filter.querySelected = config.itemsList[index].query
                    "
                  >
                    <span>
                      <v-list-item-title
                        >{{ item.name[locale]
                        }}<v-icon
                          v-if="editor.selected && editor.enable"
                          class="px-3"
                          style="z-index: 3"
                          color="red"
                          right
                          @click.stop="removeCategory(index)"
                          >mdi-delete</v-icon
                        ></v-list-item-title
                      >
                    </span>
                  </v-list-item>
                </list-query-editor>
              </div>
              <v-list-item
                v-if="config.itemsList.length == 0"
                @click="filter.querySelected == null"
              >
                <span>
                  <v-list-item-title class="my-1">
                    {{ $t("components.fields.categoryListFieldNull") }}
                  </v-list-item-title>
                </span>
              </v-list-item>
            </v-list>
          </v-card>
        </template>
        <template v-else>
          <v-select
            :item-title="item => item.name[locale]"
            :items="config.itemsList"
            :model-value="nestedCategory"
            :placeholder="$t('components.fields.categorySelectField')"
            return-object
            hide-details
            clearable
            density="compact"
            class="mt-2"
            @change="
              v =>
                v
                  ? (filter.querySelected = nestedCategory = v)
                  : (filter.querySelected = nestedCategory = null)
            "
          ></v-select>
          <v-select
            v-if="
              nestedCategory &&
              nestedCategory.children &&
              nestedCategory.children.length > 0
            "
            :items="nestedCategory.children"
            :item-title="item => item.name[locale]"
            :placeholder="$t('components.fields.subCategorySelectField')"
            :model-value="filter.querySelected"
            return-object
            hide-details
            clearable
            density="compact"
            class="mt-2"
            @change="
              v =>
                v
                  ? (filter.querySelected = v)
                  : (filter.querySelected = nestedCategory)
            "
          ></v-select>
        </template>
      </div>
    </v-col>

    <v-col :cols="$isMobile ? 12 : 9" :class="$isMobile ? 'mt-n4' : 'pt-3'">
      <template v-if="loading">
        <v-row dense>
          <v-col v-for="item in 12" :key="item" cols="12" sm="6" md="4">
            <ok-card-loader
              :target="
                $isMobile
                  ? 'MobileCarouselAnnouncementStore'
                  : 'DesktopCarouselAnnouncementStore'
              "
            ></ok-card-loader>
          </v-col>
        </v-row>
      </template>

      <template v-else-if="items.data && items.data.length">
        <v-row dense>
          <v-col
            v-for="item in items.data"
            :key="item.id"
            :cols="$isMobile ? 12 : 4"
            :sm="$isMobile && !$store.state.builder.editor.phone ? 6 : null"
          >
            <announcement-card
              :announcement="item"
              :store-page="true"
              :dark="config.theme === 'dark'"
            ></announcement-card>
          </v-col>
        </v-row>
      </template>

      <template v-else>
        <v-alert type="info" icon="mdi-magnify">
          {{ $t("components.announBrowser.noAnnouncements") }}
        </v-alert>
      </template>
      <div v-if="items.paginatorInfo.lastPage > 1" class="text-center mt-4">
        <pagination
          v-if="items.paginatorInfo && items.paginatorInfo.lastPage"
          v-model="pagination.page"
          :length="items.paginatorInfo.lastPage"
        ></pagination>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import okCardLoader from "@/components/uiKit/loader/okCardLoader";

import NumberPropVue from "@/components/SiteBuilder/Props/NumberProp.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import QueryMixin from "@/components/SiteBuilder/Blocks/Market/QueryMixin";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import Queries from "@/components/SiteBuilder/Blocks/Store/AnnounBrowser/AnnounBrowserQuery.graphql";

import { mapGetters, mapMutations } from "vuex";
import { ensureItemsCount } from "@/utils/array";
import { sync } from "vuex-pathify";

import get from "lodash/get";
import toString from "lodash/toString";
import isEmpty from "lodash/isEmpty";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    Pagination,
    okCardLoader,
    SearchField: defineAsyncComponent(() =>
      import("@/components/SiteBuilder/Fields/SearchField.vue")
    ),
    AnnouncementCard: defineAsyncComponent(() =>
      import("@/components/Announcement/AnnouncementCard.vue")
    ),
    ListQueryEditor: defineAsyncComponent(() =>
      import("@/components/SiteBuilder/Editors/ListQueryEditor.vue")
    )
  },
  mixins: [BlocksHelperMixin, QueryMixin],
  editableProps: [
    {
      key: "itemsListCount",
      icon: "mdi-format-list-bulleted-type",
      label: "components.announBrowserQuery.numberofcategories",
      field: NumberPropVue,
      bind: {
        min: 0,
        max: 9
      }
    }
  ],
  inject: ["queryUTM"],

  setup() {
    const { locale } = useAuthFrame();
    return { locale };
  },

  data() {
    return {
      nestedCategory: null,
      config: {
        queries: [],
        itemsList: [],
        itemsListCount: 0
      },
      pagination: { page: 1 },

      itemCount: 24,

      items: {
        data: [],
        paginatorInfo: {
          lastPage: 0
        }
      },
      filter: {
        searchKeywords: "",
        querySelected: null
      },
      firstMount: true,

      loading: 0
    };
  },

  computed: {
    ...mapGetters({
      store: "builder/store",
      currentPage: "builder/currentPage"
    }),
    ...sync({ editor: "builder/editor" })
  },

  watch: {
    config: {
      immediate: true,
      handler: "fill"
    },
    pagination: {
      deep: true,
      async handler() {
        this.setPageRoute();
        await this.fetchAnnouncementByQuery();
      }
    },
    filter: {
      deep: true,
      handler() {
        if (this.$isMobile && this.filter.querySelected) {
          this.nestedCategory = this.config.itemsList.find(
            cat =>
              cat.slug === this.filter.querySelected.slug ||
              (cat.children &&
                cat.children.findIndex(
                  ch => this.filter.querySelected.slug === ch.slug
                ) > -1)
          );
        }
        if (this.firstMount) this.firstMount = false;
        else this.pagination = { page: 1 };
        this.setPageRoute();
        this.fetchAnnouncementByQuery();
      }
    },
    $route: {
      deep: true,
      handler(newValue, oldValue) {
        const shouldResetFilters =
          oldValue.name !== newValue.name &&
          oldValue.name !== "store-announcement-show" &&
          this.currentPage.slug === newValue.name;

        if (shouldResetFilters || newValue.params.reset) {
          this.pagination = { page: 1 };
          this.filter = {
            searchKeywords: "",
            querySelected: null
          };
        }
      }
    }
  },

  mounted() {
    const queryRoute = get(this.$route, "query");
    const querySelected = !isEmpty(
      this.config.itemsList.find(
        cat => cat.slug === toString(get(queryRoute, "category", null))
      )
    )
      ? this.config.itemsList.find(
          cat => cat.slug === toString(get(queryRoute, "category", null))
        )
      : this.config.itemsList
          .reduce((newArr, arr) => {
            const { children, ...rest } = arr;
            newArr.push(rest);
            return newArr.concat(children);
          }, [])
          .find(
            cat => cat.slug === toString(get(queryRoute, "category", null))
          );
    this.filter = {
      searchKeywords: toString(get(queryRoute, "q"), ""),
      querySelected: querySelected
    };
    this.pagination = { page: parseInt(get(queryRoute, "page", 1)) };
  },
  methods: {
    ...mapMutations({
      changeEditorTab: "builder/changeEditorTab",
      setInlineLock: "builder/setInlineLock"
    }),
    fill() {
      this.config.itemsList = ensureItemsCount(
        this.config.itemsList,
        this.config.itemsListCount,
        () => ({
          slug: null,
          query: null,
          name: {
            fr: "Categorie",
            ar: "فئة",
            en: "Category"
          },
          children: []
        })
      );
    },
    routerQuery(searchKeywords, categorySlug, page) {
      let query = {};
      if (searchKeywords)
        query.q = toString(searchKeywords).split(" ").join("-");
      if (get(categorySlug, "slug"))
        query.category = get(categorySlug, "slug", undefined);
      if (!this.filter.querySelected) query.page = page ? page : undefined;

      if (this.queryUTM.utm_source) query.utm_source = this.queryUTM.utm_source;
      if (this.queryUTM.utm_medium) query.utm_medium = this.queryUTM.utm_medium;
      if (this.queryUTM.utm_campain)
        query.utm_campaign = this.queryUTM.utm_campain;

      return query;
    },
    setPageRoute() {
      if (this.$route.meta.hasAnnounBrowser === true) {
        this.$router
          .replace({
            path: this.$route.path,
            query: this.routerQuery(
              this.filter.searchKeywords,
              this.filter.querySelected,
              this.pagination.page
            )
          })
          .catch(() => {});
      }
    },
    async fetchAnnouncementByQuery() {
      this.items = {
        data: [],
        paginatorInfo: {
          lastPage: 0
        }
      };
      if (!this.filter.querySelected) {
        const variables = {
          q: this.filter.searchKeywords,
          filter: {
            page: this.pagination.page,
            count: this.itemCount,
            storeId: this.store.id
          }
        };
        this.items = await this.fetchAnnouncement(variables);
      } else {
        const vm = this;
        this.joinQuery(this.filter.querySelected).cluster.forEach(
          async cluster => {
            const variables = {
              q: cluster.q
                ? cluster.q + " " + this.filter.searchKeywords
                : this.filter.searchKeywords,
              filter: {
                page: this.pagination.page,
                count: Math.floor(
                  this.itemCount / this.filter.querySelected.length
                ),
                storeId: this.store.id,
                ...cluster.filter
              }
            };
            const data = await this.fetchAnnouncement(variables);
            vm.items.data.push(...data.data);
            if (data.paginatorInfo.lastPage > vm.items.paginatorInfo.lastPage) {
              vm.items.paginatorInfo.lastPage = data.paginatorInfo.lastPage;
            }
            vm.items.data = [
              ...new Map(
                this.items.data.map(item => [item["id"], item])
              ).values()
            ];
          }
        );
      }
    },
    async fetchAnnouncement(variables) {
      this.loading = true;
      const { data } = await this.$apollo.query({
        query: Queries.AnnouncementBrowser,
        fetchPolicy: "network-only",
        skip: !this.store.id,
        variables
      });
      this.loading = false;
      return get(data, "search.announcements", []);
    },
    removeCategory(index) {
      this.config.itemsList.splice(index, 1);
      this.config.itemsListCount--;
      this.changeEditorTab("props");
      this.setInlineLock(null);
      this.update();
    },
    active(value, list) {
      return (
        value && !isEmpty(list.children.find(cat => cat.slug === value.slug))
      );
    }
  }
};
</script>
