<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="items"
    :items="announcementList.data"
    :search-input="filter.search"
    :loading="loading > 0"
    variant="outlined"
    chips
    small-chips
    item-value="id"
    :item-title="item => (filter.search === item.id ? item.id : item.title)"
    :label="$t('components.fields.announField')"
    :multiple="multiple"
    :menu-props="{ closeOnContentClick: false }"
  >
    <template #item="{item}">
      <span>
        <v-list-item-title>
          {{ item.title }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ formatDateTime(item.refreshedAt) }}
        </v-list-item-subtitle>
        <v-list-item-subtitle v-if="item.isFromStore">
          <div
            class="d-flex align-center flex-row flex-gap-2 text-decoration-none"
          >
            <div>
              <store-img
                style="border-radius:50%"
                :store="item.store"
                cover
                width="28"
                height="28"
                :aspect-ratio="1"
              ></store-img>
            </div>

            <div
              style="line-height:1rem"
              class="text-capitalize font-weight-bold"
            >
              {{ item.store.name }}
            </div>
          </div>
        </v-list-item-subtitle>
      </span>
    </template>

    <template #selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        @click="data.select"
        @click:close="remove(data.item)"
      >
        {{ data.item.id }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script>
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import gql from "graphql-tag";

export default {
  props: {
    modelValue: {
      type: [Object, Number, String, Array],
      default: null
    },
    multiple: {
      type: [Boolean],
      default: false
    }
  },
  setup() {
    const { user } = useAuthFrame();

    return {
      user
    };
  },

  data() {
    return {
      announcementList: { data: [] },
      loading: 0,
      page: 1,
      count: 20,
      items: this.modelValue,
      filter: {
        search: "",
        category: null,
        status: null,
        statuses: ["PUBLISHED"],
        hasDelivery: null,
        user: null,
        store: null,
        categoryChildren: null
      }
    };
  },
  watch: {
    items(val) {
      this.$emit("update:modelValue", val);
    }
  },
  methods: {
    remove(item) {
      const index = this.items.indexOf(item.id);
      if (index >= 0) this.items.splice(index, 1);
    }
  },

  apollo: {
    announcementListForAdmin: {
      loadingKey: "loading",
      query: gql`
        query($filter: AnnouncementListFilter!, $count: Int!, $page: Int) {
          announcementListForAdmin(
            filter: $filter
            count: $count
            page: $page
          ) {
            data {
              id
              title
              refreshedAt
              isFromStore
              store {
                name
              }
            }
          }
        }
      `,
      skip() {
        return !this.user.isAdmin;
      },
      variables() {
        var aFilter = {};

        if (this.filter.search) {
          aFilter.search = this.filter.search;
        }

        if (this.filter.statuses != null) {
          aFilter.statuses = this.filter.statuses;
        }

        if (this.filter.hasDelivery != null) {
          aFilter.hasDelivery = this.filter.hasDelivery;
        }

        if (this.filter.store) {
          aFilter.storeId = this.filter.store.id;
        }

        if (this.filter.categoryChildren) {
          aFilter.categoryId = this.filter.categoryChildren;
        } else {
          if (this.filter.category) {
            aFilter.categoryId = this.filter.category.id;
          }
        }

        if (this.filter.user) {
          aFilter.userId = this.filter.user.id;
        }

        return {
          page: this.page,
          count: this.count,
          filter: aFilter
        };
      },
      result({ data }) {
        this.announcementList.data.push(...data.announcementListForAdmin.data);
        this.announcementList.data = [
          ...new Map(
            this.announcementList.data.map(item => [item["id"], item])
          ).values()
        ];
      }
    }
  }
};
</script>

<style></style>
